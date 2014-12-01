'use strict';

describe('Service: PulsarVideoCall', function () {

  // load the service's module
  beforeEach(module('wiyc'));

  // instantiate service
  var PulsarVideoCall;
  beforeEach(inject(function (_PulsarVideoCall_) {
    PulsarVideoCall = _PulsarVideoCall_;
  }));

  it('should do something', function () {
    expect(!!PulsarVideoCall).toBe(true);
  });

});
