'use strict';

describe('Controller: HireRobCtrl', function () {

  // load the controller's module
  beforeEach(module('robcolbertApp'));

  var HireRobCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HireRobCtrl = $controller('HireRobCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
