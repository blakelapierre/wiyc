'use strict';

describe('Controller: RequestPasswordResetCtrl', function () {

  // load the controller's module
  beforeEach(module('wiyc'));

  var RequestPasswordResetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RequestPasswordResetCtrl = $controller('RequestPasswordResetCtrl', {
      $scope: scope
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(scope.awesomeThings.length).toBe(3);
  // });
});
