import {
  ViewerApp,
  AssetManagerPlugin,
  addBasePlugins,
  ScrollableCameraViewPlugin,
  VariationConfiguratorPlugin,
  FrameFadePlugin,
  LoadingScreenPlugin,
  PickingPlugin,
  TweakpaneUiPlugin,
  MaterialConfiguratorPlugin,

  // Import THREE.js internals
  Color,
	Texture,
  Vector3
} from 'webgi';

async function setupViewer() {
  // Initialize the viewer
  const viewer = new ViewerApp({
      canvas: document.getElementById('webgi-canvas'),
  })

  // use this to add all main ones at once
  await addBasePlugins(viewer) // Check the source: https://codepen.io/repalash/pen/JjLxGmy for the list of plugins added
  // const camViews = viewer.getPlugin(CameraViewPlugin)
  viewer.renderer.refreshPipeline()

  // Add a popup(in HTML) with download progress when any asset is downloading
  await viewer.addPlugin(AssetManagerBasicPopupPlugin)


  // Import and add a GLB file
  await viewer.load("./assets/Fender Stratocaster Guitar_PLAIN.glb")
  // await manager.addFromPath("./assets/carbon frame bike.glb")


  // Load an environment map if not set in the glb file
  // await viewer.setEnvironmentMap("./assets/studio_small_02_4k.exr");
  // await viewer.load("./assets/cube_diamond_sample.gltf")


  const obj = (await viewer.createObject3D()).modelObject;


  const plane = new Mesh(new PlaneGeometry(), viewer.createMaterial());
  plane.scale.set(1.6, 0.9, 1);
  plane.translateY(0.5);
  plane.translateZ(-1.5);
// Camera transform
  viewer.scene.activeCamera.position = new Vector3(1, 1, -3.5);
  viewer.scene.activeCamera.target = new Vector3(0, 0.5, 0);
   
  // Camera options
  const options = viewer.scene.activeCamera.getCameraOptions();
  options.fov = 25;
  viewer.scene.activeCamera.setCameraOptions(options);
 
  // Control options
  const controls = viewer.scene.activeCamera.controls;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 5;
  controls.enableDamping = true;
  controls.rotateSpeed = 2.0;
  controls.enableZoom = true;
  controls.enablePan = false;
  controls.minDistance = 1.5;
  controls.maxDistance = 10;
}

setupViewer();


window.onscroll = function() {
  if(document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      document.querySelector('.back-to-top').style.display = 'block';
  } else {
      document.querySelector('.back-to-top').style.display = 'none';
  }
};

let scrollSpeed = 1.0;

// Add an event listener for the 'wheel' event
document.addEventListener('wheel', function(event) {
  // Prevent default scrolling behavior
  event.preventDefault();

  // Calculate the new scroll position
  let delta = event.deltaY;
  let scrollPosition = window.scrollY + (delta * scrollSpeed);

  // Set the new scroll position
  window.scrollTo({
    top: scrollPosition,
    behavior: 'smooth'
  });
},
{ passive: false });


