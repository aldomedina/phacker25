import Experience from "../Experience";
import {
  pass,
  uv,
  mx_noise_float,
  //   color,
  //   vec4,
  //   float,
  //   uniform,
  //   mrt,
  //   output,
  //   mix,
  //   vec3,
  //   velocity,
  //   screenUV,
  //   rangeFogFactor,
  //   hue,
  //   saturate,
  //   time,
  //   sin,
  //   blur,
  //   normalView,
  //   max,
  //   min,
  //   overlay,
} from "three/tsl";
import { PostProcessing } from "three/webgpu";
// import * as THREE from 'three';
// import { EffectComposer, FilmPass, GammaCorrectionShader, OutputPass, RenderPass, RenderPixelatedPass, SAOPass, ShaderPass, UnrealBloomPass } from "three/examples/jsm/Addons.js";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
// import PixelationPassNode, { pixelationPass } from "three/examples/jsm/tsl/display/PixelationPassNode.js";
// import { dof } from 'three/examples/jsm/tsl/display/DepthOfFieldNode.js';
// import { motionBlur } from "three/examples/jsm/tsl/display/MotionBlur.js";
// import { ao } from 'three/addons/tsl/display/GTAONode.js';
// import { denoise } from "three/examples/jsm/tsl/display/DenoiseNode.js";
// import { step,smoothstep } from "three/tsl";
import { afterImage } from "../phacker/PGlitch.js";

export default class Postpro {
  constructor(_renderer) {
    this.experience = new Experience();
    this.renderer = _renderer;
    this.camera = this.experience.camera;
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.debug = this.experience.debug;

    this.setComposer();
  }

  setComposer() {
    this.composer = new PostProcessing(this.renderer);

    this.passes = {
      dof: {},
    };
    this.passes.scene = pass(this.scene, this.camera.instance);
    const scene_pass = this.passes.scene;

    this.passes.bloom = bloom(scene_pass, 0.2, 0.2, 0.4);
    this.passes.bloom.params = {
      threshold: 0.02,
    };

    const pass_with_bloom = scene_pass.add(this.passes.bloom);

    const pglitch = afterImage(pass_with_bloom, 1.0);

    this.glitch = pglitch;

    const no = mx_noise_float(uv().mul(this.sizes.width), 0.01);

    this.composer.outputNode = pglitch//scene_pass.add(this.passes.bloom)//pglitch.add(no);


  

  }

  render() {
    this.composer.renderAsync();
  }
}
