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
    
    //video
    const video = await loadVideo("./videos/video1.mp4");
    const texture = new THREE.VideoTexture(video);

    const geometry = new THREE.PlaneGeometry(1, 1);
    // const material = createChromaMaterial(texture, 0x000000); //chroma
    
    // const geometry = new THREE.PlaneGeometry(2, 1080/(1920/2));
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
      // video.currentTime = 6;
    });

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(1, 2, 3);
    scene.add(dirLight);

    //model
    const gltf = await loadGLTF('./models/burger2/burger2.glb');
    gltf.scene.scale.set(1,1,1);
    gltf.scene.position.set(0, 0, 0);
    gltf.scene.rotation.set(45, 0, 0);


    // const gltf2 = await loadGLTF('./models/dance-1/scene.gltf');
    // gltf2.scene.scale.set(0.2, 0.2, 0.2);
    // gltf2.scene.position.set(0, -0.5, 0);
    // gltf2.scene.rotation.set(45, 0, 0);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(gltf.scene);
    // anchor.group.add(gltf2.scene);

    // --- for animation ---
    // const mixer = new THREE.AnimationMixer(gltf.scene);
    // const action = mixer.clipAction(gltf.animations[0]);
    // action.play();
  
    // const mixer2 = new THREE.AnimationMixer(gltf2.scene);
    // const action2 = mixer2.clipAction(gltf2.animations[0]);
    // action2.play();

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
    }
    anchor.onTargetLost = () => {
      audio.pause();
    }

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      // mixer.update(delta);
      renderer.render(scene, camera);
    });
  }
  start();
});
