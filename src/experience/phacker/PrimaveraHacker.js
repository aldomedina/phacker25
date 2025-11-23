import * as THREE from "three/webgpu";
import Experience from "../Experience";
// import Manifiesto from "./Manifiesto";
import {
  ImprovedNoise,
  MeshSurfaceSampler,
} from "three/examples/jsm/Addons.js";
import {
  // abs,
  floor,
  // atan,
  // atan2,
  mx_noise_float,
  // cos,
  float,
  // length,
  // max,
  // sqrt,
  step,
  uv,
  vec2,
  vec3,
  vec4,
  smoothstep,
  sin,
  time,
  mix,
  // positionLocal,
  // positionWorld,
  mod,
  round,
  // clamp,
  distance,
  mx_noise_vec3,
  uniform,
} from "three/tsl";
import { instancedBufferAttribute } from "three/tsl";
import { instanceIndex } from "three/tsl";
// import { uniform } from "three/tsl";
import { randFloat } from "three/src/math/MathUtils.js";
import { texture } from "three/tsl";
import { hash } from "three/tsl";
import { RepeatWrapping } from "three";
// import Raycast from "../utils/RayCast";
import CameraController from "./CameraController";
import Perrito from "./Perrito";
import RoundedMask from "./RoundedMask";

export default class PrimaveraHacker {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resorces = this.experience.resources;
    this.controller = this.experience.controller;
    this.camera = this.experience.camera;
    this.resorces.on("ready", () => {
      this.init();
    });
  }

  init() {
    //  camera contorlller

    const camera_controller = new CameraController();
    // medio verga
    this.experience.camera.controller = camera_controller;

    //  world

    const floor_size = 200;
    const floor_material = new THREE.MeshStandardNodeMaterial();
    
    floor_material.metalnessNode = uniform(1.0);
    floor_material.roughnessNode = uniform(0.9);
    floor_material.wireframe = false;
    floor_material.flatShading = true;

    const pixelated = 200;
    const _uv = uv();
    const _pix_uv = floor(uv().mul(pixelated)).div(pixelated);
    let dist_center = sin(
      _uv.sub(vec2(0.5)).length().add(time.mul(-0.05)).mul(30.0)
    )
      .mul(0.5)
      .add(0.5);
    const radius = float(0.2);
    const thickness = float(0.05);
    let linea = smoothstep(radius.add(thickness), radius, dist_center).mul(
      smoothstep(radius.sub(thickness), radius, dist_center)
    );
    linea = step(0.05, linea);
    const noise_color = mx_noise_float(_pix_uv.mul(10.0).add(vec3(0.0, 0.0, time.mul(0.3))), 1.0);
    let color_floor = vec3(
      mx_noise_float(_pix_uv.mul(10.0).add(vec3(0.0, 0.0, time.mul(0.3))), 1.0)
    );
    color_floor = mix(vec3(0.0), vec3(0.05, 0.1, 0.0), color_floor);

    floor_material.colorNode = vec3(0.1);
    floor_material.emissiveNode = mix(vec3(0.0,0.0,0.0), vec3(10.0, 0.0, 0.0), linea);

    const floor_instance = new THREE.Mesh(
      new THREE.PlaneGeometry(floor_size, floor_size, 12, 12).rotateX(
        -Math.PI * 0.5
      ),
      floor_material
    );

    const i_noise = new ImprovedNoise();
    const floor_positions = floor_instance.geometry.attributes.position.array;

    for (var i = 0; i < floor_positions.length; i += 3) {
      const cur_x = floor_positions[i];
      const cur_y = floor_positions[i + 1];
      const cur_z = floor_positions[i + 2];

      const cur_vec = new THREE.Vector3(cur_x, cur_y, cur_z);
      let dist = (1.0 - cur_vec.length()) * 0.5;
      const noise_pos = cur_vec.clone();
      noise_pos.multiplyScalar(0.05);

      dist = dist > -30.0 ? 0 : dist;

      const n = i_noise.noise(noise_pos.x, noise_pos.y, noise_pos.z) * dist;

      floor_positions[i + 1] += n; // extrude en Y usando la distancia
    }

    floor_instance.geometry.attributes.position.needsUpdate = true;
    floor_instance.geometry.computeVertexNormals();
    floor_instance.castShadow = true;
    floor_instance.receiveShadow = true;
    this.scene.add(floor_instance);

    const perrito = new Perrito();
    this.perrito = perrito;

    const rounded_mask = new RoundedMask();

    const count = 2000;

    const positions = [];

    const sampler = new MeshSurfaceSampler(floor_instance);
    sampler.setWeightAttribute("weighted");
    sampler.build();

    for (var j = 0; j < count; j++) {
      let position = new THREE.Vector3(0, 0, 0);
      let normal = new THREE.Vector3(0, 1, 0);
      sampler.sample(position, normal);

      positions.push(position.x, position.y + randFloat(0.4, 1.0), position.z);
    }

    const char_count = 16;
    const char_size = 1.0 / char_count;

    const x_offset = mod(float(instanceIndex), char_count);
    const y_offset = round(
      float(instanceIndex.add(time.mul(2))).div(char_count)
    );

    const charX = uv().x.mul(char_size).add(x_offset.mul(char_size));
    const charY = uv().y.mul(char_size).add(y_offset.mul(char_size));

    const uv_ascii = vec2(charX, charY);

    this.experience.resources.items.ascii.wrapS = RepeatWrapping;
    this.experience.resources.items.ascii.wrapT = RepeatWrapping;

    const textura_ascii = texture(
      this.experience.resources.items.ascii,
      uv_ascii
    );
    const positionAttribute = new THREE.InstancedBufferAttribute(
      new Float32Array(positions),
      3
    );
    const material = new THREE.SpriteNodeMaterial({
      sizeAttenuation: true,
      alphaTest: 0.1,
    });

    material.positionNode = instancedBufferAttribute(positionAttribute);
    material.scaleNode = distance(material.positionNode, vec3(0.0))
      .mul(0.03)
      .mul(hash(instanceIndex).add(0.4).mul(2.0));
    material.colorNode = vec4(textura_ascii.x);
    material.rotationNode = mx_noise_vec3(material.positionNode, 1.0);

    // sprites

    const particles = new THREE.Sprite(material);
    particles.count = count;
    particles.frustumCulled = false;

    this.scene.add(particles);

    this.raycaster = this.experience.raycaster;
    this.raycaster.register(particles);

    this.raycaster.on("hit", () => {});



    this.update = () => {};
  }
}
