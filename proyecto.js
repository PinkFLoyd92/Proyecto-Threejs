
$(document).ready(function(){
    //http://threejs.org/docs/index.html#Manual/Introduction/Creating_a_scene
    "use strict"
    var scene;
    var camera;
    var floor;
    var cubo;
    var geometry_cubo, material_cubo;


    function init() {
        /*Posicion inicial de la camara*/
        //camera.position.y = 200;
        camera.position.z = 5;

        floor = createFloor();
        scene.add(floor);

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

        requestAnimationFrame( render );
        renderer.render( scene, camera );
    }


    init();
});
