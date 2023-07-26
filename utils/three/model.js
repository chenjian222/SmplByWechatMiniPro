const appData = getApp().globalData;
import { registerFBXLoader } from './FBXLoader_new.js'

var fbxModelLoadPig = (canvas, animationUrl, THREE, startTime) => {  
    appData.innerWidth = wx.getSystemInfoSync().windowWidth;
    appData.innerHeight = wx.getSystemInfoSync().windowHeight; 
  if(! /.fbx/i.test(animationUrl)){
      return ;
  }
  let play_type = 1 ;
  registerFBXLoader(THREE);
  let container, stats, controls;
  let camera, scene, renderer, light;
  let frame = 0;
  let clock = new THREE.Clock();
  let mixers = [];
  var model;
  var actions,activeAction;
  init();

  function init() {    
    var width = appData.innerWidth
    var height = appData.innerHeight
    var s = 200
    var k = width / height
    scene = new THREE.Scene(); 
    camera = new THREE.OrthographicCamera(-s * k,
      s * k,
      s,
      -s,
      -2000,
      2000);
    camera.position.set(0, 100, -100);
    camera.lookAt(scene.position);

   

    light = new THREE.PointLight(0xffffff, 0.5);
    light.position.set(200, 200, -200);
    scene.add(light);
    light = new THREE.PointLight(0xffffff, 0.5);
    light.position.set(-200, 200, -200);
    scene.add(light);
    light = new THREE.PointLight(0xffffff);
    light.position.set(200, -200, -200)
    scene.add(light)
      
    let onError = function( xhr ) {
        console.log( xhr );
    };            
    var loader = new THREE.FBXLoader();//'/static/Celebration/model/RenminUniversity_animation.fbx'
    loader.load(animationUrl, function (fbx) {//animationConfigInfo.animationModelUrl：fbx模型的文件名
        model = fbx;
        scene.add(model);    
        console.log(model)          
        fbx.mixer = new THREE.AnimationMixer(fbx);
        mixers.push(fbx.mixer);
       
        console.log("动画加载用了" + (Date.now()-startTime)/1000 + "秒"); 
      }, undefined, onError);

      renderer = new THREE.WebGLRenderer({ antialias: true,alpha:true });
      renderer.setPixelRatio(wx.getSystemInfoSync().pixelRatio);
      renderer.setSize(appData.innerWidth, appData.innerWidth);
      renderer.gammaOutput = true;
      renderer.gammaFactor = 2.2;     
      
     
      
      animate();
  }

  function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
  }


  //three.js播放动画
  function animate() {      
      canvas.requestAnimationFrame( animate );
      if ( mixers.length > 0 ) {
          for ( let i = 0; i < mixers.length; i ++ ) {
              let delta = clock.getDelta();
              mixers[ i ].update( delta );
              frame = frame+delta;
              if(play_type == 0){
                  if(frame>0.01){
                      let estop = new Event("estop");
                      document.dispatchEvent(estop);
                      play_type = -1;
                  }
              }
          }
      }      
      render();  
  }

  //three.js动画渲染
  function render() {    
      renderer.render( scene, camera );
  }  
}
module.exports = {
  fbxModelLoadPig: fbxModelLoadPig
}