  var scene, renderer;  // all threejs programs need these
	var camera, avatarCam, edgeCam, juliaCam;  // we have two cameras in the main scene
	var avatar, suzanne, chair, chair1, table, finn;
	// here are some mesh objects ...

	var startScene, endScene, endCamera, endText, startText, startCamera, loseScene, loseCamera, loseText;

	var controls =
	     {fwd:false, bwd:false, left:false, right:false,
				speed:10, fly:false, reset:false,
		    camera:camera}

	var gameState =
	     {score:0, health:10, scene:'startgame', camera:'none'}


	// Here is the main game control
  init();
	initControls();
	animate();


	function createLoseScene() {
		loseScene = initScene();
		loseText = createSkyBox('youlose.png', 10);
		loseScene.add(loseText);
		var light3 = createPointLight();
		light3.position.set(0,200,20);
		loseScene.add(light3);
		loseCamera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
		loseCamera.position.set(0,50,1);
		loseCamera.lookAt(0,0,0);
	}


	function createEndScene(){
		endScene = initScene();
		endText = createSkyBox('youwon.png',10);
		//endText.rotateX(Math.PI);
		endScene.add(endText);
		var light1 = createPointLight();
		light1.position.set(0,200,20);
		endScene.add(light1);
		endCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		endCamera.position.set(0,50,1);
		endCamera.lookAt(0,0,0);

	}

	function createStartScene(){
		startScene = initScene();
		startText = createSkyBox('startgame.png', 10);
		startScene.add(startText);
		var light2 = createPointLight();
		light2.position.set(0,200,20);
		startScene.add(light2);
		startCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		startCamera.position.set(0,50,1);
		startCamera.lookAt(0,0,0);
		gameState.scene='startgame';
	}

	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
      initPhysijs();
			scene = initScene();
			createStartScene();
			createEndScene();
			createLoseScene();
			initRenderer();
			createMainScene();
	}



	function createMainScene(){
      // setup lighting
			var light1 = createPointLight();
			light1.position.set(0,200,20);
			scene.add(light1);
			var light0 = new THREE.AmbientLight( 0xffffff,0.25);
			scene.add(light0);

			// create main camera
			camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
			camera.position.set(0,40,0);
			camera.lookAt(0,0,0);

			// create the ground and the skybox
			var ground = createGround('wood.jpg');
			scene.add(ground);
			var skybox = createSkyBox('crate.gif',1);
			scene.add(skybox);

			// create the avatar
			avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
			avatarCam.translateY(-4);
			avatarCam.translateZ(3);
			gameState.camera = avatarCam;

      edgeCam = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 0.1, 1000 );
      edgeCam.position.set(20,20,10);

      juliaCam = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );
      juliaCam.position.set(15,15,10);

			initSuzanne();
      initChairOBJ();
      initChair1OBJ();
      initTableOBJ();
      initFinnOBJ();
	}

	function initSuzanne(){
		var loader = new THREE.JSONLoader();
		loader.load("../models/suzanne.json",
					function ( geometry, materials ) {
						console.log("loading suzanne");
						var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
						suzanne = new Physijs.BoxMesh(geometry, material );
						suzanne.setDamping(0.1,0.1);
						suzanne.castShadow = true;

						avatarCam.position.set(0,4,0);
						avatarCam.lookAt(0,4,10);
						suzanne.add(avatarCam);

						var s = 0.5;
						suzanne.scale.y=s;
						suzanne.scale.x=s;
						suzanne.scale.z=s;
						suzanne.position.z = -5;
						suzanne.position.y = 3;
						suzanne.position.x = -5;
						suzanne.castShadow = true;
						scene.add(suzanne);
					},
					function(xhr){
						console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},
					function(err){console.log("error in loading: "+err);}
				)

	}

  function initFinnOBJ(){
    var loader = new THREE.OBJLoader();
    loader.load("../models/finn.obj",
      function (finn) {
        console.log("loading finn file");
        finn.castShadow = true;
        finn.scale.x=2;
        finn.scale.y=2;
        finn.scale.z=2;
        finn.position.y = 0;
        finn.position.z = 0;
        finn.castShadow = true;
        scene.add(finn);

      },
      function(xhr){
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},

        function(err){
          console.log("error in loading: "+err);}
        )
  }

  function initChairOBJ(){
    var loader = new THREE.OBJLoader();
    loader.load("../models/chair.obj",
      function (chair) {
        console.log("loading obj file");
        chair.castShadow = true;
        chair.scale.x=2;
        chair.scale.y=2;
        chair.scale.z=2;
        chair.position.y = 0;
        chair.position.z = 0;
        chair.castShadow = true;
        scene.add(chair);

      },
      function(xhr){
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},

        function(err){
          console.log("error in loading: "+err);}
        )
 }

 function initChair1OBJ(){
   var loader = new THREE.OBJLoader();
   loader.load("../models/chair1.obj",
     function (chair1) {
       console.log("loading chair1 file");
       chair1.castShadow = true;
       chair1.scale.x=1;
       chair1.scale.y=1;
       chair1.scale.z=1;
       chair1.position.y = 3;
       chair1.position.z = 5;
       chair1.castShadow = true;
       scene.add(chair1);

     },
     function(xhr){
       console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},

       function(err){
         console.log("error in loading: "+err);}
       )
}

function initTableOBJ(){
  var loader = new THREE.OBJLoader();
  loader.load("../models/table.obj",
    function (table) {
      console.log("loading table file");
      table.scale.x=0.01;
      table.scale.y=0.01;
      table.scale.z=0.01;
      table.position.y = 0.01;
      table.position.z = -5;
      table.castShadow = true;
      scene.add(table);

    },
    function(xhr){
      console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},

      function(err){
        console.log("error in loading: "+err);}
      )
}

	function randN(n){
		return Math.random()*n;
	}


	function playGameMusic(){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '/sounds/loop.mp3', function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( true );
			sound.setVolume( 0.05 );
			sound.play();
		});
	}

	function soundEffect(file){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '/sounds/'+file, function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( false );
			sound.setVolume( 0.5 );
			sound.play();
		});
	}

	/* We don't do much here, but we could do more!
	*/
	function initScene(){
		//scene = new THREE.Scene();
    var scene = new Physijs.Scene();
		return scene;
	}

  function initPhysijs(){
    Physijs.scripts.worker = '/js/physijs_worker.js';
    Physijs.scripts.ammo = '/js/ammo.js';
  }

	function initRenderer(){
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight-50 );
		document.body.appendChild( renderer.domElement );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	}


	function createPointLight(){
		var light;
		light = new THREE.PointLight( 0xffffff);
		light.castShadow = true;
		//Set up shadow properties for the light
		light.shadow.mapSize.width = 2048;  // default
		light.shadow.mapSize.height = 2048; // default
		light.shadow.camera.near = 0.5;       // default
		light.shadow.camera.far = 500      // default
		return light;
	}


	function createBoxMesh(color){
		var geometry = new THREE.BoxGeometry( 1, 1, 1);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
    //mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

	function createBoxMesh2(color,w,h,d){
		var geometry = new THREE.BoxGeometry( w, h, d);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
		//mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}


	function createGround(image){
		// creating a textured plane which receives shadows
		var geometry = new THREE.PlaneGeometry( 180, 180, 128 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 15, 15 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );

		mesh.receiveShadow = true;

		mesh.rotateX(Math.PI/2);
		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical
	}


	function createSkyBox(image,k){
		// creating a textured plane which receives shadows
		var geometry = new THREE.BoxGeometry( 80, 80, 80 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( k, k );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var mesh = new THREE.Mesh( geometry, material, 0 );
		mesh.receiveShadow = false;
		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical

	}


	function initControls(){
			clock = new THREE.Clock();
			clock.start();

			window.addEventListener( 'keydown', keydown);
			window.addEventListener( 'keyup',   keyup );
  }

	function keydown(event){
		console.log("Keydown: '"+event.key+"'");
		//console.dir(event);
		// first we handle the "play again" key in the "youwon" scene

		if (gameState.scene == 'startgame' && event.key == 'p'){
			gameState.scene = 'main';
			addBalls();
			return;
		}

		if (gameState.scene == 'youwon' && event.key=='r') {
			gameState.scene = 'main';
			gameState.score = 0;
			addBalls();
			return;
		}

		if (gameState.scene == 'youlose' && event.key=='r'){
			gameState.scene = 'main';
			gameState.score = 0;
			return;
		}

		// this is the regular scene
		switch (event.key){
			// change the way the avatar is moving
			case "w": controls.fwd = true;  break;
			case "s": controls.bwd = true; break;
			case "a": controls.left = true; break;
			case "d": controls.right = true; break;
			case "r": controls.up = true; break;
			case "f": controls.down = true; break;
			case "m": controls.speed = 30; break;
      case " ": controls.fly = true;
          console.log("space!!");
          break;
      case "h": controls.reset = true; break;

			// switch cameras
			case "1": gameState.camera = camera; break;
			case "2": gameState.camera = avatarCam; break;
      case "3": gameState.camera = edgeCam; break;
      case "4": gameState.camera = juliaCam; break;

			// move the camera around, relative to the avatar
			case "ArrowLeft": avatarCam.translateY(1);break;
			case "ArrowRight": avatarCam.translateY(-1);break;
			case "ArrowUp": avatarCam.translateZ(-1);break;
			case "ArrowDown": avatarCam.translateZ(1);break;
			case "q": avatarCam.translateX(-1);break;
			case "e": avatarCam.translateX(1);break;

			case "p": gameState.scene == 'main';
			//stands for upright. This is for resetting the position of suzanne so she is upright
			//when she falls over and faces some weird position
			case "u": suzanne.rotation.set(0,0,0); suzanne.__dirtyRotation=true;
				console.dir(suzanne.rotation); break;

		}

	}

	function keyup(event){
		switch (event.key){
			case "w": controls.fwd   = false;  break;
			case "s": controls.bwd   = false; break;
			case "a": controls.left  = false; break;
			case "d": controls.right = false; break;
			case "r": controls.up    = false; break;
			case "f": controls.down  = false; break;
			case "m": controls.speed = 10; break;
      case " ": controls.fly = false; break;
      case "h": controls.reset = false; break;
		}
	}


  function updateAvatar(){

		"change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"

		var forward = suzanne.getWorldDirection();

		if (controls.fwd){
			suzanne.setLinearVelocity(forward.multiplyScalar(controls.speed));
		} else if (controls.bwd){
			suzanne.setLinearVelocity(forward.multiplyScalar(-controls.speed));
		} else {
			var velocity = suzanne.getLinearVelocity();
			velocity.x=velocity.z=0;
			suzanne.setLinearVelocity(velocity); //stop the xz motion
		}

    if (controls.fly){
      suzanne.setLinearVelocity(new THREE.Vector3(0,controls.speed,0));
    }

		if (controls.left){
			suzanne.setAngularVelocity(new THREE.Vector3(0,controls.speed*0.1,0));
		} else if (controls.right){
			suzanne.setAngularVelocity(new THREE.Vector3(0,-controls.speed*0.1,0));
		}

    if (controls.reset){
      suzanne.__dirtyPosition = true;
      suzanne.position.set(10,10,10);
    }
	}

	function animate() {
		requestAnimationFrame( animate );
		switch(gameState.scene) {
			case "startgame":
				startText.rotateY(0.005);
				renderer.render(startScene,startCamera);
				break;

			case "youwon":
				endText.rotateY(0.005);
				renderer.render( endScene, endCamera );
				break;

			case "youlose":
				loseText.rotateY(0.005);
				renderer.render(loseScene, loseCamera);
        gameState.health = 10;
				break;

			case "main":
				updateAvatar();
        edgeCam.lookAt(suzanne.position);
        juliaCam.lookAt(suzanne.position);
	    	scene.simulate();
				if (gameState.camera!= 'none'){
					renderer.render( scene, gameState.camera );
				}
				break;

			default:
			 console.log("don't know the scene "+gameState.scene);

		}

	  var info = document.getElementById("info");
		info.innerHTML='<div style="font-size:24pt">Score: '
		+ gameState.score
		+ " Health = " + gameState.health
		+ '</div>';

	}
