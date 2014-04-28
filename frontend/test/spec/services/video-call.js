'use strict';

describe('Service: VideoCall', function () {

  // load the service's module
  beforeEach(module('pulsarClientApp'));

  // instantiate service
  var VideoCall;
  beforeEach(inject(function (_VideoCall_) {
    VideoCall = _VideoCall_;
  }));

  it('should do something', function () {
    expect(!!VideoCall).toBe(true);
  });

});
