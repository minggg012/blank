const { renderer, scene, camera } = base();
const { mesh, uniforms } = instance();

const sphere = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1, 2),
  new THREE.MeshStandardMaterial({
    flatShading: false,
    roughness: 0.1,
    metalness: 0.7
  }));


scene.add(sphere);

const light = new THREE.PointLight("#EFEFEF", 10, 20, Math.PI * 0.25, 1, 2);
scene.add(light);

let colors = [];
for (let i = 0; i < 4; i += 1) {
  colors.push(
    `#${new THREE.Color().setHSL(0.75 + i / 3 * 0.25, 0.6, 0.7).getHexString()}`);

}

document.querySelector(
  "a").
  style.background = `linear-gradient(to right, ${colors.join(", ")})`;

scene.add(mesh);

let progress = 0;

uot(p => {
  progress = p;
}, 3000, Infinity);

function render() {
  requestAnimationFrame(render);
  // controls.update();

  let p = uniforms.uProgress.value * 2 - 1;
  p = 1 - p * p;

  const newColor = new THREE.Color().setHSL(0.75 + p * 0.25, 0.7, 0.4);
  sphere.material.emissive = newColor;
  light.color = newColor;

  uniforms.uProgress.value = progress;
  renderer.render(scene, camera);
}

render();

// === INSTANCE ===

function instance() {
  const geometry = new THREE.OctahedronGeometry(1, 0);

  const material = new THREE.MeshStandardMaterial({
    color: "#EFEFEF",
    emissive: "#212121",
    flatShading: true,
    roughness: 0.1,
    metalness: 0.7
  });


  const castShadow = false;

  const S = 80;

  const positions = [];
  for (let x = -S; x < S; x += 1) {
    for (let z = -S; z < S; z += 1) {
      positions.push(x / (S / 20) + 1, z / (S / 20) + 1);
    }
  }

  const multiplier = positions.length / 2;

  const duration = 0.3;

  const attributes = [
    {
      name: "aPositionStart",
      data: i => [positions[i * 2], 20, positions[i * 2 + 1]],

      size: 3
    },

    {
      name: "aPositionEnd",
      data: i => [positions[i * 2], -20, positions[i * 2 + 1]],

      size: 3
    },

    {
      name: "aOffset",
      data: (i, total) => [
        Math.random() * (total * ((1 - duration) / (multiplier - 1)))],

      size: 1
    }];



  const uniforms = {
    uProgress: {
      value: 0
    },

    uPosition: {
      value: [0, 0, 0]
    }
  };



  const vertex = `
    attribute vec3 aPositionStart;
    attribute vec3 aPositionEnd;
    attribute float aOffset;
    
    uniform vec3 uPosition;
    uniform float uProgress;

    vec4 quatFromAxisAngle(vec3 axis, float angle) {
      float halfAngle = angle * 0.5;
      return vec4(axis.xyz * sin(halfAngle), cos(halfAngle));
    }

    vec3 rotateVector(vec4 q, vec3 v) {
      return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
    }

    float easeInOutSin(float t){
      return (1.0 + sin(${Math.PI} * t - ${Math.PI} / 2.0)) / 2.0;
    }

    void main(){
      float tProgress = easeInOutSin(min(1.0, max(0.0, (uProgress - aOffset)) / ${duration}));
      vec3 newPosition = mix(aPositionStart, aPositionEnd, tProgress);

      vec4 quatX = quatFromAxisAngle(vec3(1.0, 0.0, 0.0), ${Math.PI / 2});
      vec3 basePosition = rotateVector(quatX, position);
  
      float scale = tProgress * 2.0 - 1.0;
      scale = 1.0 - scale * scale;
      basePosition *= scale;
      basePosition *= min(1.0, max(0.0, -10.0 + distance(vec3(uPosition.x, uPosition.y, newPosition.z), newPosition)));
      gl_Position = newPosition + basePosition;
    }
  `;

  const instance = new THREE.Phenomenon({
    geometry,
    multiplier,
    material,
    castShadow,
    attributes,
    uniforms,
    vertex
  });


  return instance;
}

// === STRUCTURE ===

function base() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });


  renderer.setClearColor(0x212121, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(1);

  document.querySelector("body").appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    10000);

  camera.position.set(0, 0, 80);
  camera.lookAt(scene.position);
  scene.add(camera);

  const ambientLight = new THREE.AmbientLight("#ffffff", 0.1);
  scene.add(ambientLight);

  const emissive = `#${new THREE.Color().setHSL(0.5, 0.7, 0.4).getHexString()}`;

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(440, 440, 440),
    new THREE.MeshPhongMaterial({ emissive: "#212121", side: THREE.BackSide }));

  scene.add(box);

  const light = new THREE.SpotLight(0xffffff, 1, 80, Math.PI * 0.25, 1, 2);
  light.position.set(0, 30, 5);

  scene.add(light);

  window.addEventListener(
    "resize",
    () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    false);


  // const controls = new THREE.OrbitControls(camera, renderer.domElement);

  return { renderer, scene, camera };
}

function getArrayWithNoise(array, noise) {
  return array.map(item => item + getRandomBetween(noise));
}

function getRandomBetween(value) {
  const floor = -value;
  return floor + Math.random() * value * 2;
}

if (
  navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
  navigator.userAgent.match(/AppleWebKit/)) {
  document.body.insertAdjacentHTML("beforeend", `<span>Tap for 60FPS</span>`);
  const span = document.querySelector("span");
  window.addEventListener("touchstart", () => {
    span.outerHTML = "";
  });
}