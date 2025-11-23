import * as THREE from "three";
import Time from "./utils/Time.js";
import Camera from "./Camera.js";
import Sizes from "./utils/Sizes.js";
import Renderer from "./Renderer.js";
import Resources from "./utils/Resources.js";
import sources from "./sources.js";
import Debug from "./utils/Debug.js";
import Environment from "./world/Environment.js";
import Raycast from "./utils/RayCast.js";
import PointerInput from "./utils/PointerInput.js";
import PrimaveraHacker from "./phacker/PrimaveraHacker.js";
import CameraController from "./phacker/CameraController.js";

let instance = null;

export default class Experience {
  constructor(_canvas) {
    if (instance) {
      return instance;
    }
    instance = this;
    window.experience = this;

    this.canvas = _canvas;

    this.debug = new Debug();

    this.sizes = new Sizes();
    this.sizes.on("resize", () => this.resize());

    this.time = new Time();

    this.time.on("tick", () => this.update());

    this.scene = new THREE.Scene();

    this.resources = new Resources(sources);

    this.camera = new Camera();

    this.renderer = new Renderer();

    this.pointer_input = new PointerInput();
    this.raycaster = new Raycast();

    //this.world = new World();

    this.environment = new Environment();

    this.primavera_hacker = new PrimaveraHacker();

    //this.g_world = new GWorld();

    //
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    if (this.primavera_hacker.update) {
      this.primavera_hacker.update();
    }
    if (this.multiplayer) this.multiplayer.update();
    this.renderer.update();
    if (this.debug.active) {
      this.debug.stats.update();
    }
  }

  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");
    this.time.destroy();
    this.sizes.destroy();
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        for (const key in child.material) {
          const value = child.material[key];
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });
    this.camera.controls.dispose();
    this.renderer.instance.dispose();
    if (this.debug.active) {
      this.debug.ui.destroy();
    }

    // Reset singleton instance
    instance = null;
    window.experience = null;
  }
}
