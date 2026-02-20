import {
  ViewerApp,
  AssetManagerPlugin,
  CameraViewPlugin,
  CameraView,
  GBufferPlugin,
  timeout,
  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  DiamondPlugin,
  FrameFadePlugin,
  GLTFAnimationPlugin,
  GroundPlugin,
  BloomPlugin,
  TemporalAAPlugin,
  AnisotropyPlugin,
  GammaCorrectionPlugin,
  ScrollableCameraViewPlugin,


  addBasePlugins,
  Vector3,
  Mesh,
  PlaneGeometry,
  VideoTexture,
  // ITexture,
  TweakpaneUiPlugin,
  // TweakpaneUiPlugin,
  AssetManagerBasicPopupPlugin,
  CanvasSnipperPlugin,
  PickingPlugin,

  // Import THREE.js internals
  Color,
	Texture,
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

  // Import and add a GLB file
  await viewer.load("./assets/Fender Stratocaster Guitar_PLAIN.glb")
  // await manager.addFromPath("./assets/carbon frame bike.glb")


  // Load an environment map if not set in the glb file
  // await viewer.setEnvironmentMap("./assets/studio_small_02_4k.exr");
  // await viewer.load("./assets/cube_diamond_sample.gltf")


  const obj = (await viewer.createObject3D()).modelObject;

// Camera transform
	viewer.scene.activeCamera.position = new Vector3(0, 0, 0);
	viewer.scene.activeCamera.target = new Vector3(0, 0, 0);
		
	// Camera options
	const options = viewer.scene.activeCamera.getCameraOptions();
	options.fov = 25;
	viewer.scene.activeCamera.setCameraOptions(options);
	
	// Control options
	const controls = viewer.scene.activeCamera.controls;
	controls.autoRotate = false;
	controls.autoRotateSpeed = 5;
	controls.enableDamping = true;
	controls.rotateSpeed = 2.0;
	controls.enableZoom = true;
	controls.enablePan = true;
	controls.minDistance = 3;
	controls.maxDistance = 12;

  const picking = viewer.addPluginSync(PickingPlugin);
  picking.hoverEnabled = true;
  picking.enableWidget = false;
  console.log(picking.getSelectedObject);
  // const ui = viewer.addPluginSync(new TweakpaneUiPlugin(true));
  // ui.setupPluginUi(PickingPlugin);
  picking.addEventListener('hitObject', (e) => {
      console.log('Hit object', e, e.intersects.selectedObject);
      // set to null to prevent selection
      // e.intersects.selectedObject = null
  });

  picking.addEventListener('selectedObjectChanged', (e) => {
      console.log('Selected Object Changed', e);
  });

  picking.addEventListener('hoverObjectChanged', (e) => {
      console.log('Hover object changed', e);
  });

  // ui.setupPluginUi(MaterialConfiguratorPlugin);
  const drawer = AssetManagerPlugin.materials.findMaterialsByName('draw')[0]
	console.log(drawer);

  // Materials
   document.querySelectorAll(".material").forEach((el) => {
     el.addEventListener("click", () => {
       const category = config.variations.materials.find((cat) => cat.name === el.getAttribute("data-category"));
       console.log(category);
       const index = parseInt(el.getAttribute("data-index"));
       console.log(index);
       const type = "materials";
      
       config.applyVariation(category, index, type);
     });
   });

  // Colors
  document.querySelector('.button-colors.red')?.addEventListener('click', () => {
    changeColor(new Color(0xff0000))
  })

  document.querySelector('.button-colors.green')?.addEventListener('click', () => {
    changeColor(new Color(0x14ff00))
  })

  document.querySelector('.button-colors.blue')?.addEventListener('click', () => {
    changeColor(new Color(0x007eff))
  })

  function changeColor(colorToBeChanged) {
    drawer.color = colorToBeChanged;
    viewer.scene.setDirty();
  }
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


