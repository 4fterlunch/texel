let $ = require("jquery");

const demoPath = "demo/walnutleaf.png";

function TexelImage(name="") {
    this.name = name;
    this.filePath = "";
}

function TexelProject(name="") {
    this.name = name;
    this.colourMap = null;
    this.heightMap = null;
    this.normalMap = null;
    this.clearcoatMap = null;
    this.roughnessMap = null;
    this.alphaMap = null;

    this.settings = {
        preview: {
            transparency: true,
            opacity: 1.0,
            alphaTest: 0.0,
            clearcoat: 0.0,
            roughness: 0.0,
        }



    }
}


var scene = new THREE.Scene();
scene.background = new THREE.Color( 0x222222 );
var ambient = new THREE.AmbientLight( 0x222222 ,7);
scene.add( ambient );


var spot1 = new THREE.SpotLight( 0xffffff, 1 );
spot1.position.set( 300, 300, 500 );
spot1.angle = 0.80;
spot1.penumbra = 0.75;
spot1.intensity = 2;
spot1.decay = 2;

spot1.castShadow = true;
spot1.shadow.bias = 0.0001;
spot1.shadow.mapSize.width = 2048;
spot1.shadow.mapSize.height = 2048;

scene.add(spot1);

    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
    var texLoader = new THREE.TextureLoader();
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var texelContainer = document.getElementById("texel-container");
    var plane;
    //ui


    texelContainer.appendChild( renderer.domElement );


    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.z = 2000;

    //img editor
    var image = new MarvinImage();
    var canvas = document.getElementById("editing-canvas");
    image.load(demoPath, imageLoaded);

    function imageLoaded() {
        canvas = document.createElement('canvas');
        canvas.id = "editing-canvas";
        var container = document.getElementById("editing-container");

        var width = image.getWidth();
        var factor = width / 80;
        canvas.width = width;
        canvas.height = image.getHeight();
        
        image.draw(canvas);
        container.appendChild(canvas);
    }

    texLoader.load(demoPath, function(t) {
        var material = new THREE.MeshPhysicalMaterial({
            map:t, 
            side: THREE.DoubleSide,
            transparent: true,
            clearcoat:0.});
        
        var geometry = new THREE.PlaneGeometry(t.image.naturalWidth, t.image.naturalHeight, 4 );
    plane = new THREE.Mesh( geometry, material );
    scene.add( plane );
    });



    var animate = function () {
        requestAnimationFrame( animate );

        if (plane) plane.rotation.y += 0.007;
        // cube.rotation.y += 0.01;
        
        camera.lookAt( scene.position );
        renderer.render( scene, camera );
    };

    function loadTexture(path) {
        console.log(path);

    }
    $("#file-picker").on("change", function() {
        loadTexture(document.getElementById("file-picker").files[0].name); 
        
        });



        window.addEventListener( 'resize', onWindowResize, false );
    animate();

    function onWindowResize() {

        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        // effect.setSize( window.innerWidth, window.innerHeight );

    }