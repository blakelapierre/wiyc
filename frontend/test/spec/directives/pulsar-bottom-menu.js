'use strict';

describe('Directive: pulsarBottomMenu', function () {

  // load the directive's module
  beforeEach(module('wiyc'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<pulsar-bottom-menu></pulsar-bottom-menu>');
    element = $compile(element)(scope);
//    expect(element.text()).toBe('this is the pulsarBottomMenu directive');
  }));
});
