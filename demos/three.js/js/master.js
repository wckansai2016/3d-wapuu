// JavaScript Document

var container, stats;

			var camera, scene, renderer, objects;
			var particleLight;
			var dae;
			
			var controls;
			
			var targetRotation = 0;
			var targetRotationOnMouseDown = 0;

			var mouseX = 0;
			var mouseXOnMouseDown = 0;
			
			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;
			

			var loader = new THREE.ColladaLoader();
			loader.options.convertUpAxis = true;
			loader.load( load3dFile, function ( collada ) {

				dae = collada.scene;
				
				dae.traverse( function ( child ) {

					if ( child instanceof THREE.SkinnedMesh ) {

						var animation = new THREE.Animation( child, child.geometry.animation );
						animation.play();
					}

				} );
				

				dae.scale.x = dae.scale.y = dae.scale.z = 0.007;
				dae.updateMatrix();

				init();
				animate();

			} );

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.set( 2, 2, 3 );
				
			

				scene = new THREE.Scene();

				

				// Add the COLLADA
				scene.add( dae );

				// Lights

				scene.add( new THREE.AmbientLight( 0x333333 ) );
				var light = new THREE.DirectionalLight(0xffffff,0.3);
				light.position.set(0, 0, 1).normalize();
				scene.add( light );

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.setClearColor( 0xffffff, 1 );
				container.appendChild( renderer.domElement );

				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				container.appendChild( stats.domElement );
				
				
				controls = new THREE.OrbitControls( camera, renderer.domElement );
				controls.enableDamping = true;
				controls.dampingFactor = 0.1;
				controls.enableZoom = true;
				controls.rotateSpeed = 0.3;   //回転速度
				
				controls.autoRotate = true;
				controls.autoRotateSpeed = 0.5; // 30 seconds per round when fps is 60
				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {
				
				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}



			function animate() {

				requestAnimationFrame( animate );
				
				controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true

				render();
				stats.update();

			}

			var clock = new THREE.Clock();

			function render() {

				var timer = Date.now() * 0.0005;
				camera.lookAt( scene.position );
				dae.rotation.y += ( targetRotation - dae.rotation.y ) * 0.05;
				
				THREE.AnimationHandler.update( clock.getDelta() );

				renderer.render( scene, camera );

			}
			