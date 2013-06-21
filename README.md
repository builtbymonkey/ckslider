# ckSlider

jQuery content slider I developed while working at Moresoda. I needed something that
 I knew inside out and was extensible. It has extension points to run custom code on load
 as well as before and after a transition.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/ckimrie/ckslider/master/dist/ckslider.min.js
[max]: https://raw.github.com/ckimrie/ckslider/master/dist/ckslider.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/ckslider.min.js"></script>
<script>
$(document).ready(function($) {
	$('.slider').ckslider();
});
</script>
```

## Documentation

Complete list of configuration options and defaults:

```javascript
defaultConfig  = {
	'fadeInDuration' : 800,
	'slideDuration' : 800,
	'delay' : 5000,
	'start' : 1,
	'transition' : 'fade', //Accepts 'fade' or 'slide'
	'autoplay' : true,
	'interactionDisablesAutoplay': true,
	'preloadImages' : true,
	'slideInactiveOpacity': 0.5,
	'inactiveZIndex' : 1,
	'zIndexLayer1' : 5,
	'zIndexLayer2' : 10,
	'zIndexLayer3' : 15,
	'pauseOnClick' : true,
	'hideInactiveSlides' : true,
	'legacyIEMode' : jQuery('html').is('.ie6, .ie7, .ie8'),
	
	'height' : null,
	'width' : null,
	
	'loadingClass' : 'loading',
	'slideActiveClass' : 'active',
	'slideClass' : 'slide',
	'indicatorActiveClass' : 'active',
	
	'slideIndicatorWrapper' : '.counter',
	'slideIndicatorElement' : 'a',
	
	'nextBtn' : '.next',
	'prevBtn' : '.previous',
	
	'direction' : 'forward',
	'onStart' : function () {
	},
	'onBeforeTransition' : function () {
	},
	'onAfterTransition' : function () {
	},
	'onPause' : function () {
	}
};
```

## Example

### HTML

The root `loading` class is removed after the JS initialises. This is handy for controlling the display on first load

```html
<!-- HTML Markup template 	-->

<div class='slider loading'>

	<!-- Slides -->
	<div class='slide'>Slide 1</div>
	<div class='slide'>Slide 2</div>
	<div class='slide'>Slide 3</div>

	<!-- Progress/count indicators [Optional] -->
	<div class='counter'>
		<a href="#">1</a>
		<a href="#">2</a>
		<a href="#">3</a>
	</div>

	<!-- Prev/Next buttons [Optional] -->
	<a href="#" class="previous">Prev</a>
	<a href="#" class="next">Next</a>
</div>
```

### CSS

The slider requires some basic CSS scaffolding

```css
.slider {
	position: relative;
}
.slider, .slide {
	height: 400px;
	width: 700px;
}
.slide {
	position: absolute;
	left:0;
	right:0;
}
```

### JS

_Simple example_

```javascript
//Simply select and initialise with some optional configurations
$(document).ready(function($) {
	$('.slider').ckslider({
		'fadeInDuration' : 800,
		'delay' : 5000,
	});
});
```

_Advanced example_

The onBeforeTransition config can return a jQuery Deferred object [Optional] in order to halt the slider progress until your custom
 code / animation finishes. Resolving the Deferred object causes the slider to resume.

```javascript
//Simply select and initialise with some optional configurations
$(document).ready(function($) {
	$('.slider').ckslider({
		onBeforeTransition: function() {
			var def = new $.Deferred();

			//Do something that takes time
			setTimeout(function(){

				//Resolving the deferred object causes the slider to continue as normal
				def.resolve();
			}, 2000);

			return def;
		}
	});
});
```

## Release History

* 0.2 Added slide transition
* 0.1 Public Release
