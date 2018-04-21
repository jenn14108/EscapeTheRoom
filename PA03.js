var scene, renderer;
var camera, avatarCam;
var avatar, suzanne, toilet,coffeeTable, ball1, ball2, gift,gift1,ball3, ball4, count, counter, ball5;
var startScene, endScene, endCamera, endText, startText, startCamera, loseScene, loseCamera, loseText;
var controls =
	{fwd:false, bwd:false, left:false, right:false,
	speed:10, fly:false, room1Tele: false, room2Tele:false, room2Tele2:false,
	camera:camera}
var gameState =
	{scene:'startgame', camera:'none'}

init();
initControls();
animate();

function createLoseScene() {
	loseScene = initScene();
	loseText = createSkyBox('youlose.png', 10);
	loseScene.add(loseText);
	loseText.rotateX(Math.PI);
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
	startText = createSkyBox('start.png', 1);
	startText.rotateX(-Math.PI/2);
	startScene.add(startText);
	var light2 = createPointLight();
	light2.position.set(0,200,20);
	startScene.add(light2);
	startCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
	startCamera.position.set(0,50,1);
	startCamera.lookAt(0,0,0);
	gameState.scene='startgame';
}

function init(){
	initPhysijs();
	scene = initScene();
	createStartScene();
	createEndScene();
	createLoseScene();
	initRenderer();
	initTextMesh();
	createMainScene();
	initTextMesh1();
	initTextMesh3();
	initTextMesh5();
}

function createMainScene(){
	counter = 0;
	var light1 = createPointLight();
	light1.position.set(0,200,20);
	scene.add(light1);
	var light0 = new THREE.AmbientLight( 0xffffff,0.25);
	scene.add(light0);

	// create main camera
	camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.set(0,120,0);
	camera.lookAt(0,0,0);

	// create the ground and the skybox
	var ground = createGround('wood.jpg');
	scene.add(ground);
	var wall1 = createWalls('pinkwood.png',3,180);
	wall1.position.set(0,0,0);
	wall1.__dirtyPosition=true;
	scene.add(wall1);

	var wall2 = createWalls('pinkwood.png',3,180);
	wall2.rotateY(Math.PI/2);
	wall2.position.set(0,0,0);
	wall2.__dirtyPosition=true;
	scene.add(wall2);

	avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
	avatarCam.translateY(-4);
	avatarCam.translateZ(3);
	gameState.camera = avatarCam;

  ball1 = createBall();
  ball1.translateX(-60);
	ball1.translateZ(-60);
  ball1.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
        if (other_object==suzanne){
          controls.room1Tele = true;
        }
      }
    )
  scene.add(ball1);

	ball2 = createBall();
	ball2.translateX(40);
	ball2.translateZ(-25);
	ball2.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
		  if (other_object==coffeeTable && counter == 0){
				gift=createGift();
				gift.translateX(60);
				gift.translateZ(-60);
				gift.translateY(3);
				counter++;
				gift.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
							if (other_object==suzanne){
								controls.room2Tele2 = true;
							}
						}
					)
			  scene.add(gift);
		  }
		}
	)
	scene.add(ball2);

	ball3 = createBall();
	ball3.translateX(-60);
	ball3.translateZ(60);
	ball3.translateY(3);
	scene.add(ball3);

	ball4 = createBall();
  ball4.translateX(-50);
	ball4.translateZ(60);
	ball4.translateY(3);
  ball4.addEventListener('collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
        if (other_object==ball3){
					if (count<4) {
						count++;
					} else {
						initTextMesh4();
					}
        }
      }
    )
  scene.add(ball4);

	ball5 = createBall();
	ball5.translateX(40);
	ball5.translateZ(40);
	ball5.translateY(2);
	ball5.addEventListener('collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
				if (other_object==suzanne){
					gameState.scene = 'youwon';
				}
			}
		)
	scene.add(ball5);

	gift1 = createGift1();
	gift1.translateX(-30);
	gift1.translateZ(-50);
	gift1.translateY(3);
	scene.add(gift1);

	initSuzanne();
  initCoffeeTable();
  initToiletOBJ();
}

function initSuzanne(){
	var loader = new THREE.JSONLoader();
	loader.load("../models/suzanne.json",
		function ( geometry, materials ) {
			console.log("loading suzanne");
			var material = new THREE.MeshLambertMaterial( );
			suzanne = new Physijs.BoxMesh(geometry, material );
			suzanne.setDamping(0.1,0.1);
			suzanne.castShadow = true;

			avatarCam.position.set(0,4,0);
			avatarCam.lookAt(0,4,10);
			suzanne.add(avatarCam);

			var s = 2;
			suzanne.scale.y=s;
			suzanne.scale.x=s;
			suzanne.scale.z=s;
			suzanne.position.z = -50;
			suzanne.position.y = 3;
			suzanne.position.x = -50;
			suzanne.castShadow = true;
			scene.add(suzanne);
		},
		function(xhr){
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},
		function(err){console.log("error in loading: "+err);}
	)

}

function createBall(){
    var geometry = new THREE.SphereGeometry( 1, 16, 16);
    var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
    var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
    var mesh = new Physijs.BoxMesh( geometry, material );
    mesh.setDamping(0.1,0.1);
    mesh.castShadow = true;
    return mesh;
}

function createGift(){
	var geometry = new THREE.BoxGeometry(5, 5, 5);
	var texture = new THREE.TextureLoader().load('../images/'+'gift.jpg');
  var material = new THREE.MeshLambertMaterial( {map: texture});
  var pmaterial = new Physijs.createMaterial(material, 0.9, 0.5);
	var mesh = new Physijs.BoxMesh( geometry, material, 100);
	mesh.setDamping(0.1,0.1);
	mesh.castShadow = true;
	return mesh;
}

function createGift1(){
	var geometry = new THREE.BoxGeometry(5, 5, 5);
	var texture = new THREE.TextureLoader().load('../images/'+'bluewood.jpeg');
  var material = new THREE.MeshLambertMaterial( {map: texture});
  var pmaterial = new Physijs.createMaterial(material, 0.9, 0.5);
	var mesh = new Physijs.BoxMesh( geometry, material, 100);
	mesh.setDamping(0.1,0.1);
	mesh.castShadow = true;
	return mesh;
}

function initCoffeeTable(){
   var loader = new THREE.JSONLoader();
   loader.load("../models/coffeeTable.json",
		function ( geometry, materials ) {
		console.log("loading coffee table");
		var texture = new THREE.TextureLoader().load('../images/yellowwood.jpeg');
		var material = new THREE.MeshLambertMaterial({map: texture});
		var pmaterial = new Physijs.createMaterial(material, 0.2, 0.5);
		coffeeTable = new Physijs.BoxMesh(geometry, pmaterial, 200);
		coffeeTable.setDamping(0.1,0.1);
		var s = 7;
		coffeeTable.scale.y=s;
		coffeeTable.scale.x=s;
		coffeeTable.scale.z=s;
		coffeeTable.position.z = -40;
		coffeeTable.position.y = 5;
		coffeeTable.position.x = 30;
		coffeeTable.castShadow = true;
		scene.add(coffeeTable);
		},
		function(xhr){
		console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},
		function(err){console.log("error in loading: "+err);}
		)

}

function initToiletOBJ(){
	var loader = new THREE.OBJLoader();
	loader.load("../models/toilet.obj",
		function (toilet) {
		console.log("loading toilet file");
		toilet.castShadow = true;
		toilet.scale.x=0.1;
		toilet.scale.y=0.1;
		toilet.scale.z=0.1;
		toilet.position.y = 6;
		toilet.position.z = 40;
		toilet.position.x = 40;
		toilet.castShadow = true;
		toilet.rotateY(Math.PI/2);
		scene.add(toilet);

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
	var geometry = new THREE.PlaneGeometry(80, 80, 80);
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

function createWalls(image,k, size){
	// creating a textured plane which receives shadows
	var geometry = new THREE.PlaneGeometry(size,120,size);
	var texture = new THREE.TextureLoader().load( '../images/'+image );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(k,k);
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
	var mesh = new Physijs.BoxMesh( geometry, material, 0 );
	mesh.receiveShadow = true;
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

	if (gameState.scene == 'startgame' && event.key == 'p'){
		gameState.scene = 'main';
		return;
	}

	if (gameState.scene == 'youwon' && event.key=='r') {
		gameState.scene = 'main';
		//gameState.score = 0;
		return;
	}

	if (gameState.scene == 'youlose' && event.key=='r'){
		gameState.scene = 'main';
		return;
	}

	switch (event.key){
		case "w": controls.fwd = true;  break;
		case "s": controls.bwd = true; break;
		case "a": controls.left = true; break;
		case "d": controls.right = true; break;
  	case " ": controls.fly = true;
        console.log("FLY!!"); break;
		// switch cameras
		case "1": gameState.camera = camera; break;
		case "2": gameState.camera = avatarCam; break;

		// move the camera around, relative to the avatar
		case "ArrowLeft": avatarCam.translateY(1);break;
		case "ArrowRight": avatarCam.translateY(-1);break;
		case "ArrowUp": avatarCam.translateZ(-1);break;
		case "ArrowDown": avatarCam.translateZ(1);break;
		case "q": avatarCam.translateX(-1);break;
		case "e": avatarCam.translateX(1);break;
		case "p": gameState.scene == 'main';
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
  	case " ": controls.fly = false; break;
	}
}


function updateAvatar(){
	//"change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"
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

    if (controls.room1Tele) {
      suzanne.position.x=50;
      suzanne.position.z=-40;
      suzanne.__dirtyPosition=true;
      controls.room1Tele = false;
    }

		if (controls.room2Tele2) {
			suzanne.position.x=-50;
			suzanne.position.z=50;
			suzanne.__dirtyPosition=true;
			controls.room2Tele2 = false;
		}

	if (suzanne.position.y<=0) {
		gameState.scene="youlose";
	}
	if (coffeeTable.position.y<=0) {
		gameState.scene="youlose";
	}
}

function animate() {
	requestAnimationFrame( animate );
	switch(gameState.scene) {
		case "startgame":
			//startText.rotateY(0.005);
			renderer.render(startScene,startCamera);
			break;

		case "youwon":
			endText.rotateY(0.005);
			renderer.render(endScene, endCamera );
			break;

		case "youlose":
			loseText.rotateY(0.005);
			renderer.render(loseScene, loseCamera);
			break;

		case "main":
			updateAvatar();
    		scene.simulate();
			if (gameState.camera!= 'none'){
				renderer.render( scene, gameState.camera );
			}
			break;

		default:
		 console.log("don't know the scene "+gameState.scene);

	}
}

function initTextMesh(){
	var loader = new THREE.FontLoader();
	loader.load( '/fonts/helvetiker_regular.typeface.json',
				createTextMesh);
	console.log("preparing to load the font");

}

function createTextMesh(font) {
	var textGeometry =
	new THREE.TextGeometry('Welcome to room 1! \n Go to the ball...',
	  {
	   font: font,
	   size: 4,
	   height: 2,
	   curveSegments: 12,
	   bevelEnabled: true,
	   bevelThickness: 0.01,
	   bevelSize: 0.08,
	   bevelSegments: 5
	  }
	 );

	var textMaterial =
	new THREE.MeshLambertMaterial( { color: 0xaaaaff } );

	textMesh =
	new THREE.Mesh( textGeometry, textMaterial );

	textMesh.position.x= -25;
	textMesh.position.z= -5;
	textMesh.position.y= 10;
	textMesh.rotateY(Math.PI);
	scene.add(textMesh);

	console.log("added textMesh to scene");
}

function initTextMesh1(){
	var loader = new THREE.FontLoader();
	loader.load( '/fonts/helvetiker_regular.typeface.json',
	      createTextMesh1);
	console.log("preparing to load the font");

}

function createTextMesh1(font) {
    var textGeometry =
    new THREE.TextGeometry('Welcome to room 2. \n Hint: something can be moved!',
      {
       font: font,
       size: 4,
       height: 2,
       curveSegments: 12,
       bevelEnabled: true,
       bevelThickness: 0.01,
       bevelSize: 0.08,
       bevelSegments: 5
      }
     );
	var textMaterial = new THREE.MeshLambertMaterial( { color: 0xaaaaff } );
	textMesh = new THREE.Mesh( textGeometry, textMaterial );
	textMesh.position.x= 20;
	textMesh.position.z= -80;
	textMesh.position.y= 10;
	//textMesh.rotateY(Math.PI);
	scene.add(textMesh);
	console.log("added textMesh to scene");
}

function initTextMesh3(){
	var loader = new THREE.FontLoader();
	loader.load( '/fonts/helvetiker_regular.typeface.json',
	      createTextMesh3);
	console.log("preparing to load the font");

}
function createTextMesh3(font) {
    var textGeometry =
    new THREE.TextGeometry('Let the two balls collide \n and see what happens!',
      {
       font: font,
       size: 4,
       height: 2,
       curveSegments: 12,
       bevelEnabled: true,
       bevelThickness: 0.01,
       bevelSize: 0.08,
       bevelSegments: 5
      }
     );
	var textMaterial = new THREE.MeshLambertMaterial( { color: 0xaaaaff } );
	textMesh = new THREE.Mesh( textGeometry, textMaterial );
	textMesh.position.x= -90;
	textMesh.position.z= 10;
	textMesh.position.y= 10;
	//textMesh.rotateY(Math.PI);
	scene.add(textMesh);
	console.log("added textMesh to scene");
}

function initTextMesh4(){
	var loader = new THREE.FontLoader();
	loader.load( '/fonts/helvetiker_regular.typeface.json',
	      createTextMesh4);
	console.log("preparing to load the font");

}
function createTextMesh4(font) {
    var textGeometry =
    new THREE.TextGeometry('Press the space key to fly to room4!!',
      {
       font: font,
       size: 4,
       height: 2,
       curveSegments: 12,
       bevelEnabled: true,
       bevelThickness: 0.01,
       bevelSize: 0.08,
       bevelSegments: 5
      }
     );
	var textMaterial = new THREE.MeshLambertMaterial( { color: 0xaaaaff } );
	textMesh = new THREE.Mesh( textGeometry, textMaterial );
	textMesh.position.x= -10;
	textMesh.position.z= 80;
	textMesh.position.y= 10;
	textMesh.rotateY(Math.PI);
	scene.add(textMesh);
	console.log("added textMesh to scene");
}

function initTextMesh5(){
	var loader = new THREE.FontLoader();
	loader.load( '/fonts/helvetiker_regular.typeface.json',
	      createTextMesh5);
	console.log("preparing to load the font");

}
function createTextMesh5(font) {
    var textGeometry =
    new THREE.TextGeometry('There is something in the toilet.',
      {
       font: font,
       size: 4,
       height: 2,
       curveSegments: 12,
       bevelEnabled: true,
       bevelThickness: 0.01,
       bevelSize: 0.08,
       bevelSegments: 5
      }
     );
	var textMaterial = new THREE.MeshLambertMaterial( { color: 0xaaaaff } );
	textMesh = new THREE.Mesh( textGeometry, textMaterial );
	textMesh.position.x= 80;
	textMesh.position.z= 80;
	textMesh.position.y= 10;
	textMesh.rotateY(Math.PI);
	scene.add(textMesh);
	console.log("added textMesh to scene");
}
