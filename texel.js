
// const { data } = require("jquery");
// let $ = require("jquery");
// const THREE = require('three');


var Uid = (function() {
    let id = 0
    return {
        next: function() {
            return id++;
        }
    }
})();

const MAP = {
    "None":                 0, 
    "Ambient Occlusion":    "aoMap",
    "Alpha":                "alphaMap",
    "Bump":                 "bumpMap", 
    "Normal":               "normalMap", 
    "Roughness":            "roughnessMap", 
    "Emissive":             "emissiveMap",
    "Clearcoat":            "clearcoatMap", 
    "Clearcoat Roughness":  "clearcoatRoughnessMap",
    "Metalness":            "metalnessMap",
    "Displacement":         "displacementMap",
    "Transmission":         "transmissionMap",
    "Base Colour":          "map"
};






function TexelImage({name=null, url= "", map=MAP["None"],active=true}) {
    this.uid = Uid.next();
    this.imageLayer = null;
    var tempname = url.split('/');
    this.name = name || tempname[tempname.length-1] || this.uid;
    this.url
    this.url = url;
    this._unsetMap = map;
    this.map = map;
    this.active = active;
    this.opacity = 1;
    
}


const demoBaseColour = "demo/mossy_bark/Mossy_bark_02_2K_Base_Color.png";
const demoHeightMap = "demo/mossy_bark/Mossy_bark_02_2K_Height.png";
const demoNormalMap = "demo/mossy_bark/Mossy_bark_02_2K_Normal.png";
const demoRoughnessMap = "demo/mossy_bark/Mossy_bark_02_2K_Roughness.png";

var texelState = (function(){
    var editor = (function() {
        var extent = [0, 0, 1024, 968];
        var projection = new ol.proj.Projection({
        code: 'xkcd-image',
        units: 'pixels',
        extent: extent,
        });

        var map = new ol.Map({
            layers: [],
            target: 'map',
            view: new ol.View({
            projection: projection,
            center: ol.extent.getCenter(extent),
            zoom: 2,
            maxZoom: 8,
            }),
        });

        var addImageLayer = function(texelImage=new TexelImage()) {
            var l = new ol.layer.Image({
                source: new ol.source.ImageStatic({
                url: texelImage.url,
                projection: projection,
                imageExtent: extent,
                })
            });
            texelImage.imageLayer = l;
            map.addLayer(texelImage.imageLayer);

            var l = GUI.layers.addFolder(texelImage.name);
                l.add(texelImage,'name');
                l.add(texelImage, 'map',MAP).onChange(function(value) {
                    viewer.setTexture(texelImage);
                    console.log ("set tex to: ", value);
                });
                l.add(texelImage,'active').onChange(function(value) {
                    texelImage.imageLayer.setVisible(value);
                });
                l.add(texelImage, 'opacity',0,1).onChange(function(value) {
                    texelImage.imageLayer.setOpacity(value);
                });
                
                
                viewer.setTexture(texelImage);
        }

        

        var GUI = (function() {
            var root = new dat.GUI( { autoPlace: false } );
            var layers = root.addFolder('Texture Layers');
            var editGuiDom = document.getElementById('edit-gui');
            editGuiDom.appendChild(root.domElement);
            return {
                layers:layers,
                domElement: root.domElement
            }
        })();


        return {
            addImageLayer: addImageLayer,
            gui:GUI
        }
    })();

    var viewer = (function() {
        var GUI = (function() {
            var viewGui = new dat.GUI({ autoPlace: false } );
            var viewLighting = viewGui.addFolder('Lighting');
            var viewLightingSpot = viewLighting.addFolder('Spot');
            var viewLightingAmbient = viewLighting.addFolder('Ambient');
            var viewLightingDirectional = viewLighting.addFolder('Directional');
            
            var viewMaterial = viewGui.addFolder('Material');
        
            
            var viewGuiDom = document.getElementById('view-gui');
            viewGuiDom.appendChild(viewGui.domElement);
            return {
                viewLightingSpot:viewLightingSpot,
                viewMaterial:viewMaterial,
                viewLightingAmbient:viewLightingAmbient,
                viewLightingDirectional:viewLightingDirectional
            }
        })();

        var spotArc = {
            xArc : 1347,
            yArc : 988,
            zArc : 359};
        

        

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
        var renderer  = new THREE.WebGLRenderer();
        var container = document.getElementById("texel-container");
        var plane =null;
        var control =null;
        var ambientLight = new THREE.AmbientLight( 0x222222 ,0);
        var directionalLight = new THREE.SpotLight( 0xffffff, 1.2)
        var spotlight =  new THREE.SpotLight( 0xffffff, 1 );

        var textureLoader = new THREE.TextureLoader();
        var material = new THREE.MeshPhysicalMaterial({
            side: THREE.SingleSide
        });
        var geometry = new THREE.PlaneGeometry(2000,2000, 4 );
        plane = new THREE.Mesh( geometry, material );
        scene.add(plane );

        var setBackgroundColour = (hex) => {
            scene.background = new THREE.Color( hex );
        }
        var setTexture = function(texelImage=new TexelImage) {
            textureLoader.load(texelImage.url, function(tex) {
                material[texelImage._unsetMap] = null;
                material[texelImage.map] = tex;
                material.needsUpdate = true;

                texelImage._unsetMap = texelImage.map;
            })
        }

        //default setup
        container.appendChild(renderer.domElement);

        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        spotlight.position.set( 300, 1000, 1000 );
        spotlight.angle = 1;
        spotlight.penumbra = 1;
        spotlight.intensity = 1.1;
        spotlight.decay = 4.8;
        spotlight.castShadow = true;
        spotlight.shadow.bias = 0.0001;
        spotlight.shadow.mapSize.width = 2048;
        spotlight.shadow.mapSize.height = 2048;

        directionalLight.position.set( 300, 1000, 1000   );
        directionalLight.angle = 1.1;
        directionalLight.penumbra = 1;
        directionalLight.intensity = 1.2;
        directionalLight.decay = 4.8;
        directionalLight.castShadow = true;
        directionalLight.shadow.bias = 0.0001;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;

        control = new THREE.OrbitControls(camera, renderer.domElement);
        camera.position.z = 2000;

        scene.add(ambientLight);
        scene.add(spotlight);
        scene.add(directionalLight);

        setBackgroundColour(0x111);
            

        //gui
        GUI.viewLightingSpot.add(spotlight,'penumbra',0,1);
        GUI.viewLightingSpot.add(spotlight,'angle',0,1);
        GUI.viewLightingSpot.add(spotlight,'intensity',0,10);
        GUI.viewLightingSpot.add(spotlight,'decay',0,10);
        GUI.viewLightingSpot.add(spotArc,'xArc',0,2000);
        GUI.viewLightingSpot.add(spotArc,'yArc',0,2000);
        GUI.viewLightingSpot.add(spotArc,'zArc',0,2000);

        GUI.viewLightingAmbient.add(ambientLight,'intensity',0,20);

        GUI.viewLightingDirectional.add(directionalLight,'penumbra',0,1);
        GUI.viewLightingDirectional.add(directionalLight,'angle',0,1.3);
        GUI.viewLightingDirectional.add(directionalLight,'intensity',0,10);
        GUI.viewLightingDirectional.add(directionalLight,'decay',0,10);

        //gui
        
        GUI.viewMaterial.add(material,'roughness',0,1);
        GUI.viewMaterial.add(material, 'metalness',0,1);
        GUI.viewMaterial.add(material,'reflectivity',0,1);
        GUI.viewMaterial.add(material,'clearcoat',0,1);
        GUI.viewMaterial.add(material,'clearcoatRoughness',0,1);
        GUI.viewMaterial.add(material,'alphaTest', 0, 1);
        GUI.viewMaterial.add(material,'transparent');
        GUI.viewMaterial.add(material,'displacementScale',0,5);

        
        
        var animate = function () {
            requestAnimationFrame( animate );
            var time = Date.now() * 0.0005;
            //if (Texel.plane)  Texel.plane.rotation.y += 0.007;
            
            spotlight.position.x = Math.sin( time * 1 ) * spotArc.xArc;
            spotlight.position.y = Math.cos( time * 1 ) * spotArc.yArc;
            spotlight.position.z = Math.cos( time * 1 ) * spotArc.zArc;
            
            
            camera.lookAt( scene.position );
            renderer.render( scene, camera );
        };

        animate();
        
        return {
            setBackgroundColour:setBackgroundColour,
            setTexture:setTexture,
            gui:GUI
        }
    })();

    return {
        editor:editor,
        viewer:viewer
    }

})();

texelState.editor.addImageLayer(new TexelImage({url:demoBaseColour}));
texelState.editor.addImageLayer(new TexelImage({url: demoHeightMap}));
texelState.editor.addImageLayer(new TexelImage({url: demoNormalMap}));
texelState.editor.addImageLayer(new TexelImage({url: demoRoughnessMap}));
// texelState.editor.imageCollection.push(new TexelImage({url:demoBaseColour}));
// texelState.editor.imageCollection.push(new TexelImage({url: demoHeightMap}));
// texelState.editor.imageCollection.push(new TexelImage({url: demoNormalMap}));
// texelState.editor.imageCollection.push(new TexelImage({url:demoRoughnessMap}));
