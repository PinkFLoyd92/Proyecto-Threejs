
$(document).ready(function(){
    //http://threejs.org/docs/index.html#Manual/Introduction/Creating_a_scene
    "use strict"
    var scene;
    var renderer;
    var camera;
    var floor;
    var cubo;
    var torus;
    var esfera;
    var piramide;
    var geometry_cubo, material_cubo;
    var controls;
    var spotLight;
    var amb = new THREE.AmbientLight(0x121422);
    var material_colorPrincipal;
    var lightHelper;
    function init() {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.antialias = true;
        material_colorPrincipal = new THREE.MeshPhongMaterial( { color: 0xFFFF00, specular: 0x555555, shininess: 30 } );
        floor = createFloor();
        scene.add(floor);
        controls = new THREE.OrbitControls( camera , renderer.domElement);
        controls.addEventListener( 'change', render );

        cubo = crearCubo(material_colorPrincipal);
        scene.add( cubo );

        piramide = crearPiramide(material_colorPrincipal);
        scene.add(piramide);

        esfera = crearEsfera(material_colorPrincipal);
        scene.add(esfera);

        torus = crearTorus(material_colorPrincipal);
        scene.add(torus);

        scene.add(amb);

        //camera.lookAt(cubo.position);
        camera.lookAt(cubo.position);
        addLights();
        render();
    }

    /*Creacion de la escena*/
    scene = new THREE.Scene();

    // hay mas tipos de camaras, por el momento usamos esta.
    /*campo1: campo de vista, aspect ratio= casi siempre se usa esto mismo, near, far= objetos que tengan
      mayor distancia a la de este campo no apareceran.*/
    camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,1,10000);
    camera.position.set( 1.0336990502259968 ,-213.00064651767127, 32.088254071036296);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0xccccff);
    document.body.appendChild( renderer.domElement );

    //Creacion de la luz
    // var light = new THREE.PointLight(0xffffff);
    // light.position.set(100, 250, 250);
    // scene.add(light);

    //Agrego la luz principal para generar la sombra
    function addLights() {
        // spotLight = new THREE.PointLight(0xffffff, 50, 800, 10, 20);
        // spotLight.position.set( 190, 220, 32 );
        // var spotTarget = new THREE.Object3D();
        // spotTarget.position.set(1,-200,30);
        // spotLight.target = spotTarget;
        // scene.add(spotLight);
        // scene.add(new THREE.PointLightHelper(spotLight, 1));
        // white spotlight shining from the side, casting shadow

        var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 300, 100, 100 );

        spotLight.castShadow = true;
        spotLight.angle = 0.75;
        spotLight.exponent = 2.0;
        spotLight.distance = 500;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;

        spotLight.shadow.camera.near = 500;
        spotLight.shadow.camera.far = 4000;
        spotLight.shadow.camera.fov = 30;
        //spotLight.lookAt(floor.position);

        spotLight.shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera ); // colored lines
        spotLight.shadow.camera.near = 0.1;
        spotLight.shadow.camera.far = 20000;
        lightHelper = new THREE.SpotLightHelper( spotLight );
        scene.add( new THREE.AxisHelper( 10 ) );
        scene.add( spotLight );
        scene.add(lightHelper);
    }

    /*creacion de la piramide*/
    function crearPiramide($material_color) {
        /*parametro 1: radio superior del cilindro, siendo 0 queda la punta y se anula 1 cara.
          parametro 2: radio de la parte de abajo, parametro 3: altura, parametro 4: numero de segmentos,
        */
        var pyramidGeometry = new THREE.CylinderGeometry(0, 100,200, 4, false);
        for(var i = 0; i < pyramidGeometry.faces.length; i++){
            if(pyramidGeometry.faces[i] instanceof THREE.Face4){
                pyramidGeometry.faces[i].vertexColors[0] = new THREE.Color(0xFF0000);
                if((i % 2) == 0){
                    pyramidGeometry.faces[i].vertexColors[1] = new THREE.Color(0x00FF00);
                    pyramidGeometry.faces[i].vertexColors[2] = new THREE.Color(0x0000FF);
                }
                else
                {
                    pyramidGeometry.faces[i].vertexColors[1] = new THREE.Color(0x0000FF);
                    pyramidGeometry.faces[i].vertexColors[2] = new THREE.Color(0x00FF00);
                }
                pyramidGeometry.faces[i].vertexColors[3] = new THREE.Color(0xFF0000);
            }
            else
            {
                pyramidGeometry.faces[i].vertexColors[0] = new THREE.Color(0xFF0000);
                pyramidGeometry.faces[i].vertexColors[1] = new THREE.Color(0x00FF00);
                pyramidGeometry.faces[i].vertexColors[2] = new THREE.Color(0x0000FF);
            }
        }
        var piramide = new THREE.Mesh(pyramidGeometry,$material_color);
        piramide.castShadow = true;
        piramide.name = "piramide";
        piramide.position.set(60,-150,70);
        piramide.scale.set(0.5,0.5,0.5);
        //rotamos la figura para que quede encima del plano
        piramide.rotation.x = Math.PI / 2;
        return piramide;
    }

    /*creacion del torus :V*/
    function crearTorus($material_color) {
        var geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
        var torus = new THREE.Mesh(geometry, $material_color );
        torus.castShadow = true;
        torus.position.set(100,100,50);
        return torus;
    }

    /*creacion del plano*/
    function createFloor() {
        var geometry = new THREE.PlaneGeometry( 500, 500, 8 , 8);
        geometry.dynamic = true;
        var material = new THREE.MeshPhongMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh( geometry, material );
        plane.name = 'floor';
        plane.receiveShadow = true;
        plane.position.set(0,0,0);
        return plane;
    }
    /*creacion del cubo*/
    function crearCubo($material_color){
        geometry_cubo = new THREE.BoxGeometry( 50, 50, 50 );
        //        material_cubo = new THREE.MeshBasicMaterial( { color: $color } );
        cubo = new THREE.Mesh( geometry_cubo, $material_color );
        //cubo.position.z = floor.position.z;
        cubo.position.z = 50;
        //console.log(cubo.position.z);
        cubo.castShadow = true;
        cubo.name= "cubo";
        return cubo;
    }

    function crearEsfera($material_color){
        var esfera = new THREE.Mesh(new THREE.SphereGeometry(20, 10, 20), $material_color);
        esfera.scale.set(0.5,0.5,0.5);
        esfera.castShadow = true;
        esfera.position.x = 250;
        esfera.position.y =40;
        esfera.position.z = 60;
        //esfera.position.set(90,-100.100);
        return esfera;
    }

    function render() {
        lightHelper.update();
        //      if ( spotLight.shadowCameraHelper )
        //          spotLight.shadowCameraHelper.update();
        requestAnimationFrame( render );
        /*Rotaciones de objetos*/
        cubo.rotation.z = Date.now() / 1000;
        piramide.rotation.y= Date.now() / 1000;
        esfera.rotation.z= Date.now() / 1000;
        torus.rotation.z= Date.now() / 1000;
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
            plano.material = new THREE.MeshPhongMaterial( { color: hex } );
            scene.add(plano);
        } );
        $("#cargar_ajedrez").click(function(){
            console.log("cargando tablero") ;
            eliminarObjeto('floor');
            floor = loadTableroAjedrez();
            scene.add(floor);
        });
        $(document).keydown(function(event) {
            var delta = 5;
            event = event || window.event;
            var keycode = event.keyCode;
            switch(keycode){
            case 37 : //left arrow
                camera.position.x = camera.position.x - delta;
                $("#pisoX").val(camera.position.x);
                break;
            case 38 : // up arrow
                camera.position.z = camera.position.z - delta;
                $("#pisoZ").val(camera.position.z);
                break;
            case 39 : // right arrow
                camera.position.x = camera.position.x + delta;
                $("#pisoX").val(camera.position.x);
                break;
            case 40 : //down arrow
                camera.position.z = camera.position.z + delta;
                $("#pisoZ").val(camera.position.z);
                break;
            }

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



    function animate(){
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame( animate );
        /*        spdy =  (screenH / 2 - mouseY) / 40;
                  spdx =  (screenW / 2 - mouseX) / 40;
                  if (mouseDown){
                  //cubo.rotation.x = spdy;
                  //camera.rotation.y = spdx;
                  }*/
    }

    init();
    //animar();
    animate();
    addEvents(floor);
});


/*usado http://jsfiddle.net/gfraQ/11/
  http://stackoverflow.com/questions/8426822/rotate-camera-in-three-js-with-mouse
*/
