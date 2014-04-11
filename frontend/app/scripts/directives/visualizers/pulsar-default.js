// directives/visualizers/pulsar-default.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT
//
// This was a brute-force, high-speed learning exercise in bolting Three.js to
// AngularJS. I did consider a few existing solutions, but they just weren't
// simple enough and were genuinely trying to *be* Three.js in my opinion.
// That is unnecessary, and will be more evident when I refactor this into the
// Pulsar Plugin API.

'use strict';

function PulsarCanvasThreejsDirective ( ) {
  return {
    templateUrl: 'views/directives/visualizers/pulsar-default.html',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {

      var DEG2RAD = Math.PI / 180;

      scope.options = {
        'class': attrs.canvasClass || 'visualizer-pulsar-default',
        'width': attrs.canvasWidth || 1280,
        'height': attrs.canvasHeight || 720
      };

      function createScene ( ) {
        var cubeGeometry = new THREE.CubeGeometry(1.0, 1.0, 1.0);
        var sphereGeometry = new THREE.SphereGeometry(1.0, 32, 32);
        var cylinderGeometry = new THREE.CylinderGeometry(0, 0.25, 20, 32);

        /*
         * Offset every vertex.y by half the height to have the base be the
         * center point.
         */
        cylinderGeometry.vertices.forEach(function (vertex) {
          vertex.y += 10.0;
        });

        scope.pulsarTextGeometry = new THREE.TextGeometry('PULSAR', {
          'font': 'optimer',
          'size': 15.0,
          'weight': 'normal',
          'height': 5,
          'bevelEnabled': true,
          'bevelThickness': 0.1,
          'bevelSize': 0.1
        });
        scope.pulsarTextGeometry.computeBoundingBox();
        scope.pulsarTextGeometry.textWidth = scope.pulsarTextGeometry.boundingBox.max.x - scope.pulsarTextGeometry.boundingBox.min.x;
        scope.pulsarTextGeometry.textHeight = scope.pulsarTextGeometry.boundingBox.max.y - scope.pulsarTextGeometry.boundingBox.min.y;
        scope.pulsarTextGeometry.textDepth = scope.pulsarTextGeometry.boundingBox.max.z - scope.pulsarTextGeometry.boundingBox.min.z;

        var pulsarCoreTexture = THREE.ImageUtils.loadTexture(
          "assets/visualizers/music-molecule/pulsar-core.png"
        );
        var pulsarOuterLayerTexture = THREE.ImageUtils.loadTexture(
          "assets/visualizers/music-molecule/pulsar-outer-layer.png"
        );
        var pulsarTextTexture = THREE.ImageUtils.loadTexture(
          "assets/visualizers/music-molecule/angular-surface.jpg"
        );

        scope.pulsarCoreMaterial = new THREE.MeshPhongMaterial({
          'ambient': 0x030303,
          'color': 0x000000,
          'specular': 0,
          'shininess': 0,
          'side': THREE.DoubleSide,
          'shading': THREE.SmoothShading,
          'map': pulsarCoreTexture,
          'bumpMap': pulsarCoreTexture,
        });

        scope.pulsarOuterLayerMaterial = new THREE.MeshPhongMaterial({
          'ambient': 0x030303,
          'color': 0,
          'specular': 0,
          'shininess': 0,
          'map': pulsarOuterLayerTexture,
          'bumpMap': pulsarOuterLayerTexture,
          'transparent': true,
          'opacity':0.50,
          'side': THREE.DoubleSide
        });

        scope.pulsarTextMaterial = new THREE.MeshPhongMaterial({
          'ambient': 0x0303ff,
          'color': 0xe8e8ff,
          'specular': 0x303060,
          'shininess': 50,
          //'bumpMap': pulsarTextTexture,
          'side': THREE.DoubleSide,
          'shading': THREE.SmoothShading
        });

        scope.materialBass = new THREE.MeshLambertMaterial({ 'color':0xffffff, 'transparent':true, 'opacity':0.8 });
        scope.materialMids = new THREE.MeshLambertMaterial({ 'color':0xffffff, 'transparent':true, 'opacity':0.8 });
        scope.materialTreb = new THREE.MeshLambertMaterial({ 'color':0xffffff, 'transparent':true, 'opacity':0.8 });

//         scope.globalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//         scope.globalLight.target.position.set(0,0,0);
//         scope.globalLight.position.set(10,10,10);
//         scope.scene.add(scope.globalLight);

        scope.pulsarText = new THREE.Mesh(scope.pulsarTextGeometry, scope.pulsarTextMaterial);
        scope.scene.add(scope.pulsarText);

        /*
         * The Pulsar Starlight Thingamabob
         */

        scope.pulsarArmature = new THREE.Object3D();
        scope.scene.add(scope.pulsarArmature);

        scope.pulsar = new THREE.Object3D();
        scope.pulsar.name = 'Pulsar';
        scope.pulsar.position.set(12,12,-12);
        scope.pulsarArmature.add(scope.pulsar);

        scope.pulsarLight = new THREE.PointLight(0xffffff);
        scope.pulsar.add(scope.pulsarLight);

        scope.pulsarCoreMount = new THREE.Object3D();
        scope.pulsarCoreMount.name = 'PulsarCoreMount';
        scope.pulsar.add(scope.pulsarCoreMount);

//         var loader = new THREE.ObjectLoader();
//         loader.load('assets/frigate/space_frigate_6.json', function (frigate) {
//           scope.frigate = frigate;
//           scope.frigate.set
//           scope.anchor.add(scope.frigate);
//         });

        scope.pulsarCore = new THREE.Mesh(sphereGeometry, scope.pulsarCoreMaterial);
        scope.pulsarCore.name = 'PulsarCore';
        scope.pulsarCore.scale.set(0.8, 0.8, 0.8);
        scope.pulsarCoreMount.add(scope.pulsarCore);

        scope.pulsarOuterLayer = new THREE.Mesh(sphereGeometry, scope.pulsarOuterLayerMaterial);
        scope.pulsarOuterLayer.name = 'PulsarOuterLayer';
        scope.pulsarCore.scale.set(1.0, 1.0, 1.0);
        scope.pulsar.add(scope.pulsarOuterLayer);

        scope.rayBass1 = new THREE.Mesh(cylinderGeometry, scope.materialBass);
        scope.rayBass1.name = 'cubeBass1';
        scope.rayBass1.rotation.z = 90 * DEG2RAD;
        scope.pulsarCoreMount.add(scope.rayBass1);
        scope.rayBass2 = new THREE.Mesh(cylinderGeometry, scope.materialBass);
        scope.rayBass2.name = 'cubeBass2';
        scope.rayBass2.rotation.z = -90 * DEG2RAD;
        scope.pulsarCoreMount.add(scope.rayBass2);

        scope.rayMids1 = new THREE.Mesh(cylinderGeometry, scope.materialMids);
        scope.rayMids1.name = 'cubeMids1';
        scope.rayMids1.rotation.x = 90 * DEG2RAD;
        scope.pulsarCoreMount.add(scope.rayMids1);
        scope.rayMids2 = new THREE.Mesh(cylinderGeometry, scope.materialMids);
        scope.rayMids2.name = 'cubeMids2';
        scope.rayMids2.rotation.x = -90 * DEG2RAD;
        scope.pulsarCoreMount.add(scope.rayMids2);

        scope.rayTreb1 = new THREE.Mesh(cylinderGeometry, scope.materialTreb);
        scope.rayTreb1.name = 'cubeTreb1';
        scope.pulsarCoreMount.add(scope.rayTreb1);
        scope.rayTreb2 = new THREE.Mesh(cylinderGeometry, scope.materialTreb);
        scope.rayTreb2.name = 'cubeTreb2';
        scope.rayTreb2.rotation.x = 180 * DEG2RAD;
        scope.pulsarCoreMount.add(scope.rayTreb2);
      }

      var posZ = 0;
      scope.updateVisualizer3d = function (specRatio, bassRatio, midsRatio, trebRatio) {
        if (scope.pulsar === null) {
          return;
        }

        scope.camera.position.y = -6;
        scope.camera.position.z = 35;

        scope.pulsarArmature.rotation.x -= 0.02 * bassRatio;
        scope.pulsarArmature.rotation.y += 0.02 * midsRatio;
        scope.pulsarArmature.rotation.z += 0.02 * trebRatio;

        scope.pulsarCoreMount.rotation.x += 0.02 * bassRatio;
        scope.pulsarCoreMount.rotation.y -= 0.02 * midsRatio;
        scope.pulsarCoreMount.rotation.z -= 0.02 * trebRatio;

        scope.pulsarLight.color.setRGB(bassRatio, midsRatio, trebRatio);
        scope.pulsarLight.intensity = 1.0;
        scope.pulsarLight.distance = 0;//100.0 * specRatio;

        scope.pulsarCoreMaterial.emissive.setRGB(bassRatio, midsRatio, trebRatio);
        scope.pulsarCore.scale.set(
          0.97 + bassRatio,
          0.97 + midsRatio,
          0.97 + trebRatio
        );

        scope.pulsarText.position.set(
          scope.pulsarTextGeometry.textWidth / -2,
          (scope.pulsarTextGeometry.textHeight / -2),
          0
        );
        scope.pulsarText.rotation.x = 0.1;

        scope.pulsarOuterLayer.rotation.x += 0.03 * bassRatio;
        scope.pulsarOuterLayer.rotation.y -= 0.03 * midsRatio;
        scope.pulsarOuterLayer.rotation.z -= 0.03 * trebRatio;

        //var outerCoreScale = 1.0 + ;
        var outerCoreScale = 1.0 + Math.max(bassRatio, Math.max(midsRatio, trebRatio));
        scope.pulsarOuterLayer.scale.set(outerCoreScale, outerCoreScale, outerCoreScale);

        scope.materialBass.emissive.setRGB(bassRatio, 0, 0);
        scope.rayBass1.scale.y = bassRatio;
        scope.rayBass2.scale.y = bassRatio;

        scope.materialMids.emissive.setRGB(0, midsRatio, 0);
        scope.rayMids1.scale.y = midsRatio;
        scope.rayMids2.scale.y = midsRatio;

        scope.materialTreb.emissive.setRGB(0, 0, trebRatio);
        scope.rayTreb1.scale.y = trebRatio;
        scope.rayTreb2.scale.y = trebRatio;

        scope.renderer.render(scope.scene, scope.camera);
      };

      scope.$watch('isFullscreen', function ( ) {
        if (!scope.isFullscreen || scope.scene) {
          element.empty();
          scope.anchor = null;
          scope.renderer = null;
          scope.camera = null;
          scope.scene = null;
          return;
        }

        scope.camera = new THREE.PerspectiveCamera(
          attrs.fov || 75,
          scope.options.width / scope.options.height,
          attrs.minDepth || 0.5,
          attrs.maxDepth || 1000.0
        );

        scope.scene = new THREE.Scene();
        scope.renderer = new THREE.WebGLRenderer({
          'alpha':true
        });
        scope.renderer.setSize(scope.options.width, scope.options.height);
        scope.renderer.domElement.className = 'pulsar-threejs';
        element.append(scope.renderer.domElement);

        createScene();
      });

    }
  };
}

PulsarCanvasThreejsDirective.$inject = [

];

angular.module('pulsarClientApp')
.directive('pulsarCanvasThreejs', PulsarCanvasThreejsDirective);
