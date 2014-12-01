'use strict';

describe('Controller: PostsComposeCtrl', function () {

  // load the controller's module
  beforeEach(module('wiyc'));

  var PostsComposeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PostsComposeCtrl = $controller('PostsComposeCtrl', {
      $scope: scope
    });
  }));

//   it('should attach a list of awesomeThings to the scope', function () {
//     expect(scope.awesomeThings.length).toBe(3);
//   });
});
