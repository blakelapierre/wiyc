'use strict';

describe('Controller: PrivacyPolicyCtrl', function () {

  // load the controller's module
  beforeEach(module('wiyc'));

  var PrivacyPolicyCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PrivacyPolicyCtrl = $controller('PrivacyPolicyCtrl', {
      $scope: scope
    });
  }));

//  it('should attach a list of awesomeThings to the scope', function () {
//    expect(scope.awesomeThings.length).toBe(3);
//  });
});
