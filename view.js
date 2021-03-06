"use strict";


let view = ()=> {
	let init = () => {

		// renderer = new THREE.WebGLRenderer();
		renderer = new THREE.WebGLRenderer( { antialias:true, alpha: true } );
		// renderer.setClearColor( 0x000000, 1);
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );

		camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
		// camera.position.z = 400;
		scene = new THREE.Scene();

		light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 1, 1, 1 );

		light2 = new THREE.DirectionalLight( 0xffffff );
		light2.position.set( 5, 2,2 );
		light2.intensity = 1;

		scene.add( light );
		scene.add( light2 );

		// scene.add( new THREE.AmbientLight( 0x888888 ) );
		// ambientLight =  new THREE.AmbientLight( 0x3f3f3f );
		// ambientLight.intensity = 10;
		// scene.add(ambientLight);
		load()

		window.addEventListener( 'resize', onWindowResize, false );
		renderer.domElement.addEventListener('click', reload, false);
	}

	let onWindowResize = () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );

	}

  let load = () => {
		scene.remove(object);
		scene.remove(object);

		light.intensity = 0.3;
		object = new THREE.Object3D();
		scene.add( object );

		// for ( var i = 0; i < 10; i ++ ) {
    //
		// 	var geometry = new THREE.SphereGeometry( Math.random() + 0.9, Math.random() + 6, Math.random()  );
		// 	var material = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } );
		// 	var mesh = new THREE.Mesh( geometry, material );
		// 	mesh.position.set( Math.random() - 0.5, Math.random() - 0.6, Math.random() - 0.5 ).normalize();
		// 	mesh.position.multiplyScalar( Math.random() * 300 );
		// 	mesh.rotation.set( Math.random() * 3, Math.random() * 3, Math.random() * 3 );
		// 	mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 46;
		// 	object.add( mesh );
    //
		// }

		camera.position.z = 400;

		composer = new THREE.EffectComposer( renderer );
		composer.addPass( new THREE.RenderPass( scene, camera ) );

		var effect = new THREE.ShaderPass( THREE.DotScreenShader );

		effect.uniforms[ 'scale' ].value = 13;
		effect.uniforms[ 'tDiffuse' ].value = 0.8;
		composer.addPass( effect );

		this.effectRGB = new THREE.ShaderPass( THREE.RGBShiftShader );
		this.effectRGB.uniforms[ 'amount' ].value = 0.0015;
		this.effectRGB.uniforms[ 'angle' ].value = 0 ;
		this.effectRGB.renderToScreen = true;
		composer.addPass( this.effectRGB );

		console.log("rgb effect uniforms value", this.effectRGB.uniforms[ 'amount' ].value );
	}

  let reload = () => {
		load();
	}

	let animate = () => {
		// console.log("ANIMATE rgb effect value", this.effectRGB.uniforms[ 'amount' ].value );

		requestAnimationFrame( animate );
		object.rotation.x += 0.001;
		object.rotation.y += 0.001;

		composer.render();

	}

	function makeTextSprite( message, parameters )
	{
		console.log("maketextsprite")
		if ( parameters === undefined ) parameters = {};

		var fontface = parameters.hasOwnProperty("fontface") ?
			parameters["fontface"] : "Arial";

		var fontsize = parameters.hasOwnProperty("fontsize") ?
			parameters["fontsize"] : 18;

		var borderThickness = parameters.hasOwnProperty("borderThickness") ?
			parameters["borderThickness"] : 4;

		var borderColor = parameters.hasOwnProperty("borderColor") ?
			parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };

		var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
			parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

		// var spriteAlignment = THREE.SpriteAlignment.topLeft;

		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		context.font = "Bold " + fontsize + "px " + fontface;

		// get size data (height depends only on font size)
		var metrics = context.measureText( message );
		var textWidth = metrics.width;

		// background color
		context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
									  + backgroundColor.b + "," + backgroundColor.a + ")";
		// border color
		context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
									  + borderColor.b + "," + borderColor.a + ")";

		context.lineWidth = borderThickness;
		roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
		// 1.4 is extra height factor for text below baseline: g,j,p,q.

		// text color
		context.fillStyle = "rgba(0, 0, 0, 1.0)";

		context.fillText( message, borderThickness, fontsize + borderThickness);

		// canvas contents will be used for a texture
		var texture = new THREE.Texture(canvas)
		texture.needsUpdate = true;

		var spriteMaterial = new THREE.SpriteMaterial(
			{ map: texture, color:  0xffffff} );
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.scale.set(100,50,1.0);
		return sprite;
	}

	// function for drawing rounded rectangles
	function roundRect(ctx, x, y, w, h, r)
	{
	    ctx.beginPath();
	    ctx.moveTo(x+r, y);
	    ctx.lineTo(x+w-r, y);
	    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
	    ctx.lineTo(x+w, y+h-r);
	    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
	    ctx.lineTo(x+r, y+h);
	    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
	    ctx.lineTo(x, y+r);
	    ctx.quadraticCurveTo(x, y, x+r, y);
	    ctx.closePath();
	    ctx.fill();
		ctx.stroke();
	}



	let addObject = function(ev, obj) {
		var geometry = new THREE.SphereGeometry( Math.random() + 0.9, Math.random() + 6, Math.random()  );
		var material = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } );
		var mesh = new THREE.Mesh( geometry, material );
		var spherePositionX =  Math.random() - 0.5;
		var spherePositionY =  Math.random() - 0.6;
		var spherePositionZ =  Math.random() - 0.5;
		mesh.position.set( spherePositionX, spherePositionY, spherePositionZ ).normalize();
		mesh.position.multiplyScalar( Math.random() * 300 );
		var sphereRotationX =  Math.random() * 3;
		var sphereRotationY =  Math.random() * 3;
		var sphereRotationZ =  Math.random() * 3;
		mesh.rotation.set( sphereRotationX, sphereRotationY, sphereRotationZ);
		mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 46;
		object.add( mesh );
	}

  let addObjectPusher = (ev, obj) => {

		addObject(ev, obj);

		if (typeof obj != "undefined") {
			if (typeof obj.message != "undefined") {
				var spritey = makeTextSprite( obj.message.title,
				{ fontsize: 32, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
				spritey.position.set(spherePositionX,spherePositionY,spherePositionZ);
				object.add( spritey );
			}
		}
  }


  let addObjectGenerator = (ev, obj) => {
		addObject(ev, obj);

		var spherePositionX =  Math.random() - 0.5;
		var spherePositionY =  Math.random() - 0.6;
		var spherePositionZ =  Math.random() - 0.5;

		var spritey = makeTextSprite( obj.name,
		{ fontsize: 32, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
		spritey.position.set(spherePositionX,spherePositionY,spherePositionZ);
		object.add( spritey );

  }
	var camera, scene, renderer, composer;
	var object, light, light2, ambientLight;

	init();
	animate();

  let customLog = (ev, status) => {
    var div = document.createElement("div");
    div.innerHTML = "### " + ev + " " + status;
    document.body.appendChild(div);
  }

  let otherLog = (ev, status) => {
    console.log(ev, status);
		// if random is true use addObjectGenerator
    addObjectPusher(ev, status);
  }

  return {
    log: otherLog
  }
}
