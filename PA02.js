  var scene, renderer;  // all threejs programs need these
	var camera, avatarCam, edgeCam, juliaCam;  // we have two cameras in the main scene
	var avatar, suzanne , gudetama, creeper,zantan;
	// here are some mesh objects ...

	var cone;

	var startScene, endScene, endCamera, endText, startText, startCamera, loseScene, loseCamera, loseText;

	var controls =
	     {fwd:false, bwd:false, left:false, right:false,
				speed:10, fly:false, reset:false,
		    camera:camera}

	var gameState =
	     {score:0, health:10, scene:'startgame', camera:'none'}


	// Here is the main game control
  init(); //
	initControls();
	animate();  // start the animation loop!


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
			camera.position.set(0,50,0);
			camera.lookAt(0,0,0);

			// create the ground and the skybox
			var ground = createGround('grass.png');
			scene.add(ground);
			var skybox = createSkyBox('sky.jpg',1);
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

			addBalls();

			cone = createConeMesh(4,6);
			cone.position.set(10,3,7);
			scene.add(cone);

      npc3 = createConeMesh(2,3);
      			npc3.position.set(20,0,20);
      			scene.add(npc3);
      			npc3.addEventListener('collision',function (other_object, relative_velocity, relative_rotation, contact_normal){
      				if (other_object == suzanne){
      					npc3.position.y+=10;
      					npc3.__dirtyPosition = true;
      				}
      			}
      		)

			addGudetama();
      addCreeper();
      addZantan();

			initSuzanne();
			initSuzanneOBJ();

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


	function initSuzanneOBJ(){
		var loader = new THREE.OBJLoader();
		loader.load("../models/millenium-falcon.obj",
					function ( obj) {
						console.log("loading obj file");
						obj.scale.x=1;
						obj.scale.y=1;
						obj.scale.z=1;
						obj.position.y = 2;
						obj.position.z = 0;

						scene.add(obj);
						obj.castShadow = true;
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


	function addGudetama(){
		gudetama = createGudetama();
		gudetama.scale.set(0.4,0.4,0.4);


		//gudetama.position.set(randN(20)+15,30,randN(20)+15);
		gudetama.position.set(-40,40,-40);

		scene.add(gudetama);

		gudetama.addEventListener('collision',
			function (other_object, relative_velocity, relative_rotation, contact_normal){
				if (other_object == suzanne){
						gameState.health -= 1;
						gudetama.position.set(randN(20)+15,30,randN(20)+15);
						if (gameState.health == 0){
							gameState.scene = 'youlose';
              gameState.health=10;
						}

						//this.position.y = this.position.y - 100;
						this.__dirtyPosition = true;
				}
			}
		)
	}

  function addCreeper(){
    creeper = createCreeper();
    creeper.scale.set(0.4,0.4,0.4);


    //creeper.position.set(randN(20)+15,30,randN(20)+15);
    creeper.position.set(10,40,-5);

    scene.add(creeper);

    creeper.addEventListener('collision',
      function (other_object, relative_velocity, relative_rotation, contact_normal){
        if (other_object == suzanne){
            gameState.health -= 1;
            creeper.position.set(randN(20)+15,30,randN(20)+15);
            if (gameState.health == 0){
              gameState.scene = 'youlose';
            }

            this.position.y = this.position.y - 100;
            this.__dirtyPosition = true;
        }
      }
    )
  }
  function addZantan(){
    zantan = createZantan();
    zantan.scale.set(0.4,0.4,0.4);


    //creeper.position.set(randN(20)+15,30,randN(20)+15);
    zantan.position.set(30,40,5);

    scene.add(zantan);

    zantan.addEventListener('collision',
      function (other_object, relative_velocity, relative_rotation, contact_normal){
        if (other_object == suzanne){
            gameState.health += 1;
            zantan.position.set(randN(20)+15,30,randN(20)+15);



            this.__dirtyPosition = true;
        }
      }
    )
  }

	function addBalls(){
		var numBalls = 20;


		for(i=0;i<numBalls;i++){
			var ball = createBall();
			ball.position.set(randN(20)+15,30,randN(20)+15);
			ball.scale.set(0.4,0.4,0.4);
			scene.add(ball);

			ball.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==cone){
						console.log("ball "+i+" hit the cone");
						soundEffect('good.wav');
						gameState.score += 1;  // add one to the score
						if (gameState.score==numBalls) {
							gameState.scene='youwon';
						}
            //scene.remove(ball);  // this isn't working ...
						// make the ball drop below the scene ..
			ll			// threejs doesn't let us remove it from the schene...
						this.position.y = this.position.y - 100;
						this.__dirtyPosition = true;
					}

				}
			)
		}
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
		var geometry = new THREE.SphereGeometry( 80, 80, 80 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( k, k );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		//var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new THREE.Mesh( geometry, material, 0 );
		mesh.receiveShadow = false;
		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical

	}

	function createGudetama() {
		var geometry = new THREE.SphereGeometry(3,19,19);
		var texture = new THREE.TextureLoader().load('gudetama.png');
		var material = new THREE.MeshLambertMaterial( {map: texture});
		var pmaterial = new Physijs.createMaterial(material, 0.9, 0.5);
		var mesh = new Physijs.BoxMesh(geometry, pmaterial);
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		return mesh;
  }

  function createCreeper() {
    var geometry = new THREE.BoxGeometry(8,8,8);
    var texture = new THREE.TextureLoader().load('../images/'+'creeper.jpg');
    var material = new THREE.MeshLambertMaterial( {map: texture});
    var pmaterial = new Physijs.createMaterial(material, 0.9, 0.5);
    var mesh = new Physijs.BoxMesh(geometry, pmaterial);
    mesh.setDamping(0.1,0.1);
    mesh.castShadow = true;
    return mesh;
  }

  function createZantan() {
    var geometry = new THREE.BoxGeometry(8,8,8);
    var texture = new THREE.TextureLoader().load('../images/'+'red.jpg');
    var material = new THREE.MeshLambertMaterial( {map: texture});
    var pmaterial = new Physijs.createMaterial(material, 0.9, 0.5);
    var mesh = new Physijs.BoxMesh(geometry, pmaterial);
    mesh.setDamping(0.1,0.1);
    mesh.castShadow = true;
    return mesh;
  }

	// function createAvatar(){
	// 	//var geometry = new THREE.SphereGeometry( 4, 20, 20);
	// 	var geometry = new THREE.BoxGeometry( 5, 5, 6);
	// 	var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
	// 	var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
	// 	//var mesh = new THREE.Mesh( geometry, material );
	// 	var mesh = new Physijs.BoxMesh( geometry, pmaterial );
	// 	mesh.setDamping(0.1,0.1);
	// 	mesh.castShadow = true;

	// 	avatarCam.position.set(0,4,0);
	// 	avatarCam.lookAt(0,4,10);
	// 	mesh.add(avatarCam);

	// 	var scoop1 = createBoxMesh2(0xff0000,10,1,0.1); //the red object we see when running the program, added to original avatar
	// 	scoop1.position.set(0,-2,5);
	// 	mesh.add(scoop1);
	// 	return mesh;
	// }


	function createConeMesh(r,h){
		var geometry = new THREE.ConeGeometry( r, h, 32);
		var texture = new THREE.TextureLoader().load( '../images/tile.jpg' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 1, 1 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		var mesh = new Physijs.ConeMesh( geometry, pmaterial, 0 );
		mesh.castShadow = true;
		return mesh;
	}


	function createBall(){
		//var geometry = new THREE.SphereGeometry( 4, 20, 20);
		var geometry = new THREE.SphereGeometry( 1, 16, 16);
		var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
    var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		return mesh;
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
			addBalls();
			addGudetama();
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



  function updateGudetama(){
    gudetama.lookAt(suzanne.position);
    if (gudetama.position.distanceTo(suzanne.position)<=20) {
      gudetama.__dirtyPosition = true;
      gudetama.setLinearVelocity(gudetama.getWorldDirection());
    }
 }

  function updateCreeper(){
		creeper.lookAt(suzanne.position);
		creeper.__dirtyPosition = true;

		var b = new THREE.Vector3(0,1,0);
		b = creeper.lookAt(suzanne.position).transform.position - creeper.transform.position;
		creeper.rigidbody.AddForce(100 * a);

	}
  function updateZantan(){
    zantan.lookAt(suzanne.position);
    zantan.__dirtyPosition = true;

    var c = new THREE.Vector3(0,1,0);
    c = zantan.lookAt(suzanne.position).transform.position - zantan.transform.position;
    zantan.rigidbody.AddForce(100 * a);

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
        updateGudetama();
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
