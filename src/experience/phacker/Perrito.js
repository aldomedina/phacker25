import { TransformControls } from "three/examples/jsm/Addons.js";
import Experience from "../Experience";
import * as THREE from "three/webgpu";
import { WiggleBone } from "wiggle";
import {WiggleRigHelper} from "wiggle/helper"
import { length, mx_noise_float, time,positionGeometry, sin, uniform, uv, vec3, velocity, max, smoothstep, dot, sub, positionLocal, positionWorld, texture } from "three/tsl";
import { MathUtils } from "three";
import { randInt } from "three/src/math/MathUtils.js";
export default class Perrito
{
    constructor()
    {
        this.experience = new Experience();
        this.init();
    }

    init()
    {
        const perrito_model = this.experience.resources.items.perrito;
        const scene = this.experience.scene;

        const instance = perrito_model.scene.children[0];
        const material = instance.children[0].material;
     
        material.transparent = true;
        material.needsUpdate = true;
        material.roughness = 0.01;
        

        const scale = 3;
        instance.position.x-=scale*.25;
        instance.position.y = 3.0;
        instance.scale.multiplyScalar(scale)

        instance.children[0].renderOrder = 2;

        const mesh = instance.children[0]
        const wiggleBones = [];

        const helper = new WiggleRigHelper({
        skeleton: mesh.skeleton,
        dotSize: 0.2,
        lineWidth: 0.02,
        });
        scene.add(instance);


        const next_root_pos = new THREE.Vector3();

        const rootBone = scene.getObjectByName("Root");
        mesh.skeleton.bones.forEach((bone) => {
            if (bone.name != "Root") {
         
                const wiggleBone = new WiggleBone(bone, {
                    velocity:MathUtils.randFloat(0.1, 0.2),
                });
                wiggleBones.push(wiggleBone);

            }
        });
      
        const raycaster = new THREE.Raycaster();
        const pointer = this.experience.pointer_input;

        const control = new TransformControls(this.experience.camera.instance,this.experience.renderer.instance.domElement)
        control.addEventListener("dragging-changed", (event)=>{
          
        });
        const grabOffset = new THREE.Vector3();
        const tmpV3     = new THREE.Vector3();
        let dragging = false;
        const camdir=new THREE.Vector3(0.0,0.0,0.0);
        const dragPlane = new THREE.Plane(); 
        const camera = this.experience.camera.instance;
        let hasHit = false;
        const rot_vel = 0.005;
        let rot_dir = new THREE.Vector3(MathUtils.randFloat(-1,1), MathUtils.randFloat(-1,1), MathUtils.randFloat(-1,1)).multiplyScalar(rot_vel);
        const planeHit  = new THREE.Vector3();
        const u_hit_point= uniform(new THREE.Vector3())
        const u_hit_normal = uniform(new THREE.Vector3());

        this.do_glitch = 0.0;
        let glitch_count = randInt(5,10)

        this.experience.renderer.instance.domElement.addEventListener("pointerdown", (event) => {
            if(hasHit) return;
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(instance, true);    
            if(intersects.length > 0)
            {
                this.experience.camera.controls.enabled = false;
                const hit = intersects[0];   
                const camDir = camera.getWorldDirection(tmpV3).normalize();
                camdir.copy(camDir);
                dragPlane.setFromNormalAndCoplanarPoint(camDir, hit.point);
                grabOffset.copy(hit.point).sub(next_root_pos);
                u_hit_normal.value = hit.normal.clone()
                u_hit_point.value = hit.point.clone();
                dragging = true;
                hasHit = true;
                glitch_count--;
                if(glitch_count == 0)
                {
                    glitch_count = randInt(5,10)
                    this.do_glitch = 1.0;
                }
                   
            }
        });
        const center = new THREE.Vector3(0, 0, 0); 
        const maxRadius = 2; 
        this.experience.canvas.addEventListener('pointermove', (e) => {
            if(hasHit)
            {
                const mouse = new THREE.Vector2();
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                raycaster.setFromCamera(mouse, camera);
                 if (raycaster.ray.intersectPlane(dragPlane, planeHit)) {
                    next_root_pos.copy(planeHit).sub(grabOffset);
                    const offset = next_root_pos.clone().sub(center);
                    if (offset.length() >maxRadius) {
                        offset.setLength(maxRadius);
                        next_root_pos.copy(center).add(offset);
                    }
                   
                                    
                }
            }
         
        }, { passive: true });

        this.experience.canvas.addEventListener('pointerup', (e) => {
            hasHit = false;
            rot_dir.copy(new THREE.Vector3(MathUtils.randFloat(-1,1), MathUtils.randFloat(-1,1), MathUtils.randFloat(-1,1)).multiplyScalar(rot_vel));   
            this.experience.camera.controls.enabled = true;
           
        }, { passive: true });

        const _time = this.experience.time;
        let time_rot = 0.0;
        _time.on("tick",()=>{
            
            if(!hasHit)
            {
                const t = time_rot;
                rootBone.position.y+= Math.sin(t * 0.1) * 0.05;
                rootBone.rotation.x=(Math.cos(-3.0+t*0.1))*.5;

                rootBone.rotation.y= 90.0;

                rootBone.rotation.z=(Math.sin(t*.3))*.5;

                time_rot+=_time.step;

                this.do_glitch*=.9;
            }
            
            rootBone.position.lerp(next_root_pos,0.25);
            next_root_pos.multiplyScalar(0.99);
            wiggleBones.forEach(w => w.update());
            
        });


    }
}