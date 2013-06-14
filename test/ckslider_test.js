(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module('jQuery.ckslider', {
    // This will run before each test in this module.
    setup: function() {
      this.slider = $('#qunit-fixture').ckslider();
    }
  });


//
  test('ckslider initialises', function() {
    expect(2);
	ok(this.slider, "as non null object");
	equal(this.slider.slideCount, 3, "has 3 slides");
  });
//
//  module('jQuery.awesome');
//
//  test('is awesome', function() {
//    expect(2);
//    strictEqual($.awesome(), 'awesome.', 'should be awesome');
//    strictEqual($.awesome({punctuation: '!'}), 'awesome!', 'should be thoroughly awesome');
//  });
//
//  module(':awesome selector', {
//    // This will run before each test in this module.
//    setup: function() {
//      this.elems = $('#qunit-fixture').children();
//    }
//  });
//
//  test('is awesome', function() {
//    expect(1);
//    // Use deepEqual & .get() when comparing jQuery objects.
//    deepEqual(this.elems.filter(':awesome').get(), this.elems.last().get(), 'knows awesome when it sees it');
//  });

}(jQuery));
