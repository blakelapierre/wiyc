// directives/visualisers/pulsar-starlight.js
// Copyright (C) 2014 Rob Colbert <rob.isConnected@gmail.com>
// License: MIT

'use strict';


var DEG2RAD = Math.PI / 180;


/*
 * The Pulsar waveform particle system will create one particle for every
 * "bin" present in an audio analyzer's time domain data. Audio time domain data
 * (waveform, not frequency) is used to set the Y coordinate of a series of
 * vertices arranged in a straight line along the X axis centered about the Y/Z
 * plane.
 */
function PulsarWaveformParticleSystem (options) {

  this.options = {
    'numPoints': options.numPoints || 1024,
    'width': options.width || 1024.0,
    'height': options.height || 40.0,
    'centered': options.centered || false,
    'color': options.color || 0xffffff,
    'sizeAttenuation': options.sizeAttenuation || true,
    'fog': options.fog || false
  };

  var unitsPerParticle = this.options.width / this.options.numPoints;
  var curX = 0.0;
  var idx;

  if (this.options.centered) {
    curX -= (unitsPerParticle * (this.options.numPoints / 2.0));
  }

  var geometry = new THREE.Geometry();
  for (idx = 0; idx < this.options.numPoints; ++idx) {
    geometry.vertices.push(new THREE.Vector3(curX, 0, 0));
    curX += unitsPerParticle;
  }

  var material = new THREE.ParticleSystemMaterial({
    'color': this.options.color,
    'size': unitsPerParticle * 2.0,
    'sizeAttenuation': this.options.sizeAttenuation,
    'vertexColors': false,
    'fog': this.options.fog
  });

  THREE.ParticleSystem.call(this, geometry, material);
  this.sortParticles = false;
}


PulsarWaveformParticleSystem.prototype = Object.create(THREE.ParticleSystem.prototype);


/*
 * Sets the Y value of each vertex in the particle system in order to reflect
 * the data value of each audio sample in the provided analyzer's time domain
 * data.
 */
PulsarWaveformParticleSystem.prototype.update = function (analyser) {
  var idx, value;
  for (idx = this.options.numPoints - 1; idx >= 0; --idx) {
    value = this.options.height * (analyser.timeByteData[idx] / 255.0);
    this.geometry.vertices[idx].y = value - 15.0;
  }
  this.geometry.verticesNeedUpdate = true;
};


/*
 * Creates a particle system that will be used to represent a 3D animated
 * starfield through which the camera can fly. The stars are made of Pulsar
 * logos.
 */
function PulsarStarfieldParticleSystem (options) {
  var idx, x, y, z;

  this.options = {
    'numPoints': options.numPoints || 1024,
    'particleSize': options.particleSize || 2.0,
    'starfieldSize': options.starfieldSize || 1024.0,
    'travelSpeed': options.travelSpeed || 2.0,
    'color': options.color || 0xffffff,
    'sizeAttenuation': options.sizeAttenuation || true,
    'fog': options.fog || false
  };

  var geometry = new THREE.Geometry();
  for (idx = 0; idx < this.options.numPoints; ++idx) {
    x = Math.random() * this.options.starfieldSize / 2.0;
    if (Math.random() > 0.5) {
      x = -x;
    }
    y = Math.random() * this.options.starfieldSize / 2.0;
    if (Math.random() > 0.5) {
      y = -y;
    }
    z = Math.random() * this.options.starfieldSize / 2.0;
    if (Math.random() > 0.5) {
      z = -z;
    }
    geometry.vertices.push(new THREE.Vector3(x, y, z));
  }

  var material = new THREE.ParticleSystemMaterial({
    'color': this.options.color,
    'size': this.options.particleSize,
    'map': THREE.ImageUtils.loadTexture('favicon.ico'),
    'sizeAttenuation': this.options.sizeAttenuation,
    'vertexColors': false,
    'fog': this.options.fog
  });

  this.oldOrientation = new THREE.Vector3(0, 0, 0);
  this.newOrientation = new THREE.Vector3(0, 0, 0);
  this.tweenable = null;

  THREE.ParticleSystem.call(this, geometry, material);
  this.sortParticles = false;
}


PulsarStarfieldParticleSystem.prototype = Object.create(THREE.ParticleSystem.prototype);


PulsarStarfieldParticleSystem.prototype.update = function (/* analysers */) {
  var self = this;
  var idx, halfSize = self.options.starfieldSize / 2.0, direction;

  for (idx = 0; idx < self.options.numPoints; ++idx) {
    self.geometry.vertices[idx].z += self.options.travelSpeed;
    if (self.geometry.vertices[idx].z > halfSize) {
      self.geometry.vertices[idx] = self.createRandomPoint();
      self.geometry.vertices[idx].z = -halfSize;
    }
  }

  if ((self.tweenable === null) && (Math.random() > 0.997)) {
    self.oldOrientation.set(self.newOrientation.x, self.newOrientation.y, self.newOrientation.z);
    self.newOrientation.set(self.getRandomAngle(), self.getRandomAngle(), self.getRandomAngle());
    self.tweenable = new Tweenable();
    self.tweenable.tween({
      'from': { 'x': self.oldOrientation.x, 'y': self.oldOrientation.y, 'z': self.oldOrientation.z },
      'to':   { 'x': self.newOrientation.x, 'y': self.newOrientation.y, 'z': self.newOrientation.z },
      'duration': 5000,
      'easing': 'easeInOutQuad',
      'step': function (state) { self.rotation.set(state.x, state.y, state.z); },
      'finish': function ( ) { self.tweenable = null; }
    });
  }

  self.geometry.verticesNeedUpdate = true;
};


PulsarStarfieldParticleSystem.prototype.createRandomPoint = function ( ) {
  var x, y, z;

  x = Math.random() * this.options.starfieldSize / 2.0;
  if (Math.random() > 0.5) {
    x = -x;
  }
  y = Math.random() * this.options.starfieldSize / 2.0;
  if (Math.random() > 0.5) {
    y = -y;
  }
  z = Math.random() * this.options.starfieldSize / 2.0;
  if (Math.random() > 0.5) {
    z = -z;
  }
  return new THREE.Vector3(x, y, z);
};


PulsarStarfieldParticleSystem.prototype.getRandomAngle = function ( ) {
  var direction = Math.random() * 4.0;
  if (direction < 1.0) {
    return 0;
  } else if (direction < 2.0) {
    return 90 * DEG2RAD;
  } else if (direction < 3.0) {
    return 180 * DEG2RAD;
  }
  return 270 * DEG2RAD;
};


/*
 * PULSAR SAMPLE VISUALIZER: STARLIGHT
 * This is intended to be a "medium" difficulty visualiser implementation. It
 * builds on the "Music Molecule" visualiser by adding a font-based 3D text
 * object and textures.
 */

function PulsarStarlightVisualizer (scope, element, attrs) {

  this.scope = scope;
  this.element = element;
  this.options = {
    'class':      attrs.canvasClass     || 'visualiser-pulsar-default',
    'width':      attrs.canvasWidth     || 1280,
    'height':     attrs.canvasHeight    || 720,
    'fov':        attrs.fov             || 75,
    'minDepth':   attrs.minDepth        || 0.5,
    'maxDepth':   attrs.maxDepth        || 1000.0
  };

  this.scene = null;
  this.cameraTween = null;
  this.lookAtTarget = null;

}


PulsarStarlightVisualizer.prototype.initialize = function ( ) {
  this.createGeometry();
  this.createTextures();
  this.createMaterials();
  this.createScene();
  this.createLights();
  this.createCamera();
  this.createRenderer();
}


PulsarStarlightVisualizer.prototype.destroy = function ( ) {
  if (this.scene) {
    this.pulsar = null;
    this.renderer = null;
    this.camera = null;
    this.scene = null;
  }
}


PulsarStarlightVisualizer.prototype.update = function starlightUpdate (specRatio, bassRatio, midsRatio, trebRatio) {
  var self = this;

  this.waveforms.left.material.color.setRGB(bassRatio, midsRatio, trebRatio);
  this.waveforms.right.material.color.setRGB(bassRatio, midsRatio, trebRatio);

  this.pulsarArmature.rotation.x -= 0.025 * bassRatio;
  this.pulsarArmature.rotation.y += 0.025 * midsRatio;
  this.pulsarArmature.rotation.z += 0.025 * trebRatio;

  this.pulsarCoreMount.rotation.x += 0.04 * bassRatio;
  this.pulsarCoreMount.rotation.y -= 0.04 * midsRatio;
  this.pulsarCoreMount.rotation.z -= 0.04 * trebRatio;

  this.pulsarLight.color.setRGB(bassRatio, midsRatio, trebRatio);
  this.pulsarLight.distance = 100.0 * specRatio;

  this.pulsarCoreMaterial.emissive.setRGB(bassRatio, midsRatio, trebRatio);
  this.pulsarCore.scale.set(
    0.98 + (bassRatio * 2.0),
    0.98 + (midsRatio * 2.0),
    0.98 + (trebRatio * 2.0)
  );

  this.pulsarOuterLayer.rotation.x += 0.03 * bassRatio;
  this.pulsarOuterLayer.rotation.y -= 0.03 * midsRatio;
  this.pulsarOuterLayer.rotation.z -= 0.03 * trebRatio;

  //var outerCoreScale = 1.0 + ;
  var outerCoreScale = 1.0 + (Math.max(bassRatio, Math.max(midsRatio, trebRatio)) * 2.0);
  this.pulsarOuterLayer.scale.set(outerCoreScale, outerCoreScale, outerCoreScale);

  this.materialBass.emissive.setRGB(bassRatio, 0, 0);
  this.rayBass1.scale.set(bassRatio, bassRatio, bassRatio);
  this.rayBass2.scale.set(bassRatio, bassRatio, bassRatio);

  this.materialMids.emissive.setRGB(0, midsRatio, 0);
  this.rayMids1.scale.set(midsRatio, midsRatio, midsRatio);
  this.rayMids2.scale.set(midsRatio, midsRatio, midsRatio);

  this.materialTreb.emissive.setRGB(0, 0, trebRatio);
  this.rayTreb1.scale.set(trebRatio, trebRatio, trebRatio);
  this.rayTreb2.scale.set(trebRatio, trebRatio, trebRatio);

  /*
   * Camera animations
   */

  var oldPosition, newPosition = new THREE.Vector3(this.camera.position);
  var x, y, z;
  if ((this.cameraTween === null) && (Math.random() > 0.997)) {
    x = 20 + (Math.random() * 40);
    if (Math.random() < 0.5) {
      x = -x;
    }

    y = 3.0 + (Math.random() * 35.0);
    // please do not flip Y, you'll go through the (soon to exist) floor

    z = 30 + (Math.random() * 70);
    if (Math.random() < 0.10) {
      z = -z;
    }

    this.cameraTween = new Tweenable();
    this.cameraTween.tween({
      'from': { 'x': this.camera.position.x, 'y': this.camera.position.y, 'z': this.camera.position.z },
      'to':   { 'x': x, 'y': y, 'z': z },
      'duration': 5000,
      'easing': 'easeInOutQuad',
      'step': function (state) {
        self.camera.position.set(state.x, state.y, state.z);
      },
      'finish': function ( ) {
        self.cameraTween = null;
      }
    });
  }

  /*
   * The following must happen between all scene deltas and the render call or
   * the view rendered will be one step out of sync. World matrices are only
   * updated during a call to render. Thus, the camera would be one frame behind
   * in its computation of lookAt. That is simply how Three.js works. If you
   * need an updated world of data prior to the render, you can ask it to do
   * that work here and now. It flags everything as clean, so the renderer does
   * not duplicate work performed here.
   */

  if (this.lookAtTarget) {
    this.scene.updateMatrixWorld();
    var lookAtTarget = new THREE.Vector3();
    lookAtTarget.setFromMatrixPosition(this.lookAtTarget.matrixWorld);
    this.camera.lookAt(lookAtTarget);
  }

  this.renderer.render(this.scene, this.camera);
};


PulsarStarlightVisualizer.prototype.setLookAtTarget = function (object) {
  this.hasLookAtTarget = (object !== null);
  this.lookAtTarget = object;
};


PulsarStarlightVisualizer.prototype.onWindowResize = function (element) {
  var w = element.offsetWidth;
  var h = element.offsetHeight;
  this.renderer.setSize(w, h);
  this.camera.aspect = w / h;
  this.camera.updateProjectionMatrix();
};


PulsarStarlightVisualizer.prototype.createGeometry = function starlightCreateGeometry ( ) {
  this.sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);

  this.cylinderGeometry = new THREE.CylinderGeometry(0, 0.7, 40, 32);
  this.cylinderGeometry.vertices.forEach(function (vertex) {
    vertex.y += 20.0;
  });
};


PulsarStarlightVisualizer.prototype.createTextGeometry = function starlightCreateTextGeometry (message, options) {
  var text = new THREE.TextGeometry(message, options);

  text.computeBoundingBox();
  text.textWidth = text.boundingBox.max.x - text.boundingBox.min.x;
  text.textHeight = text.boundingBox.max.y - text.boundingBox.min.y;
  text.textDepth = text.boundingBox.max.z - text.boundingBox.min.z;

  var halfWidth = text.textWidth / 2.0;
  var halfHeight = text.textHeight / 2.0;
  var halfDepth = text.textDepth / 2.0;
  text.vertices.forEach(function (vertex) {
    vertex.x -= halfWidth;
    vertex.y -= halfHeight;
    vertex.z -= halfDepth;
  });
  text.computeBoundingBox();

  return text;
};


/*
 * TODO https://github.com/robcolbert/pulsarcms/issues/19
 */
PulsarStarlightVisualizer.prototype.createTextures = function starlightCreateTextures ( ) {
  this.pulsarCoreTexture = THREE.ImageUtils.loadTexture('assets/visualisers/music-molecule/pulsar-core.png');
  this.pulsarOuterLayerTexture = THREE.ImageUtils.loadTexture('assets/visualisers/music-molecule/pulsar-outer-layer.png');
  this.pulsarTextTexture = THREE.ImageUtils.loadTexture('assets/visualisers/music-molecule/angular-surface.jpg');
  this.pulsarLightrayTexture = THREE.ImageUtils.loadTexture('assets/visualisers/music-molecule/lightray.png');
};


/*
 * TODO https://github.com/robcolbert/pulsarcms/issues/20
 */
PulsarStarlightVisualizer.prototype.createMaterials = function starlightCreateMaterials ( ) {

  this.pulsarCoreMaterial = new THREE.MeshPhongMaterial({
    'ambient': 0x030303,
    'color': 0x000000,
    'specular': 0,
    'shininess': 0,
    'side': THREE.DoubleSide,
    'shading': THREE.SmoothShading,
    'map': this.pulsarCoreTexture,
    'bumpMap': this.pulsarCoreTexture,
  });

  this.pulsarOuterLayerMaterial = new THREE.MeshPhongMaterial({
    'ambient': 0x030303,
    'color': 0,
    'specular': 0,
    'shininess': 0,
    'map': this.pulsarOuterLayerTexture,
    'bumpMap': this.pulsarOuterLayerTexture,
    'transparent': true,
    'opacity':0.50,
    'depthWrite': false,
    'side': THREE.DoubleSide
  });

  this.messageTextMaterial = new THREE.MeshPhongMaterial({
    'ambient': 0x0303ff,
    'color': 0xe8e8ff,
    'specular': 0x303060,
    'shininess': 50,
    'bumpMap': this.messageTextTexture,
    'side': THREE.DoubleSide,
    'shading': THREE.SmoothShading
  });

  var spectrumMaterialOptions = {
    'color':0xffffff,
    'transparent':true,
    'opacity':0.6,
    'map': this.pulsarLightrayTexture
  };
  this.materialBass = new THREE.MeshLambertMaterial(spectrumMaterialOptions);
  this.materialMids = new THREE.MeshLambertMaterial(spectrumMaterialOptions);
  this.materialTreb = new THREE.MeshLambertMaterial(spectrumMaterialOptions);

};


PulsarStarlightVisualizer.prototype.createLights = function starlightCreateLights ( ) {
  this.globalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  this.globalLight.target.position.set(0, 0, 0);
  this.globalLight.position.set(25, 100, 80);
  this.scene.add(this.globalLight);
};


PulsarStarlightVisualizer.prototype.createCamera = function starlightCreateCamera ( ) {
  this.camera = new THREE.PerspectiveCamera(
    this.options.fov,
    this.options.width / this.options.height,
    this.options.minDepth,
    this.options.maxDepth
  );
  this.camera.position.x = 0;
  this.camera.position.y = 0;
  this.camera.position.z = 75;

  // a couple extras I tack onto the camera
  this.camera.tween = null;
  this.camera.hasLookAtTarget = true;
  this.camera.lookAtTarget = this.messageText;
};


PulsarStarlightVisualizer.prototype.createRenderer = function starlightCreateRenderer ( ) {
  this.renderer = new THREE.WebGLRenderer({ 'alpha': true });
  this.renderer.setSize(this.options.width, this.options.height);
  this.renderer.domElement.className = 'pulsar-threejs';
}


PulsarStarlightVisualizer.prototype.createScene = function ( ) {
  this.scene = new THREE.Scene();

  this.pulsarArmature = new THREE.Object3D();
  this.scene.add(this.pulsarArmature);

  this.pulsar = new THREE.Object3D();
  this.pulsar.name = 'Pulsar';
  this.pulsar.position.set(40,20,40);
  this.pulsarArmature.add(this.pulsar);

  this.pulsarLight = new THREE.PointLight(0xffffff);
  this.pulsar.add(this.pulsarLight);

  this.pulsarCoreMount = new THREE.Object3D();
  this.pulsarCoreMount.name = 'PulsarCoreMount';
  this.pulsar.add(this.pulsarCoreMount);

  this.pulsarCore = new THREE.Mesh(this.sphereGeometry, this.pulsarCoreMaterial);
  this.pulsarCore.name = 'PulsarCore';
  this.pulsarCore.scale.set(0.8, 0.8, 0.8);
  this.pulsarCoreMount.add(this.pulsarCore);

  this.pulsarOuterLayer = new THREE.Mesh(this.sphereGeometry, this.pulsarOuterLayerMaterial);
  this.pulsarOuterLayer.name = 'PulsarOuterLayer';
  this.pulsarOuterLayer.scale.set(1.0, 1.0, 1.0);
  this.pulsar.add(this.pulsarOuterLayer);

  this.rayBass1 = new THREE.Mesh(this.cylinderGeometry, this.materialBass);
  this.rayBass1.name = 'cylinderBass1';
  this.rayBass1.rotation.z = 90 * DEG2RAD;
  this.pulsarCoreMount.add(this.rayBass1);
  this.rayBass2 = new THREE.Mesh(this.cylinderGeometry, this.materialBass);
  this.rayBass2.name = 'cylinderBass2';
  this.rayBass2.rotation.z = -90 * DEG2RAD;
  this.pulsarCoreMount.add(this.rayBass2);

  this.rayMids1 = new THREE.Mesh(this.cylinderGeometry, this.materialMids);
  this.rayMids1.name = 'cylinderMids1';
  this.rayMids1.rotation.x = 90 * DEG2RAD;
  this.pulsarCoreMount.add(this.rayMids1);
  this.rayMids2 = new THREE.Mesh(this.cylinderGeometry, this.materialMids);
  this.rayMids2.name = 'cylinderMids2';
  this.rayMids2.rotation.x = -90 * DEG2RAD;
  this.pulsarCoreMount.add(this.rayMids2);

  this.rayTreb1 = new THREE.Mesh(this.cylinderGeometry, this.materialTreb);
  this.rayTreb1.name = 'cylinderTreb1';
  this.pulsarCoreMount.add(this.rayTreb1);
  this.rayTreb2 = new THREE.Mesh(this.cylinderGeometry, this.materialTreb);
  this.rayTreb2.name = 'cylinderTreb2';
  this.rayTreb2.rotation.x = 180 * DEG2RAD;
  this.pulsarCoreMount.add(this.rayTreb2);
};


PulsarStarlightVisualizer.prototype.createWaveforms = function (waveformOptions) {
  var waveform;
  this.waveforms = { };

  waveform = new PulsarWaveformParticleSystem(waveformOptions);
  waveform.rotation.set(0, 225 * DEG2RAD, 0);
  waveform.position.y = 30;
  waveform.position.z = -(waveformOptions.height * 2);
  this.scene.add(waveform);
  this.waveforms.left = waveform;

  waveform = new PulsarWaveformParticleSystem(waveformOptions);
  waveform.rotation.set(0, 315 * DEG2RAD, 0);
  waveform.position.y = 30
  waveform.position.z = -(waveformOptions.height * 2);
  this.scene.add(waveform);
  this.waveforms.right = waveform;
};


PulsarStarlightVisualizer.prototype.createStarfield = function (starfieldOptions) {
  this.starfield = new PulsarStarfieldParticleSystem(starfieldOptions);
  this.scene.add(this.starfield);
};


PulsarStarlightVisualizer.prototype.createMessageText = function (brand) {
  this.messageTextGeometry = this.createTextGeometry(brand, {
    'font': 'optimer',
    'size': 12.0,
    'weight': 'normal',
    'height': 5,
    'bevelEnabled': true,
    'bevelThickness': 0.15,
    'bevelSize': 0.15
  });
  this.messageText = new THREE.Mesh(this.messageTextGeometry, this.messageTextMaterial);
  this.scene.add(this.messageText);
};


/*
 * The Angular directive implementation is kept perfectly clear by hoisting that
 * mammoth of a "function" out to its own definition above. Because this is all
 * Angular asks of you. All of the above is genuinely application logic. When
 * you only really spend this much time integrating with your framework, it's a
 * total win:
 */
function PulsarStarlightVisualizerDirective ($window, WebAudio, SiteSettings) {

  return {
    templateUrl: 'views/directives/visualisers/pulsar-starlight.html',
    restrict: 'E',
    link: function postLink (scope, element, attrs) {

      //(Rjc) 2014-04-12
      // Done this way to prevent hoisting $window to some ugly global hack even
      // though "window" (the actual global) is available. That simply isn't the
      // $window I'm looking for [waves hand].
      var visualiser = null;

      function onWindowResize ( ) {
        if (visualiser === null) {
          return;
        }
        visualiser.onWindowResize(element[0].parentElement);
      }

      /*
       * Pulsar visualisers must implement an update method and decorate the scope
       * with it. The method must be: scope.updateVisualizer3d
       */
      scope.updateVisualizer3d = function starlightUpdateVisualizer3d(specRatio, bassRatio, midsRatio, trebRatio) {
        if (visualiser === null) {
          return;
        }
        visualiser.update(specRatio, bassRatio, midsRatio, trebRatio);
        visualiser.waveforms.left.update(WebAudio.analysers.left);
        visualiser.waveforms.right.update(WebAudio.analysers.right);
        visualiser.starfield.update(WebAudio.analyzers);
      };

      scope.$watch('isFullscreen', function starlightTestFullscreen ( ) {
        if (visualiser !== null) {
          visualiser.destroy();
          visualiser = null;
          angular.element($window).unbind('resize', onWindowResize);
          element.empty();
        }

        if (!scope.isFullscreen) {
          return;
        }

        visualiser = new PulsarStarlightVisualizer(scope, element, attrs);
        visualiser.initialize();

        console.log('starlight attrs', attrs);
        var messageText = attrs.message || SiteSettings.settings.siteInformation.brand;
        visualiser.createMessageText(messageText);
        visualiser.camera.hasLookAt = true;
        visualiser.camera.lookAtTarget = visualiser.messageText;

        visualiser.createWaveforms({
          'numPoints': 1024,
          'width': 256.0,
          'height': 40.0,
          'centered': false,
          'color': 0xffffff,
          'sizeAttenuation': true,
          'fog': false
        });

        visualiser.createStarfield({
          'numPoints': 512,
          'travelSpeed': 4.0,
          'particleSize': 3.0,
          'starfieldSize': 1024.0,
          'color': 0xffffff,
          'sizeAttenuation': true,
          'fog': false
        });

        visualiser.setLookAtTarget(visualiser.messageText);

        angular.element($window).bind('resize', onWindowResize);
        element.append(visualiser.renderer.domElement);
      });
    }
  };

}


PulsarStarlightVisualizerDirective.$inject = [
  '$window',
  'WebAudio',
  'SiteSettings'
];


angular.module('pulsarClientApp')
.directive('pulsarVisualiserStarlight', PulsarStarlightVisualizerDirective);
