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
    
    // video
    const video = await loadVideo("./videos/video1.mp4");
    const texture = new THREE.VideoTexture(video);

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({map: texture});
    const plane = new THREE.Mesh(geometry, material);

    const anchorVid = mindarThree.addAnchor(0);
    anchorVid.group.add(plane);

    anchorVid.onTargetFound = () => {
      video.loop = true;
      video.play();
    }
    anchorVid.onTargetLost = () => {
      video.pause();
    }
    video.addEventListener( 'play', (loop) => {
    });

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(1, 2, 3);
    scene.add(dirLight);

    //model
    const gltf = await loadGLTF('./models/NYburger.glb');
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    gltf.scene.position.set(0, 0.2, 0);
    gltf.scene.rotation.set(90, 90, 0);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(gltf.scene);
    anchor.group.matrixAutoUpdate = false;
  
    const clock = new THREE.Clock();
// Placed
    let placed = false;
    anchor.onTargetFound = () => {
    if (!placed) {
    placed = true;

    const worldPosition = new THREE.Vector3();
    anchor.group.getWorldPosition(worldPosition);

    scene.add(gltf.scene);
    gltf.scene.position.copy(worldPosition);
  }
};
// placed



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
    }
    anchor.onTargetLost = () => {
      audio.pause();
    }



    await mindarThree.start();
    renderer.setAnimationLoop(() => {
    const delta = clock.getDelta();
    anchor.group.updateMatrixWorld(true);
    renderer.render(scene, camera);
});
  }
  start();
});
