'use strict';

describe('Controller: PostsPostidCtrl', function () {

  // load the controller's module
  beforeEach(module('robcolbertApp'));

  var PostsPostidCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PostsPostidCtrl = $controller('PostsPostidCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
