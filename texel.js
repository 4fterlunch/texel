let $ = require("jquery");

const demoBaseColour = "demo/mossy_bark/Mossy_bark_02_2K_Base_Color.png";
const demoHeightMap = "demo/mossy_bark/Mossy_bark_02_2K_Height.png";
const demoNormalMap = "demo/mossy_bark/Mossy_bark_02_2K_Normal.png";
const demoRoughnessMap = "demo/mossy_bark/Mossy_bark_02_2K_Roughness.png";

function TexelImage() {
    this.name = name;
    this.filePath = "";
    this.marvinImage = new MarvinImage();
    this.set = function(name, filePath) {
        this.name = name;
        this.filePath = this.filePath;
    }
    this.drawTo = function(canvasElement) {
        this.marvinImage.load(this.filePath, imageLoaded);
    }
    
}

function TexelProject(name="") {
    this.name = name;
    this.colourMap = new MarvinImage();
    this.heightMap = new MarvinImage();
    this.normalMap = new MarvinImage();
    this.clearcoatMap = new MarvinImage();
    this.roughnessMap = new MarvinImage();
    this.alphaMap = new MarvinImage();

    this.settings = {
        scene: {
            ambientLight:null,
            spotlight: null,
            camera: null,
        },
        preview: {
            transparency: true,
            opacity: 1.0,
            alphaTest: 0.0,
            clearcoat: 0.0,
            roughness: 0.0,
        }
    }
}

let colourMap = new MarvinImage();
let heightMap = new MarvinImage();
let normalMap = new MarvinImage();
let clearcoatMap = new MarvinImage();
let roughnessMap = new MarvinImage();
let alphaMap = new MarvinImage();


var Texel = {
        scene: new THREE.Scene(),
        camera: new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 ),
        renderer : new THREE.WebGLRenderer(),
        project: null,
        container:null,
        plane:null,
        controls:null,
        loadProject: function(project=new TexelProject("demo")) {
            this.scene.background = new THREE.Color( 0x222222 );
            this.project = project;
            this.project.settings.scene.ambientLight = new THREE.AmbientLight( 0x222222 ,7);
            this.project.settings.scene.camera = this.camera;
            this.scene.add(this.project.settings.scene.ambientLight);

            var spot1 = new THREE.SpotLight( 0xffffff, 1 );
            spot1.position.set( 300, 1000, 500 );
            spot1.angle = 0.90;
            spot1.penumbra = 0.75;
            spot1.intensity = 1.2;
            spot1.decay = 4;
            spot1.castShadow = true;
            spot1.shadow.bias = 0.0001;
            spot1.shadow.mapSize.width = 2048;
            spot1.shadow.mapSize.height = 2048;
            this.project.settings.scene.spotlight = spot1;
            this.scene.add(this.project.settings.scene.spotlight);

            

            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.container = document.getElementById("texel-container");
            
            this.container.appendChild(this.renderer.domElement);

            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.camera.position.z = 2000;

        }
    }


Texel.loadProject();

//set up 3d textures
var textureLoader = new THREE.TextureLoader();
function refreshPlaneTextures() {
    var colMap, alphaMap, heightMap, ccMap, roughnessMap, normalMap;

    textureLoader.load(demoHeightMap, function(hm) {
        textureLoader.load(demoNormalMap, function(nm) {
            textureLoader.load(demoRoughnessMap, function(rm) {
                textureLoader.load(demoBaseColour, function(bcm) {
                    var material = new THREE.MeshPhysicalMaterial({
                        map:bcm, 
                        side: THREE.DoubleSide,
                        transparent: true,
                        bumpMap: hm,
                        
                        normalMap: nm,
                        clearcoatRoughnessMap:rm
                    });
                    
                    var geometry = new THREE.PlaneGeometry(bcm.image.naturalWidth, bcm.image.naturalHeight, 4 );
                    Texel.plane = new THREE.Mesh( geometry, material );
                    Texel.scene.add( Texel.plane );
            }); 
        });
    });
        
       
    });
}



refreshPlaneTextures();
    

    //img editor
    var image = new MarvinImage();
    var canvas = document.getElementById("editing-canvas");
    image.load(demoBaseColour, imageLoaded);



    function imageLoaded() {
        canvas = document.createElement('canvas');
        canvas.id = "editing-canvas";
        var container = document.getElementById("editing-container");
        console.log(image);
        container.addEventListener('click', function(ev) {
            console.log(ev);
            var ctx = canvas.getContext("2d");
            console.log(ctx);
            image.draw(canvas);
        });

        var width = image.getWidth();
        var factor = width / 80;
        canvas.width = width;
        canvas.height = image.getHeight();
        
        image.draw(canvas);
        container.appendChild(canvas);
        
        

    }

    // var alphaMap = new MarvinImage();


    



    var animate = function () {
        requestAnimationFrame( animate );

        if (Texel.plane)  Texel.plane.rotation.y += 0.007;
        
        
        //Texel.camera.lookAt( Texel.scene.position );
        Texel.renderer.render( Texel.scene, Texel.camera );
    };








       // window.addEventListener( 'resize', onWindowResize, false );
    animate();

    // function onWindowResize() {

    //     var windowHalfX = window.innerWidth / 2;
    //     var windowHalfY = window.innerHeight / 2;

    //     camera.aspect = window.innerWidth / window.innerHeight;
    //     camera.updateProjectionMatrix();

    //     // effect.setSize( window.innerWidth, window.innerHeight );

    // }


function setColourMap() {

}