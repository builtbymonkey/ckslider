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

  module('jQuery.ckslider');


//
	test('ckslider initialises', function() {
		var slider = $('.slider').ckslider();
		
		expect(2);
		ok(slider, "as non null object");
		equal(slider.slideCount, 3, "has 3 slides");
	});
	
	
	test('default markup and classes added', function(){
		var slider;
			
		$(".slider").addClass("loading");
		slider = $(".slider").ckslider();
		
		equal(slider.$container.hasClass("loading"), false, "root loading class removed on load");
	});
	
	test('default css applied', function(){
		var slider = $(".slider").ckslider();
		
		equal(slider.$container.css("position"), "relative", "root loading class removed on load");
		
		$.each(slider.$slides, function(i, item){
			equal($(item).css('position'), 'absolute', "Slide " + i + " is absolutely positioned");
			
			//Fist Slide is visible
			if(i === 0) {
				equal($(item).css('position'), 'absolute', "slide " + i + " is visible");
			} else {
				equal($(item).css('display'), 'none', "slide " + i + " is visible");
			}
		});
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
