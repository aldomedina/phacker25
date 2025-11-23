import * as THREE from "three/webgpu";
import Experience from "./Experience";
import Postpro from "./world/Postpro";
import { RectAreaLightTexturesLib } from 'three/addons/lights/RectAreaLightTexturesLib.js';
import EventEmitter from "./utils/EventEmitter";

export default class Renderer extends EventEmitter{
    
    constructor()
    {
        super();
        this.experience = new Experience();
        this.camera = this.experience.camera;
        this.canvas = this.experience.canvas;
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;    
        
        
        this.setInstanceWebGPU();
          this.setPostpro();
    }

    setInstanceWebGPU()
    {

        this.instance = new THREE.WebGPURenderer({
            canvas:this.canvas,
            antialias:true,
            forceWebGL:true
        });
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
        this.instance.setSize(this.sizes.width,this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
        this.instance.toneMapping = THREE.ACESFilmicToneMapping;
        this.instance.toneMappingExposure =0.5
    }

    setPostpro()
    {
        this.postpro = new Postpro(this.instance);
    }

    update()
    {
        if(this.postpro)
        {
            this.postpro.render();

        }else{
           
            this.instance.renderAsync(this.scene,this.camera.instance);
        }

        this.trigger("postrender");

        if(this.take_screenshoot)
        {
            this.take_screenshoot = false;
            const _data = this.canvas.toDataURL();
            this._postscreenshoot(_data);

        }
    }

    resize()
    {
        this.instance.setSize(this.sizes.width,this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
       
    }
}