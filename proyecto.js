
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
        var geometry = new THREE.PlaneGeometry( 500, 500, 8 , 8);
        geometry.dynamic = true;
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( geometry, material );
        plane.name = 'floor';
        plane.receiveShadow = true;
        return plane;
    }
    /*creacion del cubo*/
    function crearCubo(){
        geometry_cubo = new THREE.BoxGeometry( 1, 1, 1 );
        material_cubo = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        cubo = new THREE.Mesh( geometry_cubo, material_cubo );
        //cubo.position.z = floor.position.z;
	cubo.position.z = 0.5;
	console.log(cubo.position.z);
	
        cubo.name= "cubo";
        return cubo;
    }


    function render() {
        requestAnimationFrame( render );
        /*Rotaciones de objetos*/
        cubo.rotation.z = Date.now() / 1000;

        renderer.render( scene, camera );
    }



    /*EVENTOS*/

    function addEvents(plano){
        $('#color_picker').on('input', function() {
            console.log($(this).val());
            //plano.material.setStyle($(this).val());
            eliminarObjeto('floor');
            plano = createFloor();
            var color = new THREE.Color( $(this).val() );
            var hex = color.getHex();
            plano.material = new THREE.MeshBasicMaterial( { color: hex } );
            scene.add(plano);
        } );
        $("#cargar_ajedrez").click(function(){
            console.log("cargando tablero") ;
            eliminarObjeto('floor');
            floor = loadTableroAjedrez();
            scene.add(floor);
        });
    }
    /*carga de la posicion de la camara en los input.*/
    function loadCameraPosition(){
        var pisoX, pisoY, pisoZ;
        pisoX = $("#pisoX");
        pisoX.val(camera.position.x);

        pisoY = $("#pisoY");
        pisoY.val(camera.position.y);

        pisoZ = $("#pisoZ");
        pisoZ.val(camera.position.z);
    }

    /*function para remover objeto de escena*/
    function eliminarObjeto(name) {
        for(var i = 0; i < scene.children.length; i++) {
            if(scene.children[i].name === name){
                scene.remove(scene.children[i] );
            }
        }
        animate();
    }

    /*http://stackoverflow.com/questions/22689898/three-js-checkerboard-plane*/
    // funcion tomada de este tema en stackoverflow.
    function loadTableroAjedrez(){
        // Geometry
        var cbgeometry = new THREE.PlaneGeometry( 500, 500, 8, 8 );

        // Materials
        var cbmaterials = [];

        cbmaterials.push( new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide }) );
        cbmaterials.push( new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.DoubleSide }) );

        var l = cbgeometry.faces.length / 2; // <-- Right here. This should still be 8x8 (64)

        //console.log("This should be 64: " + l);// Just for debugging puporses, make sure this is 64

        for( var i = 0; i < l; i ++ ) {
            var j = i * 2; // <-- Added this back so we can do every other 'face'
            cbgeometry.faces[ j ].materialIndex = ((i + Math.floor(i/8)) % 2); // The code here is changed, replacing all 'i's with 'j's. KEEP THE 8
            cbgeometry.faces[ j + 1 ].materialIndex = ((i + Math.floor(i/8)) % 2); // Add this line in, the material index should stay the same, we're just doing the other half of the same face
        }

        // Mesh
        var cb = new THREE.Mesh( cbgeometry, new THREE.MeshFaceMaterial( cbmaterials ) );
        cb.name = "floor";
        return cb;

        /*        var materiales = [];
        // se tienen los 2 tipos de material a meter en cada cara del tablero.
        materiales.push(new THREE.MeshBasicMaterial({color: 0xffffff, side:THREE.DoubleSide }));
        materiales.push(new THREE.MeshBasicMaterial({color: 0x000000, side:THREE.DoubleSide }));

        //      floor.material = materiales;
        var longitud = floor.geometry.faces.length;
        //console.log(longitud); // verificamos que hayan 128 caras
        var geometry = new THREE.PlaneGeometry( 500, 500, 8 , 8);
        geometry.dynamic = true;
        for(var i = 0; i < longitud; i++) {
        if(i%2 !== 0){
        geometry.faces[i].materialIndex = 0;
        geometry.faces[i].material = materiales[0];
        }else{
        geometry.faces[i].materialIndex = 1;
        geometry.faces[i].material = materiales[1];
        }
        }
        var mesh = new THREE.Mesh( floor.geometry,materiales );
        mesh.name = 'floor';
        mesh.receiveShadow = true;
        return mesh;
        //scene.add(floor);

        */
    }
    /*MOVIMIENTO DEL MOUSE*/
    var screenW = window.innerWidth;
    var screenH = window.innerHeight;
    var spdx = 0, spdy = 0; var mouseX = 0, mouseY = 0, mouseDown = false; /*MOUSE*/
    document.addEventListener('mousemove', function(event) {

        mouseX = event.clientX;
        mouseY = event.clientY;

        loadCameraPosition();
        loadTableroAjedrez();
        floor.geometry.colorsNeedUpdate = true;


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
        spdy =  (screenH / 2 - mouseY) / 40;
        spdx =  (screenW / 2 - mouseX) / 40;
        if (mouseDown){
            //cubo.rotation.x = spdy;
            //camera.rotation.y = spdx;
        }
    }

    init();
    //animar();
    animate();
    addEvents(floor);
});


/*usado http://jsfiddle.net/gfraQ/11/
  http://stackoverflow.com/questions/8426822/rotate-camera-in-three-js-with-mouse
*/
