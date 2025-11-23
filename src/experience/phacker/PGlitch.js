import { RenderTarget, Vector2, QuadMesh, NodeMaterial, RendererUtils, TempNode, NodeUpdateType } from 'three/webgpu';
import { nodeObject, Fn, float, vec4, uv, texture, passTexture, uniform, sign, max, convertToTexture, mx_noise_float, mix, floor, time, vec3, mod, vec2, clamp, hue } from 'three/tsl';
import { randFloat } from 'three/src/math/MathUtils.js';
import { gaussianBlur } from 'three/examples/jsm/tsl/display/GaussianBlurNode.js';
import { NearestFilter, RepeatWrapping } from 'three';
import Experience from '../Experience';

/** @module AfterImageNode **/

const _size = /*@__PURE__*/ new Vector2();
const _quadMeshComp = /*@__PURE__*/ new QuadMesh();

let _rendererState;

/**
 * Post processing node for creating an after image effect.
 *
 * @augments TempNode
 */
class AfterImageNode extends TempNode {

	static get type() {

		return 'AfterImageNode';

	}

	/**
	 * Constructs a new after image node.
	 *
	 * @param {TextureNode} textureNode - The texture node that represents the input of the effect.
	 * @param {Number} [damp=0.96] - The damping intensity. A higher value means a stronger after image effect.
	 */
	constructor( textureNode, damp = 0.96 ) {

		super( 'vec4' );


		this.experience = new Experience();

		/**
		 * The texture node that represents the input of the effect.
		 *
		 * @type {TextureNode}
		 */
		this.textureNode = textureNode;

		/**
		 * The texture represents the pervious frame.
		 *
		 * @type {TextureNode}
		 */
		this.textureNodeOld = texture();

		/**
		 * The damping intensity as a uniform node.
		 *
		 * @type {UniformNode<float>}
		 */
		this.damp = uniform( damp );

		/**
		 * The render target used for compositing the effect.
		 *
		 * @private
		 * @type {RenderTarget}
		 */
		this._compRT = new RenderTarget( 1, 1, { depthBuffer: false } );
		this._compRT.texture.name = 'AfterImageNode.comp';
		this._compRT.texture.wrapS = RepeatWrapping;
		this._compRT.texture.wrapT = RepeatWrapping;
		this._compRT.texture.minFilter = NearestFilter;
		this._compRT.texture.magFilter = NearestFilter;
		/**
		 * The render target that represents the previous frame.
		 *
		 * @private
		 * @type {RenderTarget}
		 */
		this._oldRT = new RenderTarget( 1, 1, { depthBuffer: false } );
		this._oldRT.texture.name = 'AfterImageNode.old';
		this._oldRT.texture.wrapS = RepeatWrapping;
		this._oldRT.texture.wrapT = RepeatWrapping;
		this._oldRT.texture.minFilter = NearestFilter;
		this._oldRT.texture.magFilter = NearestFilter;
		
		/**
		 * The result of the effect is represented as a separate texture node.
		 *
		 * @private
		 * @type {PassTextureNode}
		 */
		this._textureNode = passTexture( this, this._compRT.texture );

		/**
		 * The `updateBeforeType` is set to `NodeUpdateType.FRAME` since the node renders
		 * its effect once per frame in `updateBefore()`.
		 *
		 * @type {String}
		 * @default 'frame'
		 */
		this.updateBeforeType = NodeUpdateType.FRAME;


		this.u_hide = uniform(0.0);

	}

	/**
	 * Returns the result of the effect as a texture node.
	 *
	 * @return {PassTextureNode} A texture node that represents the result of the effect.
	 */
	getTextureNode() {

		return this._textureNode;

	}

	/**
	 * Sets the size of the effect.
	 *
	 * @param {Number} width - The width of the effect.
	 * @param {Number} height - The height of the effect.
	 */
	setSize( width, height ) {
	
		this._compRT.setSize( width, height );
		this._oldRT.setSize( width, height );

	}

	/**
	 * This method is used to render the effect once per frame.
	 *
	 * @param {NodeFrame} frame - The current node frame.
	 */
	updateBefore( frame ) {

		const { renderer } = frame;

		_rendererState = RendererUtils.resetRendererState( renderer, _rendererState );

		//

		if(this.experience.primavera_hacker.perrito)
		{
			if(this.u_extra)
			{
				this.u_extra.value = this.experience.primavera_hacker.perrito.do_glitch;
			}
		}

		const textureNode = this.textureNode;
		const map = textureNode.value;

		const textureType = map.type;

		this._compRT.texture.type = textureType;
		this._oldRT.texture.type = textureType;
	
		renderer.getDrawingBufferSize( _size );

		this.setSize( _size.x, _size.y );

		const currentTexture = textureNode.value;

		this.textureNodeOld.value = this._oldRT.texture;

		// comp

		renderer.setRenderTarget( this._compRT );
		_quadMeshComp.render( renderer );

		// Swap the textures

		const temp = this._oldRT;
		this._oldRT = this._compRT;
		this._compRT = temp;

		//

		textureNode.value = currentTexture;

		RendererUtils.restoreRendererState( renderer, _rendererState );

	}

	set_hide(_val)
	{
		this.u_hide.value = _val;
	}

	/**
	 * This method is used to setup the effect's TSL code.
	 *
	 * @param {NodeBuilder} builder - The current node builder.
	 * @return {PassTextureNode}
	 */
	setup( builder ) {

		const textureNode = this.textureNode;
		const textureNodeOld = this.textureNodeOld;
		const _time = 0.0;
		const _size = 2.0;
		const u_time = uniform(_time);
		const u_size = uniform(_size);
		const u_extra = uniform(0.0);
		this.u_extra = u_extra;
		this.glitch_interval = setInterval(() => {
			u_time.value += Math.random()+.2;
			u_size.value = randFloat(2.0,10.0);
		}, 5000);

		//

		const uvNode = textureNode.uvNode || uv();

		textureNodeOld.uvNode = uvNode;

		const sampleTexture = ( uv ) => textureNode.sample( uv );

		const when_gt = Fn( ( [ x_immutable, y_immutable ] ) => {

			const y = float( y_immutable ).toVar();
			const x = vec4( x_immutable ).toVar();

			return max( sign( x.sub( y ) ), 0.0 );

		} );

		const u_hide = this.u_hide;
		const afterImg = Fn( () => {
			const __scale = float(.999);
			const _uv = mix(uv(),uv().mul(.99),0.0);//floor(uv().mul(100.0)).div(100.0);
			
			const texelOld = textureNodeOld.sample( _uv.add(vec2(0.0,-1.0/900.0)));

			const texelNew = vec4( sampleTexture( _uv ) );

			const si = u_size;
			const puv = _uv.mul(4.0)
			const p_uv = vec3(floor(puv.mul(si)).div(si),1.0);
			const c_time = 0.0;
			const nois = mx_noise_float(p_uv.add(vec3(0.0,0.0,u_time)),1.0);	
			const glitch = hue(texelOld,texelNew.length().mul(Math.PI).mul(0.2));
			let  glitch_mix = mix(mix(texelNew,glitch,texelOld.r.step(0.2).oneMinus()),textureNodeOld.sample(_uv.add(nois.mul(time.add(Math.PI*2.0)).mul(1.0/640.0))),u_hide);

			glitch_mix = mix(glitch_mix,textureNode.sample(texelOld.xy),u_extra);

			return mix( texelNew, glitch_mix ,max(nois.step(0.3).oneMinus(),mix(u_hide,.9,u_extra)));

		} );

		//

		const materialComposed = this._materialComposed || ( this._materialComposed = new NodeMaterial() );
		materialComposed.name = 'AfterImage';
		materialComposed.fragmentNode = afterImg();

		_quadMeshComp.material = materialComposed;

		//

		const properties = builder.getNodeProperties( this );
		properties.textureNode = textureNode;

		//

		return this._textureNode;

	}

	/**
	 * Frees internal resources. This method should be called
	 * when the effect is no longer required.
	 */
	dispose() {

		this._compRT.dispose();
		this._oldRT.dispose();
		clearInterval(this.glitch_interval);

	}

}

export const afterImage = ( node, damp ) => nodeObject( new AfterImageNode( convertToTexture( node ), damp ) );

export default AfterImageNode;
