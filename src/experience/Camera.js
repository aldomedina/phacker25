import * as THREE from "three";
import Experience from "./Experience";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default class Camera {
  constructor(_experience) {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;
    this.canvas = this.experience.canvas;
    this.setInstance();
    this.setOrbitiControl();
  }

  setInstance() {
    const aspect = this.sizes.width / this.sizes.height;
    this.instance = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
    //   let size = 2;
    //  this.instance = new THREE.OrthographicCamera(-size,size,size*aspect,-size*aspect,0.1,100);
    this.instance.position.x = 0;
    this.instance.position.y = 5;
    this.instance.position.z = 15.0;
    this.scene.add(this.instance);
  }

  setOrbitiControl() {
    this.controls = new OrbitControls(this.instance, this.canvas);

    this.controls.dampingFactor = 0.01;
    this.controls.enableDamping = true;
    this.controls.enableZoom = false;
    this.controls.minDistance = 3.0;
    this.controls.target.y += 2.0;
    this.controls.maxDistance = 15.0;
    this.controls.minPolarAngle = Math.PI * 0.4;
    this.controls.maxPolarAngle = Math.PI * 0.55;
    this.controls.enablePan = false;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    if (this.controls) this.controls.update();
  }
}
