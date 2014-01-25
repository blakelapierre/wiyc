'use strict';

describe('Service: Thoughts', function () {

  // load the service's module
  beforeEach(module('robcolbertApp'));

  // instantiate service
  var Thoughts;
  beforeEach(inject(function (_Thoughts_) {
    Thoughts = _Thoughts_;
  }));

  it('should do something', function () {
    expect(!!Thoughts).toBe(true);
  });

});
