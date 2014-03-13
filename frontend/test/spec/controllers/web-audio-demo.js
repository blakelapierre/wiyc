'use strict';

describe('Controller: WebAudioDemoCtrl', function () {

  // load the controller's module
  beforeEach(module('robcolbertApp'));

  var WebAudioDemoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WebAudioDemoCtrl = $controller('WebAudioDemoCtrl', {
      $scope: scope
    });
  }));

//   it('should attach a list of awesomeThings to the scope', function () {
//     expect(scope.awesomeThings.length).toBe(3);
//   });
});
