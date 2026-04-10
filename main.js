import {loadAudio, loadGLTF, loadVideo} from "./libs/loader.js";
import{createChromaMaterial} from "./libs/chroma-video.js"
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: './hiro.mind',
      uiScanning: "no",
      uiLoading: "no",
    });
    const {renderer, scene, camera} = mindarThree;
    
// Image
    const textureLoader = new THREE.TextureLoader();
    const textureImage = textureLoader.load('./elevenburgers-background.png'); 
    const geometry = new THREE.PlaneGeometry(2 , 1);
    const material = new THREE.MeshBasicMaterial({
    map: textureImage,
    transparent: true // optional if image has alpha
});

    const plane = new THREE.Mesh(geometry, material);
    const anchorVid = mindarThree.addAnchor(0);
    anchorVid.group.add(plane);

// video
    // const video = await loadVideo("./videos/video1.mp4");
    // const texture = new THREE.VideoTexture(video);

    // const geometry = new THREE.PlaneGeometry(1, 1);
    // const material = new THREE.MeshBasicMaterial({map: texture});
    // const plane = new THREE.Mesh(geometry, material);

    // const anchorVid = mindarThree.addAnchor(0);
    // anchorVid.group.add(plane);

    // anchorVid.onTargetFound = () => {
    //   video.loop = true;
    //   video.play();
    // }
    // anchorVid.onTargetLost = () => {
    //   video.pause();
    // }
    // video.addEventListener( 'play', (loop) => {
    // });

  

// Light
    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(1, 2, 3);
    scene.add(dirLight);

//model
    const gltf = await loadGLTF('./models/NYburger.glb');
    gltf.scene.scale.set(0.2, 0.2, 0.2);
    gltf.scene.position.set(0.4,-1, 0.2);
    gltf.scene.rotation.set(Math.PI/2, 0, 0);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(gltf.scene);
    anchor.group.matrixAutoUpdate = false;
  
    const clock = new THREE.Clock();

//audio
    const audioClip = await loadAudio("./Excuses - AP Dhillon Gurinder Gill (DJJOhAL.Com).mp3");
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const audio = new THREE.PositionalAudio(listener);
    anchor.group.add(audio);

    audio.setBuffer(audioClip);
    audio.setRefDistance(1000);
    audio.setLoop(true);

    anchor.onTargetFound = () => {
    audio.play();
    isAnimating = true;

    }
    anchor.onTargetLost = () => {
      audio.pause();
    }

// Animation
  let isAnimating = false;
  let targetY = 0.1;   // final height
  let speed = 0.01;

    let rotate = true; //rotate


// render
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
    const delta = clock.getDelta();
    anchor.group.updateMatrixWorld(true);
    
    if (isAnimating) {
      // rise
      gltf.scene.position.y += (targetY - gltf.scene.position.y) * 0.1;

      // rotate
      gltf.scene.rotation.y += 0.03;

      // scale up
      gltf.scene.scale.lerp(new THREE.Vector3(0.5,0.5,0.5), 0.1);

      if (Math.abs(targetY - gltf.scene.position.y) < 0.001) {
        isAnimating = false;
  }
}
    if (rotate) {
    gltf.scene.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
});
  }
  start();
});
