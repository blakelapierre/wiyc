// directives/canvas-threejs.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';

function PulsarCanvasThreejsDirective ( ) {
  return {
    templateUrl: 'views/directives/canvas-threejs.html',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {

      scope.options = {
        'class': attrs.canvasClass || 'canvas-threejs',
        'width': attrs.canvasWidth || 1280,
        'height': attrs.canvasHeight || 720
      };

      function createScene ( ) {
        var cubeGeometry = new THREE.CubeGeometry(1.0, 1.0, 1.0);

        scope.light = new THREE.DirectionalLight(0xffffff, 0.5);
        scope.light.target.position.set(0,0,0);
        scope.light.position.set(1,1,1);
        scope.scene.add(scope.light);

        scope.anchor = new THREE.Object3D();
        scope.scene.add(scope.anchor);

        scope.materialSpec = new THREE.MeshBasicMaterial({ 'color': 0xe8e8e8 });
        scope.materialBass = new THREE.MeshBasicMaterial({ 'color': 0x6f0000 });
        scope.materialMids = new THREE.MeshBasicMaterial({ 'color': 0x00ff00 });
        scope.materialTreb = new THREE.MeshBasicMaterial({ 'color': 0x0000ff });

//         var loader = new THREE.ObjectLoader();
//         loader.load('assets/frigate/space_frigate_6.json', function (frigate) {
//           scope.frigate = frigate;
//           scope.frigate.set
//           scope.anchor.add(scope.frigate);
//         });

        scope.cubeSpec = new THREE.Mesh(cubeGeometry, scope.materialSpec);
        scope.anchor.add(scope.cubeSpec);

        scope.cubeBass1 = new THREE.Mesh(cubeGeometry, scope.materialBass);
        scope.cubeBass1.position.x = -2.0;
        scope.anchor.add(scope.cubeBass1);
        scope.cubeBass2 = new THREE.Mesh(cubeGeometry, scope.materialBass);
        scope.cubeBass2.position.x = 2.0;
        scope.anchor.add(scope.cubeBass2);

        scope.cubeMids1 = new THREE.Mesh(cubeGeometry, scope.materialMids);
        scope.cubeMids1.position.y = -2.0;
        scope.anchor.add(scope.cubeMids1);
        scope.cubeMids2 = new THREE.Mesh(cubeGeometry, scope.materialMids);
        scope.cubeMids2.position.y = 2.0;
        scope.anchor.add(scope.cubeMids2);

        scope.cubeTreb1 = new THREE.Mesh(cubeGeometry, scope.materialTreb);
        scope.cubeTreb1.position.z = -2.0;
        scope.anchor.add(scope.cubeTreb1);
        scope.cubeTreb2 = new THREE.Mesh(cubeGeometry, scope.materialTreb);
        scope.cubeTreb2.position.z = 2.0;
        scope.anchor.add(scope.cubeTreb2);

        scope.camera.position.z = 4;
        console.log('THREEjs SCENE', scope.scene);

      }

      scope.$watch('isFullscreen', function ( ) {
        if (!scope.isFullscreen || scope.scene) {
          element.empty();
          scope.anchor = null;
          scope.renderer = null;
          scope.camera = null;
          scope.scene = null;
          return;
        }

        scope.scene = new THREE.Scene();

        scope.camera = new THREE.PerspectiveCamera(
          attrs.fov || 75,
          scope.options.width / scope.options.height,
          attrs.minDepth || 0.1,
          attrs.maxDepth || 1000.0
        );

        scope.renderer = new THREE.WebGLRenderer({
          'canvas':element.context.children[0],
          'alpha':true
        });
        scope.renderer.setSize(scope.options.width, scope.options.height);

        scope.renderer.domElement.className = 'pulsar-threejs';
        element.append(scope.renderer.domElement);

        createScene();
      });

      scope.updateVisualizer3d = function (specRatio, bassRatio, midsRatio, trebRatio) {
        if (scope.anchor === null) {
          return;
        }

        scope.anchor.rotation.x += 0.01;
        scope.anchor.rotation.y += 0.015;

        scope.materialSpec.color.setRGB(bassRatio, midsRatio, trebRatio);
        scope.cubeSpec.scale.set(bassRatio * 2.0, midsRatio * 2.0, trebRatio * 2.0);
        if (scope.frigate) {
          scope.frigate.scale.set(bassRatio * 0.2, midsRatio * 0.2, trebRatio * 0.2);
          scope.frigate.scale.set(0.2, 0.2, 0.2);
        }

        scope.materialBass.color.setRGB(bassRatio, 0, 0);
        scope.cubeBass1.scale.set(bassRatio,bassRatio,bassRatio);
        scope.cubeBass2.scale.set(bassRatio,bassRatio,bassRatio);

        scope.materialMids.color.setRGB(0, midsRatio, 0);
        scope.cubeMids1.scale.set(midsRatio,midsRatio,midsRatio);
        scope.cubeMids2.scale.set(midsRatio,midsRatio,midsRatio);

        scope.materialTreb.color.setRGB(0, 0, trebRatio);
        scope.cubeTreb1.scale.set(trebRatio,trebRatio,trebRatio);
        scope.cubeTreb2.scale.set(trebRatio,trebRatio,trebRatio);

        scope.renderer.render(scope.scene, scope.camera);
      };
    }
  };
}

PulsarCanvasThreejsDirective.$inject = [

];

angular.module('pulsarClientApp')
.directive('pulsarCanvasThreejs', PulsarCanvasThreejsDirective);
