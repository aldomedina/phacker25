
import * as THREE from "three/webgpu";
import Experience from "../Experience";
import EventEmitter from "./EventEmitter";

export default class Raycast extends EventEmitter
{
    constructor()
    {
        super();

        this.experience = new Experience();
        this.pointer_input = this.experience.pointer_input;
        this.camera = this.experience.camera.instance;
        this.scene = this.experience.scene;
        const pointer_input = this.experience.pointer_input;
        
        this.obj_dict = {};

        const ray_cast = new THREE.Raycaster();
        pointer_input.on("down",(_arg)=>{
            const _p = new THREE.Vector2(_arg.x,-_arg.y).multiplyScalar(2.0);
            ray_cast.setFromCamera(_p,this.camera);

            const intersects = ray_cast.intersectObjects(this.scene.children);
            intersects.map((inter)=>{
                if(inter.object.userData.name == undefined)
                {
                    if(this.obj_dict[inter.object.uuid])
                    {
                        console.log("OK")
                        this.trigger("hit",[{
                            "name":inter.object.uuid,
                            "intersect":inter
                        }]);
                    }

                }
            });

        });
        pointer_input.on("up",()=>{
            //  u_input_pos_press.value = 0.0;

        });
    }

    register(_obj)
    {
        this.obj_dict[_obj.uuid] = _obj;
        console.log(_obj.uuid)
    }

    unregister(_obj)
    {
        delete this.obj_dict[_obj.uuid];
    }

}