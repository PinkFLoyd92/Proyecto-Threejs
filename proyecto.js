
$(document).ready(function(){
    //http://threejs.org/docs/index.html#Manual/Introduction/Creating_a_scene
    "use strict"
    var velocity_cube_rotation=1;
    var velocity_pyramid_rotation=1;
    var velocity_sphere_rotation=1;
    var velocity_torus_rotation=1;
    var scene;
    var renderer;
    var running=0;
    var torusAngle;
    var lastTime=0;
    var camera;
    var floor;
    var cubo;
    var torus;
    var esfera;
    var piramide;
    var move_cube=0;
    var move_torus=0;
    var move_sphere=0;
    var move_pyramid=0;
    var rotate_cube=0;
    var rotate_torus=0;
    var rotate_sphere=0;
    var rotate_pyramid=0;
    var geometry_cubo, material_cubo;
    var controls;
    var spotLight;
    var amb = new THREE.AmbientLight(0x121422);
    var material_colorPrincipal;
    var lightHelper;
    //Picking de los objetos
    var projector;
    var mouseVector;
    var raycaster;
    var plane = new THREE.Plane();
    var objects = [];
    var container = $("#container");
    var offset = new THREE.Vector3(),
        intersection = new THREE.Vector3(),
        INTERSECTED, SELECTED;
    var grafico_seleccionado;
    function init() {
        mouseVector = new THREE.Vector2();
        raycaster = new THREE.Raycaster();
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.antialias = true;
        material_colorPrincipal = new THREE.MeshPhongMaterial( { color: 0xFFFF00, specular: 0x555555, shininess: 30 } );
        floor = createFloor();
        scene.add(floor);
        controls = new THREE.OrbitControls( camera , renderer.domElement);
        //controls.addEventListener( 'change', render );

        cubo = crearCubo(material_colorPrincipal);
        scene.add( cubo );

        piramide = crearPiramide(material_colorPrincipal);
        scene.add(piramide);

        esfera = crearEsfera(material_colorPrincipal);
        scene.add(esfera);

        torus = crearTorus(material_colorPrincipal);
        scene.add(torus);

        scene.add(amb);
        objects.push(cubo);
        objects.push(esfera);
        objects.push(torus);
        objects.push(piramide);
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
    camera.position.set( 1.0336990502259968 ,-213.00064651767127, 1202.088254071036296);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0xccccff);
    document.body.appendChild( renderer.domElement );


    function addLights() {
        spotLight = new THREE.SpotLight( 0xffffff );
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
        torus.name = "toroide";
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
        esfera.name = "esfera";
        return esfera;
    }

    function render() {
        lightHelper.update();
        raycaster.setFromCamera(mouseVector, camera);
        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects( objects );

        for ( var i = 0; i < intersects.length; i++ ) {

            intersects[ i ].object.material.color.set( 0xff0000 );
        }


        /*Rotaciones de objetos*/
        cubo.rotation.z += velocity_cube_rotation / 300;
        piramide.rotation.y += velocity_pyramid_rotation / 300;
        esfera.rotation.z += velocity_sphere_rotation / 300;
        torus.rotation.y += velocity_torus_rotation / 300;
        renderer.render( scene, camera );
    }
    function tick() {
        running=1;
        id=requestAnimationFrame(tick);
        var timeNow = new Date().getTime();
        if (lastTime != 0) {
            var elapsed = timeNow - lastTime;


            torusAngle += 0.0006 * elapsed;
        }

        lastTime = timeNow;
        torus.rotateX(torusAngle);


    }

    /*EVENTOS*/

    function addEvents(plano){
        $(window).mousedown(function(event){
            event.preventDefault();

            raycaster.setFromCamera( mouseVector, camera );

            var intersects = raycaster.intersectObjects( objects );

            if ( intersects.length > 0 ) {

                controls.enabled = false;

                SELECTED = intersects[ 0 ].object;

                if ( raycaster.ray.intersectPlane( plane, intersection ) ) {

                    offset.copy( intersection ).sub( SELECTED.position );

                }

                container.css('cursor','move');

            }
        });
        $(window).mouseup(function (event) {
            event.preventDefault();
            //controls = new THREE.OrbitControls( camera , renderer.domElement);
            //controls.enabled = true;

            if ( INTERSECTED ) {

                SELECTED = null;

            }else {
                controls.enabled = true;
            }

            container.css('cursor','auto');
        });
        $(window).mousemove(function (event) {
            event.preventDefault();

            mouseVector.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouseVector.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

            raycaster.setFromCamera( mouseVector, camera );

            if ( SELECTED ) {

                if ( raycaster.ray.intersectPlane( plane, intersection ) ) {

                    SELECTED.position.copy( intersection.sub( offset ) );


                }

                return;

            }

            var intersects = raycaster.intersectObjects( objects );

            if ( intersects.length > 0 ) {

                if ( INTERSECTED != intersects[ 0 ].object ) {

                    if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

                    INTERSECTED = intersects[ 0 ].object;
                    INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

                    plane.setFromNormalAndCoplanarPoint(
                        camera.getWorldDirection( plane.normal ),
                        INTERSECTED.position );

                }

                container.css('cursor','pointer');

            } else {

                if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

                INTERSECTED = null;

                container.css('cursor','auto');

            }
        });

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
        $("#move_cubo").click(function(){
            move_cube=1;
            move_torus=0;
            move_sphere=0;
            move_pyramid=0;
        });
        $("#move_esfera").click(function(){
            move_cube=0;
            move_torus=0;
            move_sphere=1;
            move_pyramid=0;
        });
        $("#move_toroide").click(function(){
            move_cube=0;
            move_torus=1;
            move_sphere=0;
            move_pyramid=0;
        });
        $("#move_piramide").click(function(){
            move_cube=0;
            move_torus=0;
            move_sphere=0;
            move_pyramid=1;
        });
        $("#rotate_cubo").click(function(){

            rotate_cube=1;
            rotate_torus=0;
            rotate_sphere=0;
            rotate_pyramid=0;
        });
        $("#rotate_esfera").click(function(){

            rotate_cube=0;
            rotate_torus=0;
            rotate_sphere=1;
            rotate_pyramid=0;
        });
        $("#rotate_toroide").click(function(){

            rotate_cube=0;
            rotate_torus=1;
            rotate_sphere=0;
            rotate_pyramid=0;
        });
        $("#rotate_piramide").click(function(){

            rotate_cube=0;
            rotate_torus=0;
            rotate_sphere=0;
            rotate_pyramid=1;
        });

        $('input[type=range]').on('input', function () {
            $(this).trigger('change');
            var newval=$(this).val();
            if(rotate_pyramid==1){
                velocity_pyramid_rotation=newval;
            }
            else if(rotate_cube==1){
                velocity_cube_rotation=newval;
            }
            else if(rotate_sphere==1){
                velocity_sphere_rotation=newval;
            }
            else  if(rotate_torus==1){
                velocity_torus_rotation=newval;
            }
        });
        $("#toggle_luces").click(function() {
            if (spotLight.castShadow === true) {
                spotLight.shadowCameraHelper = false;
                spotLight.castShadow = false;
                spotLight.power = 0;
            }else{
                spotLight.shadowCameraHelper = true;
                spotLight.castShadow = true;
                spotLight.power = 5;
            }



        });
        $("#toggle_sombras").click(function() {
            console.log("toggle");
            floor.receiveShadow = floor.receiveShadow === true? false:true;
            $("#toggle_luces").click();
            setTimeout(toggle_luces,0.00000000000000001);
        });

        $(document).keydown(function(event) {
            var delta = 5;
            event = event || window.event;
            var keycode = event.keyCode;
            switch(keycode){
                case 68 : //a
                    if(move_pyramid==1){
                        piramide.position.x = piramide.position.x+10;
                    }
                    else  if(move_cube==1){
                        cubo.position.x = cubo.position.x+10;
                    }
                    else  if(move_sphere==1){
                        esfera.position.x = esfera.position.x+10;
                    }
                    else  if(move_torus==1){
                        torus.position.x = torus.position.x+10;
                    }

                    break;
                case 65 : //d
                    if(move_pyramid==1){
                        piramide.position.x = piramide.position.x-10;
                    }
                    else  if(move_cube==1){
                        cubo.position.x = cubo.position.x-10;
                    }
                    else  if(move_sphere==1){
                        esfera.position.x = esfera.position.x-10;
                    }
                    else  if(move_torus==1){
                        torus.position.x = torus.position.x-10;
                    }

                    break;
                case 87 : //w
                    if(move_pyramid==1){
                        piramide.position.z = piramide.position.z+10;
                    }
                    else  if(move_cube==1){
                        cubo.position.z = cubo.position.z+10;
                    }
                    else  if(move_sphere==1){
                        esfera.position.z = esfera.position.z+10;
                    }
                    else  if(move_torus==1){
                        torus.position.z = torus.position.z+10;
                    }
                    break;
                case 83 : //s
                    if(move_pyramid==1){
                        piramide.position.z = piramide.position.z-10;
                    }
                    else  if(move_cube==1){
                        cubo.position.z = cubo.position.z-10;
                    }
                    else  if(move_sphere==1){
                        esfera.position.z = esfera.position.z-10;
                    }
                    else  if(move_torus==1){
                        torus.position.z = torus.position.z-10;
                    }
                    break;
                case 90 : //z
                    if(move_pyramid==1){
                        piramide.position.y = piramide.position.y+10;
                    }
                    else  if(move_cube==1){
                        cubo.position.y = cubo.position.y+10;
                    }
                    else  if(move_sphere==1){
                        esfera.position.y = esfera.position.y+10;
                    }
                    else  if(move_torus==1){
                        torus.position.y = torus.position.y+10;
                    }
                    break;
                case 88 : //x
                    if(move_pyramid==1){
                        piramide.position.y = piramide.position.y-10;
                    }
                    else  if(move_cube==1){
                        cubo.position.y = cubo.position.y-10;
                    }
                    else  if(move_sphere==1){
                        esfera.position.y = esfera.position.y-10;
                    }
                    else  if(move_torus==1){
                        torus.position.y = torus.position.y-10;
                    }
                    break;
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

        $('.cambiar_color').on('input', function() {
            var figura = $(this).attr("data-toggle");
            var color = new THREE.Color( $(this).val() );
            var hex = color.getHex();
            switch(figura){
                case "CUBO":{

                    var material_color = new THREE.MeshPhongMaterial( { color: color, specular: 0x555555, shininess: 30 } );
                    cubo.material = material_color;
                    console.log("cubo");

                    break;
                }
                case "TOROIDE":{
                    var material_color = new THREE.MeshPhongMaterial( { color: color, specular: 0x555555, shininess: 30 } );
                    torus.material = material_color;
                    console.log("toroide");
                    break;
                }
                case "PIRAMIDE":{
                    var material_color = new THREE.MeshPhongMaterial( { color: color, specular: 0x555555, shininess: 30 } );
                    piramide.material = material_color;
                    console.log("piramide");
                    break;
                }
                case "ESFERA":{
                    var material_color = new THREE.MeshPhongMaterial( { color: color, specular: 0x555555, shininess: 30 } );
                    esfera.material = material_color;
                    console.log("esfera");
                    break;
                }
                default:
                    break;
            }
        });
        // Trigger action when the contexmenu is about to be shown
        $(document).bind("contextmenu", function (event) {
            if(event.target.nodeName === "DIV"){
		return;
            }
            //console.log("se abre el context menu");
            else if(event.target.nodeName === "CANVAS"){
		var intersects = raycaster.intersectObjects( objects );
		if ( intersects.length > 0 ){
		    //console.log(intersects[0].object);
		    grafico_seleccionado = intersects[0].object;
		}else{
		    return;
		}
		  
		event.preventDefault();
                $(".custom-menu").finish().toggle(100).
                                  css({
                                      top: event.pageY + "px",
                                      left: event.pageX + "px"
                                  });
            }});

        $(document).bind("mousedown", function (e) {
            if (!$(e.target).parents(".custom-menu").length > 0) {
                $(".custom-menu").hide(100);
            }
        });


        // If the menu element is clicked
        $(".custom-menu li").click(function(){

            // This is the triggered action name
            switch($(this).attr("data-action")) {

                    // A case for each action. Your actions here
                case "textura_1": var loader = new THREE.TextureLoader();
                    loader.load('images/grass.gif',
                                function ( texture ) {
                                    // do something with the texture
                                    var material_texture = new THREE.MeshBasicMaterial( {
                                        map: texture
                                    } );
                                    grafico_seleccionado.material = material_texture;

                                }
                    );
                    break;
                case "textura_2":
                    var loader = new THREE.TextureLoader();
                    loader.load('images/moon.gif',
                                function ( texture ) {
                                    // do something with the texture
                                    var material_texture = new THREE.MeshBasicMaterial( {
                                        map: texture
                                    } );
                                 grafico_seleccionado.material = material_texture;

                                }
                    );
                    break;
                case "textura_3":
                    var loader = new THREE.TextureLoader();
                    loader.load('images/crate.gif',
                                function ( texture ) {
                                    // do something with the texture
                                    var material_texture = new THREE.MeshBasicMaterial( {
                                        map: texture
                                    } );
                                    grafico_seleccionado.material = material_texture;

                                }
                    );
                    break;
                case "textura_4":
                    var loader = new THREE.TextureLoader();
                    loader.load('images/bricks.gif',
                                function ( texture ) {
                                    // do something with the texture
                                    var material_texture = new THREE.MeshBasicMaterial( {
                                        map: texture
                                    } );
                                    grafico_seleccionado.material = material_texture;

                                }
                    );
                    break;
            }
            $(".custom-menu").hide(100);
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

        cbmaterials.push( new THREE.MeshPhongMaterial( { color: 0xffffff, side: THREE.DoubleSide }) );
        cbmaterials.push( new THREE.MeshPhongMaterial( { color: 0x000000, side: THREE.DoubleSide }) );

        var l = cbgeometry.faces.length / 2; // <-- Right here. This should still be 8x8 (64)

        //console.log("This should be 64: " + l);// Just for debugging puporses, make sure this is 64

        for( var i = 0; i < l; i ++ ) {
            var j = i * 2; // <-- Added this back so we can do every other 'face'
            cbgeometry.faces[ j ].materialIndex = ((i + Math.floor(i/8)) % 2); // The code here is changed, replacing all 'i's with 'j's. KEEP THE 8
            cbgeometry.faces[ j + 1 ].materialIndex = ((i + Math.floor(i/8)) % 2); // Add this line in, the material index should stay the same, we're just doing the other half of the same face
        }

        // Mesh
        var cb = new THREE.Mesh( cbgeometry, new THREE.MeshFaceMaterial( cbmaterials ) );
        cb.receiveShadow = true;
        cb.name = "floor";
        return cb;


        mesh.receiveShadow = true;
        return mesh;

    }

    /*MOVIMIENTO DEL MOUSE*/
    var screenW = window.innerWidth;
    var screenH = window.innerHeight;
    var spdx = 0, spdy = 0; var mouseX = 0, mouseY = 0, mouseDown = false; /*MOUSE*/
    document.addEventListener('mousemove', function(event) {

        mouseX = event.clientX;
        mouseY = event.clientY;

        loadCameraPosition();
        //loadTableroAjedrez();
        floor.geometry.colorsNeedUpdate = true;


    }, false);
    function toggle_luces(){
        $("#toggle_luces").click();
    }



    function animate(){
        controls.update();
        render();
        requestAnimationFrame( animate );

    }

    init();
    //animar();
    animate();
    addEvents(floor);
    requestAnimationFrame( render );
});


/*usado http://jsfiddle.net/gfraQ/11/
   http://stackoverflow.com/questions/8426822/rotate-camera-in-three-js-with-mouse
 */
