
import * as THREE from "three/webgpu";
import Experience from "../Experience";
import { billboarding, modelPosition, modelViewMatrix, positionGeometry, positionLocal, positionView, uv, vec2, vec4,vec3, viewportUV, uniform, max, float, abs, length, min, smoothstep, texture, alphaT, depth } from "three/tsl";
import { BackSide, DoubleSide } from "three";

export default class RoundedMask
{
    constructor()
    {
        this.experience = new Experience();
        this.init();
    }

    init()
    {

        const {scene,sizes} = this.experience;

        const instance = new THREE.Mesh(
            new THREE.PlaneGeometry(2,2,2,2),
            new THREE.MeshBasicNodeMaterial()
        );

        const material = instance.material;
        material.depthTest = false;

        material.transparent = true;
        

        const u_resolution = uniform(new THREE.Vector2(sizes.width, sizes.height));
        const aspect = u_resolution.x.div(u_resolution.y);

        const r_px         = uniform(10.0);   // radio esquina px
        const thickness_px = uniform(1.0);    // grosor borde px
        const aa_px        = uniform(1.5);    // anti-alias px

        const px2ndc  = float(2.0).div(u_resolution.y);
        const r       = r_px.mul(px2ndc);
        const t_ndc   = thickness_px.mul(px2ndc);
        const aa_ndc  = aa_px.mul(px2ndc);

        const half_size = vec2(aspect.mul(0.99), 0.7);

        const p = uv()
            .add(vec2(0.0, 0.05))
            .mul(2.0)
            .sub(1.0)
            .mul(vec2(aspect, 1.0));

        const b   = half_size.sub(vec2(r));
        const q   = abs(p).sub(b);
        const sdf = length(max(q, vec2(0.0))).sub(r);

        const fill = sdf.step(0.0).oneMinus();

        const border = smoothstep(t_ndc.add(aa_ndc), t_ndc.sub(aa_ndc), abs(sdf));

        const d_box = max(fill, border);  // relleno + borde

        material.vertexNode = vec4(positionGeometry.x,positionGeometry.y,0.0,1.0);
        const color = vec3(1.0);
        material.colorNode = vec4(color,d_box);
        

       // scene.add(instance);

        this.experience.resources.items.logo.colorSpace = THREE.SRGBColorSpace;
        const logo_texture = texture(this.experience.resources.items.logo);
        const aspect_logo = this.experience.resources.items.logo.source.data.height/this.experience.resources.items.logo.source.data.width;
        const _aspect = this.experience.sizes.width / this.experience.sizes.height ;
        const u_aspect =  uniform(_aspect);
        const n = vec3(logo_texture.r);
        const cuenta = positionGeometry.y.mul(u_aspect);

        const logo_instance = new THREE.Mesh(
            new THREE.PlaneGeometry(2,2*aspect_logo,1),
            new THREE.MeshBasicNodeMaterial({
                transparent:true,
                depthTest:true,
                depthWrite:false
            })
        );
                const logo_material = logo_instance.material;

        logo_instance.geometry.translate(0,-aspect_logo,0);
        logo_instance.renderOrder = 1;


        const mask_instance = new THREE.Mesh(
            new THREE.PlaneGeometry(2,2*aspect_logo,1,1),
            new THREE.MeshBasicNodeMaterial({
                transparent:true,
                depthTest:true,
                depthWrite:false,
                color:new THREE.Color("green")
            })
        )
        mask_instance.geometry.translate(0,-aspect_logo*3,0.0)
        logo_material.vertexNode = vec4(positionGeometry.x,cuenta.add(1.0),0.0,1.0);
        mask_instance.material.vertexNode = vec4(positionGeometry.x,cuenta.div(1.4).add(1.4),0.0,1.0);




       // logo_material.colorNode =logo_texture
        


        this.experience.sizes.on("resize",()=>{
            const _aspect = this.experience.sizes.width / this.experience.sizes.height ;
            u_aspect.value = _aspect;
        });


        function roundedRectPath(x, y, w, h, r) {
            const rr = Math.min(r, w/2, h/2);
            const p = new Path2D();
            p.moveTo(x+rr, y);
            p.lineTo(x+w-rr, y);
            p.arcTo(x+w, y, x+w, y+rr, rr);
            p.lineTo(x+w, y+h-rr);
            p.arcTo(x+w, y+h, x+w-rr, y+h, rr);
            p.lineTo(x+rr, y+h);
            p.arcTo(x, y+h, x, y+h-rr, rr);
            p.lineTo(x, y+rr);
            p.arcTo(x, y, x+rr, y, rr);
            p.closePath();
            return p;
        }
        const size = this.experience.sizes;
      
        const _instance = new THREE.Mesh(new THREE.PlaneGeometry(2,2), new THREE.MeshBasicNodeMaterial());
        const img_logo = this.experience.resources.items.logo.image;
        const canvas_material = _instance.material;
        canvas_material.vertexNode = vec4(positionGeometry.xy,0.0,1.0);
        canvas_material.transparent=true;
        canvas_material.depthTest = false;
        canvas_material.fog=false;


        let aa = 0;
        let texture_canvas =null
        const dibujar_mascara = () =>{

            const canvas = document.createElement("canvas");
          
            const ctx = canvas.getContext("2d");

            canvas.width = size.width;
            canvas.height = size.height;

            const img_w = canvas.width;
            const img_h = canvas.width*aspect_logo;

            const W = size.width;
            const H = size.height;

            let HOLE_W = W*.99;
            let RADIUS = size.width*0.018;
            const _aspect = this.experience.sizes.width / this.experience.sizes.height ;


            const x = (W - HOLE_W) / 2;
            const extra = img_h*0.02;
            const y = img_h+extra;
            const resta = y-img_h;
            let HOLE_H = Math.abs(((size.height)-y)-extra);



            

            const path = roundedRectPath(x, y, HOLE_W, HOLE_H, RADIUS);
        
            ctx.save();
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = "#ffffff";
            
            ctx.fillRect(0,0,canvas.width,canvas.height);
       
            ctx.restore();

            ctx.save();
            ctx.globalCompositeOperation = "destination-out";
             ctx.fill(path);
            ctx.restore();

            ctx.drawImage(img_logo,0,0,img_w,img_h);
            
            texture_canvas = new THREE.CanvasTexture(canvas);

            canvas_material.map = texture_canvas
            canvas_material.map.needsUpdate=true;

        }



       // 

        scene.add(_instance);
 

        size.on("resize",()=>{
        

            dibujar_mascara();

        });
        
        dibujar_mascara();




    }    
}