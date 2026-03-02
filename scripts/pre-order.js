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

  VariationConfiguratorPlugin,
  LoadingScreenPlugin,
  MaterialConfiguratorPlugin,


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

  const viewer2 = new ViewerApp({
      canvas: document.getElementById('web-canvas'),
  })

  // use this to add all main ones at once
  await addBasePlugins(viewer) // Check the source: https://codepen.io/repalash/pen/JjLxGmy for the list of plugins added
  await addBasePlugins(viewer2)
  // const camViews = viewer.getPlugin(CameraViewPlugin)
  viewer.renderer.refreshPipeline()
  viewer2.renderer.refreshPipeline()


  const manager = await viewer.addPlugin(AssetManagerPlugin);
  const manager2 = await viewer2.addPlugin(AssetManagerPlugin);



  // Import and add a GLB file
  await viewer.load("./assets/Fender Stratocaster Guitar_PLAIN.glb")
  await viewer2.load("./assets/Fender Stratocaster Guitar_PLAIN.glb")

  // await manager.addFromPath("./assets/carbon frame bike.glb")


  // Load an environment map if not set in the glb file
  // await viewer.setEnvironmentMap("./assets/white_home_studio_4k.exr");
  // await viewer.load("./assets/cube_diamond_sample.gltf")

  // Camera transform
	viewer.scene.activeCamera.position = new Vector3(0, 1, 0);
	viewer.scene.activeCamera.target = new Vector3(0, 1, 0);

  viewer2.scene.activeCamera.position = new Vector3(0, 1, 1);
	viewer2.scene.activeCamera.target = new Vector3(0, 1, 0);
		
	// Camera options
	const options = viewer.scene.activeCamera.getCameraOptions();
	options.fov = 20;
	viewer.scene.activeCamera.setCameraOptions(options);

  const options2 = viewer2.scene.activeCamera.getCameraOptions();
	options2.fov = 20;
	viewer2.scene.activeCamera.setCameraOptions(options2);
	
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

  const controls2 = viewer2.scene.activeCamera.controls;
	controls2.autoRotate = false;
	controls2.autoRotateSpeed = 5;
	controls2.enableDamping = true;
	controls2.rotateSpeed = 2.0;
	controls2.enableZoom = true;
	controls2.enablePan = true;
	controls2.minDistance = 3;
	controls2.maxDistance = 12;

  // Picking options
  const picking = viewer.addPluginSync(PickingPlugin);
  picking.hoverEnabled = false;
  picking.enableWidget = false;
  console.log(picking.getSelectedObject);
  // const ui = viewer.addPluginSync(new TweakpaneUiPlugin(true));
  // ui.setupPluginUi(PickingPlugin);
  let selectedBody = false;
  let selectedPickguard = false;
  let selectedNeck = false;

  picking.addEventListener('hitObject', (e) => {
    // console.log('Hit object', e, e.intersects.selectedObject);
    // Set to null to prevent selection
    // console.log(e.intersects.selectedObject.name);

    selectedBody = false;
    selectedPickguard = false;
    selectedNeck = false;
    if (e.intersects && e.intersects.selectedObject) {
      const objectName = e.intersects.selectedObject.name;
      console.log(objectName);

      if(objectName === 'Object_3') { 
        selectedBody = true;
      }

      if(objectName === 'Object_31') { 
        selectedPickguard = true;
      }

      if(objectName === 'Object_32') { 
        selectedNeck = true;
      }
      
      else {
      console.warn('No selected object found.');
      }
    }
  });

  picking.addEventListener('selectedObjectChanged', (e) => {
      //console.log('Selected Object Changed', e);
  });

  picking.addEventListener('hoverObjectChanged', (e) => {
      //console.log('Hover object changed', e);
  });

  // const drawer = manager.materials.findMaterialsByName('draw')[0]
	// console.log(drawer);

  // Colors

  //____________________________________________________________________________________________________BODY BUTTON COLOUR CHANGER________________________________________________
  document.querySelector('.button-colors.redbodymat')?.addEventListener('click', () => {
    changeColor(new Color(0xff0000))
  })

  document.querySelector('.button-colors.greenbodymat')?.addEventListener('click', () => {
    changeColor(new Color(0x48c048))
  })

  document.querySelector('.button-colors.lightBluebodymat')?.addEventListener('click', () => {
    changeColor(new Color(0x62faff))
  })

    document.querySelector('.button-colors.darkBluebodymat')?.addEventListener('click', () => {
    changeColor(new Color(0x0a2dba))
  })

  document.querySelector('.button-colors.purplebodymat')?.addEventListener('click', () => {
    changeColor(new Color(0xb84eff))
  })

  document.querySelector('.button-colors.blackbodymat')?.addEventListener('click', () => {
    changeColor(new Color(0x323232))
  })

  document.querySelector('.button-colors.whitebodymat')?.addEventListener('click', () => {
    changeColor(new Color(0xfffef7))
  })

  //____________________________________________________________________________________________________PICKGUARD COLOUR CHANGER___________________________________________________
  document.querySelector('.button-colors.redpickmat')?.addEventListener('click', () => {
    changePickguardColor(new Color(0xff0000))
  })

  document.querySelector('.button-colors.greenpickmat')?.addEventListener('click', () => {
    changePickguardColor(new Color(0x48c048))
  })

  document.querySelector('.button-colors.lightBluepickmat')?.addEventListener('click', () => {
    changePickguardColor(new Color(0x62faff))
  })

    document.querySelector('.button-colors.darkBluepickmat')?.addEventListener('click', () => {
    changePickguardColor(new Color(0x0a2dba))
  })

  document.querySelector('.button-colors.purplepickmat')?.addEventListener('click', () => {
    changePickguardColor(new Color(0xb84eff))
  })

  document.querySelector('.button-colors.blackpickmat')?.addEventListener('click', () => {
    changePickguardColor(new Color(0x323232))
  })

  document.querySelector('.button-colors.whitepickmat')?.addEventListener('click', () => {
    changePickguardColor(new Color(0xfffef7))
  })
  //____________________________________________________________________________________________________NECK BUTTON COLOUR CHANGER________________________________________________
  document.querySelector('.button-colors.light')?.addEventListener('click', () => {
    changeNeckColor(new Color(0xefce8b))
  })

  document.querySelector('.button-colors.dark')?.addEventListener('click', () => {
    changeNeckColor(new Color(0x7c4e19))
  })
  
  const body = manager.materials.findMaterialsByName('BodyMaterial')[0];
  const pickguard = manager.materials.findMaterialsByName('PickguardMaterial')[0];
  const neck = manager.materials.findMaterialsByName('NeckMaterial')[0];

  const body2 = manager2.materials.findMaterialsByName('BodyMaterial')[0];
  const pickguard2 = manager2.materials.findMaterialsByName('PickguardMaterial')[0];
  const neck2 = manager2.materials.findMaterialsByName('NeckMaterial')[0];

  function changeColor(colorToBeChanged) {
    if(selectedBody == true)
    body.color = colorToBeChanged;
    body2.color = colorToBeChanged;
    viewer.scene.setDirty();
    viewer2.scene.setDirty();
  }

  function changePickguardColor(colorToBeChanged) {
    if(selectedPickguard == true)
      pickguard.color = colorToBeChanged;
      pickguard2.color = colorToBeChanged;
      viewer.scene.setDirty();
      viewer2.scene.setDirty();
  }

  function changeNeckColor(colorToBeChanged) {
    if(selectedNeck == true)
      neck.color = colorToBeChanged;
      neck2.color = colorToBeChanged;
      viewer.scene.setDirty();
      viewer2.scene.setDirty();
  }

  let delvInput = document.getElementById("deliveryInput");
  let fnameInput = document.getElementById("fname");
  let lnameInput = document.getElementById("lname");
  let extNumInput = document.getElementById("phoneExt");
  let phoneNumInput = document.getElementById("phoneNumberInput");

  let submitBtn = document.getElementById("submitBtn");
  document.querySelector('.button-submit')?.addEventListener('click', () => {
    delvInput.value = "Street name Building No. Unit Number, Postal code etc.";
    fnameInput.value = "John"
    lnameInput.value = "Doe"
    extNumInput.value = "+65"
    phoneNumInput.value = "#### ####"
  })

}

setupViewer();


window.onscroll = function() {
  if(document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      document.querySelector('.back-to-top').style.display = 'block';
  } else {
      document.querySelector('.back-to-top').style.display = 'none';
  }
};

let scrollSpeed = 100.0;

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


