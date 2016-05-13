
$(document).ready(function(){
    //http://threejs.org/docs/index.html#Manual/Introduction/Creating_a_scene
    "use strict"
    var scene;
    var camera;
    var floor;
    var cubo;
    var geometry_cubo, material_cubo;
    var controls;


    function init() {
        /*Posicion inicial de la camara*/
        //camera.position.y = 200;
        camera.position.z = 5;
        floor = createFloor();
        scene.add(floor);
	controls = new THREE.OrbitControls( camera );
	controls.addEventListener( 'change', render );
	
        cubo = crearCubo();
        scene.add( cubo );
        render();
    }

    /*Creacion de la escena*/
    scene = new THREE.Scene();

    // hay mas tipos de camaras, por el momento usamos esta.
    /*campo1: campo de vista, aspect ratio= casi siempre se usa esto mismo, near, far= objetos que tengan
      mayor distancia a la de este campo no apareceran.*/
    camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );


    /*creacion del plano*/
    function createFloor() {
        var geometry = new THREE.PlaneGeometry( 5, 20, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( geometry, material );
        return plane;
    }
    /*creacion del cubo*/
    function crearCubo(){
        geometry_cubo = new THREE.BoxGeometry( 1, 1, 1 );
        material_cubo = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        cubo = new THREE.Mesh( geometry_cubo, material_cubo );
        return cubo;
    }


    function render() {

      //  requestAnimationFrame( animate );
        //floor.rotation.z = Date.now() / 1000;
        renderer.render( scene, camera );
    }

/*MOVIMIENTO DEL MOUSE*/
    var screenW = window.innerWidth;
    var screenH = window.innerHeight;
    var spdx = 0, spdy = 0; var mouseX = 0, mouseY = 0, mouseDown = false; /*MOUSE*/
    document.addEventListener('mousemove', function(event) {

        mouseX = event.clientX;
        mouseY = event.clientY;
    }, false);
    
    document.body.addEventListener("mousedown", function(event) {
        mouseDown = true;
	console.log(mouseDown);
	animate();
    }, false);
    document.body.addEventListener("mouseup", function(event) {
        mouseDown = false;
	console.log(mouseDown);
    }, false);
    function animate()
    {
	console.log("ENTRO EN ANIMAR");
        spdy =  (screenH / 2 - mouseY) / 40;
        spdx =  (screenW / 2 - mouseX) / 40;
        if (mouseDown){
            floor.rotation.x = spdy;
            floor.rotation.y = spdx;
        }
    }
    requestAnimationFrame(animate);
    init();
    //animar();
    animate();
});


/*usadffo http://jsfiddle.net/gfraQ/11/
  http://stackoverflow.com/questions/8426822/rotate-camera-in-three-js-with-mouse
*/
