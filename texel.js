const { data } = require("jquery");
let $ = require("jquery");

const demoBaseColour = "demo/mossy_bark/Mossy_bark_02_2K_Base_Color.png";
const demoHeightMap = "demo/mossy_bark/Mossy_bark_02_2K_Height.png";
const demoNormalMap = "demo/mossy_bark/Mossy_bark_02_2K_Normal.png";
const demoRoughnessMap = "demo/mossy_bark/Mossy_bark_02_2K_Roughness.png";

var colMapTex, alphaMapTex, heightMapTex, ccMapTex, roughnessMapTex, normalMapTex;

var editGui = new dat.GUI( { autoPlace: false } );
var editLayers = editGui.addFolder('Texture Layers');



var viewGui = new dat.GUI({ autoPlace: false } );
var viewToggleLayers = viewGui.addFolder('Toggle Layers');
var viewLighting = viewGui.addFolder('Lighting');
var viewLightingSpot = viewLighting.addFolder('Spot');
var viewLightingAmbient = viewLighting.addFolder('Ambient');

var viewMaterial = viewGui.addFolder('Material');

var editGuiDom = document.getElementById('edit-gui');
editGuiDom.appendChild(editGui.domElement);

var viewGuiDom = document.getElementById('view-gui');
viewGuiDom.appendChild(viewGui.domElement);

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
let spot1;

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
            this.project.settings.scene.ambientLight = new THREE.AmbientLight( 0x222222 ,0.7);
            this.project.settings.scene.camera = this.camera;
            this.scene.add(this.project.settings.scene.ambientLight);

            spot1 = new THREE.SpotLight( 0xffffff, 1 );
            spot1.position.set( 300, 1000, 500 );
            spot1.angle = 0.63;
            spot1.penumbra = 0.93;
            spot1.intensity = 1.5;
            spot1.decay = 4.8;
            spot1.castShadow = true;
            spot1.shadow.bias = 0.0001;
            spot1.shadow.mapSize.width = 2048;
            spot1.shadow.mapSize.height = 2048;
            this.project.settings.scene.spotlight = spot1;
            this.scene.add(this.project.settings.scene.spotlight);

            //gui
            viewLightingSpot.add(spot1,'penumbra',0,1);
            viewLightingSpot.add(spot1,'angle',0,1);
            viewLightingSpot.add(spot1,'intensity',0,10);
            viewLightingSpot.add(spot1,'decay',0,10);

            viewLightingAmbient.add(this.project.settings.scene.ambientLight,'intensity',0,20);
            

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
    

    textureLoader.load(demoHeightMap, function(hm) {
        heightMapTex = hm;
        textureLoader.load(demoNormalMap, function(nm) {
            normalMapTex = nm;
            textureLoader.load(demoRoughnessMap, function(rm) {
                roughnessMapTex = rm;
                textureLoader.load(demoBaseColour, function(bcm) {
                    colMapTex = bcm;
                    var material = new THREE.MeshPhysicalMaterial({
                        map:bcm, 
                        side: THREE.DoubleSide,
                        transparent: true,
                        bumpMap: hm,
                        
                        normalMap: nm,
                        clearcoatRoughnessMap:rm,
                        roughness:0.5,
                    });
                    
                    //gui
                    
                    viewMaterial.add(material,'roughness',0,1);
                    viewMaterial.add(material, 'metalness',0,1);
                    viewMaterial.add(material,'reflectivity',0,1);
                    viewMaterial.add(material,'clearcoat',0,1);
                    viewMaterial.add(material,'clearcoatRoughness',0,1);
                    viewMaterial.add(material,'alphaTest', 0, 1);
                    viewMaterial.add(material,'transparent');

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
    //var image = new Image();
    var imageOut;
    var canvas = document.getElementById("editing-canvas");



    // function imageLoaded() {
    //     canvas = document.createElement('canvas');
    //     canvas.id = "editing-canvas";
    //     var container = document.getElementById("editing-container");
    //     //console.log(image);
    //     // container.addEventListener('click', function(ev) {
    //     //     setImageScale(1500);
    //     // });

    //     var width = image.getWidth();
    //     var factor = width / 80;
    //     canvas.width = width;
    //     canvas.height = image.getHeight();
        
    //     image.draw(canvas);
    //     container.appendChild(canvas);
        
        

    // }

    // var alphaMap = new MarvinImage();


var spotArc = {
 xArc : 1347,
 yArc : 988,
 zArc : 359};

viewLightingSpot.add(spotArc,'xArc',0,2000);
viewLightingSpot.add(spotArc,'yArc',0,2000);
viewLightingSpot.add(spotArc,'zArc',0,2000);


    var animate = function () {
        requestAnimationFrame( animate );
        var time = Date.now() * 0.0005;
        //if (Texel.plane)  Texel.plane.rotation.y += 0.007;
        if (spot1) {
            spot1.position.x = Math.sin( time * 1 ) * spotArc.xArc;
			spot1.position.y = Math.cos( time * 1 ) * spotArc.yArc;
			spot1.position.z = Math.cos( time * 1 ) * spotArc.zArc;
        } 
        
        spot1.lookAt( Texel.scene.position );
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


function setImageScale(scale) {
    imageOut = image.clone();
    Marvin.scale(image, imageOut,scale);
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.translate(10,0);
    
    imageOut.draw(canvas);

}









//source: https://codepen.io/techslides/pen/zowLd


var canvas = document.getElementById('editing-canvas');
canvas.width = 800;
canvas.height = 600;

var image = new Image;

window.onload = function () {

    var ctx = canvas.getContext('2d');
    trackTransforms(ctx);

    function redraw() {

        // Clear the entire canvas
        var p1 = ctx.transformedPoint(0, 0);
        var p2 = ctx.transformedPoint(canvas.width, canvas.height);
        ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        ctx.drawImage( image, 0, 0);

    }
    redraw();

    var lastX = canvas.width / 2, lastY = canvas.height / 2;

    var dragStart, dragged;

    canvas.addEventListener('mousedown', function (evt) {
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragStart = ctx.transformedPoint(lastX, lastY);
        dragged = false;
    }, false);

    canvas.addEventListener('mousemove', function (evt) {
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragged = true;
        if (dragStart) {
            var pt = ctx.transformedPoint(lastX, lastY);
            ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
            redraw();
        }
    }, false);

    canvas.addEventListener('mouseup', function (evt) {
        dragStart = null;
        if (!dragged) zoom(evt.shiftKey ? -1 : 1);
    }, false);

    var scaleFactor = 1.1;

    var zoom = function (clicks) {
        var pt = ctx.transformedPoint(lastX, lastY);
        ctx.translate(pt.x, pt.y);
        var factor = Math.pow(scaleFactor, clicks);
        ctx.scale(factor, factor);
        ctx.translate(-pt.x, -pt.y);
        redraw();
    }

    var handleScroll = function (evt) {
        var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
        if (delta) zoom(delta);
        return evt.preventDefault() && false;
    };

    canvas.addEventListener('DOMMouseScroll', handleScroll, false);
    canvas.addEventListener('mousewheel', handleScroll, false);
};

image.src = demoBaseColour; //'http://phrogz.net/tmp/gkhead.jpg';

// Adds ctx.getTransform() - returns an SVGMatrix
// Adds ctx.transformedPoint(x,y) - returns an SVGPoint
function trackTransforms(ctx) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    var xform = svg.createSVGMatrix();
    ctx.getTransform = function () { return xform; };

    var savedTransforms = [];
    var save = ctx.save;
    ctx.save = function () {
        savedTransforms.push(xform.translate(0, 0));
        return save.call(ctx);
    };

    var restore = ctx.restore;
    ctx.restore = function () {
        xform = savedTransforms.pop();
        return restore.call(ctx);
    };

    var scale = ctx.scale;
    ctx.scale = function (sx, sy) {
        xform = xform.scaleNonUniform(sx, sy);
        return scale.call(ctx, sx, sy);
    };

    var rotate = ctx.rotate;
    ctx.rotate = function (radians) {
        xform = xform.rotate(radians * 180 / Math.PI);
        return rotate.call(ctx, radians);
    };

    var translate = ctx.translate;
    ctx.translate = function (dx, dy) {
        xform = xform.translate(dx, dy);
        return translate.call(ctx, dx, dy);
    };

    var transform = ctx.transform;
    ctx.transform = function (a, b, c, d, e, f) {
        var m2 = svg.createSVGMatrix();
        m2.a = a; m2.b = b; m2.c = c; m2.d = d; m2.e = e; m2.f = f;
        xform = xform.multiply(m2);
        return transform.call(ctx, a, b, c, d, e, f);
    };

    var setTransform = ctx.setTransform;
    ctx.setTransform = function (a, b, c, d, e, f) {
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx, a, b, c, d, e, f);
    };

    var pt = svg.createSVGPoint();
    ctx.transformedPoint = function (x, y) {
        pt.x = x; pt.y = y;
        return pt.matrixTransform(xform.inverse());
    }
}
