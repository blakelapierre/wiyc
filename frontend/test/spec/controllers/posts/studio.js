'use strict';

describe('Controller: PostsStudioCtrl', function () {

  // load the controller's module
  beforeEach(module('wiyc'));

  var PostsStudioCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PostsStudioCtrl = $controller('PostsStudioCtrl', {
      $scope: scope
    });
  }));

//   it('should attach a list of awesomeThings to the scope', function () {
//     expect(scope.awesomeThings.length).toBe(3);
//   });
});
