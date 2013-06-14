/*global $ */

/*
 * ckslider
 * https://github.com/ckimrie/ckslider
 *
 * Copyright (c) 2013 Christopher Imrie
 * Licensed under the MIT license.
 */

(function () {
	var defaults = {
			'fadeInDuration' : 800,
			'delay' : 5000,
			'start' : 1,
			'transition' : 'fade',
			'autoplay' : true,
			'preloadImages' : true,
			'inactiveZIndex' : 1,
			'zIndexLayer1' : 5,
			'zIndexLayer2' : 10,
			'zIndexLayer3' : 15,
			'pauseOnClick' : true,
			'hideInactiveSlides' : true,
			'legacyIEMode' : $('html').is('.ie6, .ie7, .ie8'),

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
		},
		constants = {
			DIRECTION_FORWARD : 'forward',
			DIRECTION_REVERSE : 'reverse'
		};


	/**
	 * Constructor
	 *
	 * @param {Object} options
	 */
	var CKSlider = function (node, options) {

		this.options = $.extend({}, defaults, options || {});

		this.$container = $(node).eq(0);
		this.$slides = this.$container.find("." + this.options.slideClass);
		this.$indicatorContainer = this.$container.find(this.options.slideIndicatorWrapper);
		this.$indicators = this.$indicatorContainer.find(this.options.slideIndicatorElement);
		this.$nextBtn = this.$indicatorContainer.find(this.options.nextBtn);
		this.$prevBtn = this.$indicatorContainer.find(this.options.prevBtn);

		this.slideCount = this.$slides.length;
		this.current = this.options.start > 0 && this.options.start < this.$slides.length ? this.options.start - 1 : 0;
		this.nextKey = null; //Set automatically whenever an interaction or autplay occurs
		this.autoplayTimeout = null;
		this.direction = this.options.direction;
		this.animationLock = false;

		this.init();
	};

	/**
	 * Methods
	 * @type {Object}
	 */
	CKSlider.prototype = {

		/**
		 * Start the slider lifecycle
		 */
		init : function () {
			this.measureContainerDimensions();
			this.setInitialSlidePresentation();
			this.bindEvents();

			//Trigger public event
			this.trigger('ms.start');
		},


		/**
		 * Set initial slide presentation
		 */
		setInitialSlidePresentation : function () {
			var self = this;

			this.$container.addClass(this.options.loadingClass)
				.css({
					height : this.height,
					position : 'relative'
				});


			this.$slides.each(function (i) {
				if (i === self.current || !self.options.hideInactiveSlides) {
					$(this).show();
				} else {
					$(this).hide();
				}

				$(this).css({
					position : 'absolute',
					height : self.height,
					width : '100%'
				});
			});

			this.$indicatorContainer.css({
				'zIndex' : this.options.zIndexLayer3
			});

			this.highlightIndicator(this.getCurrentKey());
		},


		/**
		 * Measure container dimensions
		 */
		measureContainerDimensions : function () {
			if (this.options.width !== null) {
				this.width = this.options.width;
			} else {
				this.width = this.$container.width();
			}
			if (this.options.height !== null) {
				this.height = this.options.height;
			} else {
				this.height = this.$container.height();
			}
		},


		/**
		 * Get current key
		 * @returns {int}
		 */
		getCurrentKey : function () {
			return this.current;
		},

		/**
		 * Set current key
		 * @param key
		 */
		setCurrentKey : function (key) {
			this.current = key;
		},


		/**
		 * Get current slide
		 * @returns {jQuery}
		 */
		getCurrentSlide : function () {
			return this.getSlideAtKey(this.getCurrentKey());
		},


		/**
		 * Get next key (given current direction)
		 * @returns {int}
		 */
		getNextKey : function () {
			var key;

			if (this.direction === constants.DIRECTION_REVERSE) {
				key = this.current - 1;
				if (key < 0) {
					key = this.slideCount - 1;
				}
			} else {
				key = this.current + 1;
				if (key >= this.slideCount) {
					key = 0;
				}
			}
			return key;
		},


		getNthRelativeKey : function (n) {
			var key, diff;

			if (this.direction === constants.DIRECTION_REVERSE) {
				n *= -1;
//				key -= 1;
			}

			key = this.current + n;
			if (key < 0) {
				diff = key + this.slideCount;
				key = diff;
			}
			if (key >= this.slideCount) {
				diff = key - this.slideCount
				key = diff;
			}
			return key;
		},

		/**
		 * Get prev key (given current direction)
		 * @returns {int}
		 */
		getPrevKey : function () {
			var key;

			if (this.direction === constants.DIRECTION_REVERSE) {
				key = this.current + 1;
				if (key >= this.slideCount) {
					key = 0;
				}
			} else {
				key = this.current - 1;
				if (key < 0) {
					key = this.slideCount - 1;
				}
			}
			return key;
		},

		/**
		 * Get next slide relative to current
		 * @returns {jQuery}
		 */
		getNextSlide : function () {
			return this.getSlideAtKey(this.getNextKey());
		},

		/**
		 * Get prev slide relative to current
		 * @returns {jQuery}
		 */
		getPrevSlide : function () {
			return this.getSlideAtKey(this.getPrevKey());
		},


		/**
		 * Get slide at key
		 *
		 * @param {int} key
		 * @returns {jQuery}
		 */
		getSlideAtKey : function (key) {
			return this.$slides.eq(key);
		},


		/**
		 * Setup Autoplay
		 */
		autoplay : function () {
			var self = this;

			clearTimeout(this.autoplayTimeout);

			this.autoplayTimeout = setTimeout(function () {
				self.trigger('ms.next');
			}, this.options.delay);
		},


		stopAutoplay : function () {
			clearTimeout(this.autoplayTimeout);
			this.options.autoplay = false;
		},

		/**
		 * On Slider lifecycle start
		 */
		onStart : function () {

			if (this.options.preloadImages) {
				this.preloadImages(this.$slides.find('img'));
			}

			this.$container.removeClass("loading");

			//Trigger public method
			this.options.onStart.apply(this);

			if (this.options.autoplay) {
				this.autoplay();
			}
		},


		/**
		 * On the next event
		 */
		onNext : function () {
			this.transitionToSlide(this.getNextKey());
		},

		/**
		 * On previous event
		 */
		onPrev : function () {
			this.transitionToSlide(this.getPrevKey());
		},


		/**
		 * On Change to slide
		 */
		transitionToSlide : function (key) {
			var self = this,
				currentKey, nextKey, currentSlide, nextSlide, def;

			//Same as current key? Bail...
			if (key === this.getCurrentKey() || this.animationLock) return;

			this.animationLock = true;

			//Figure out direction
			this.direction = this.getDirectionBetweenKeys(this.getCurrentKey(), key);

			currentKey = this.getCurrentKey();
			nextKey = key;
			currentSlide = this.getCurrentSlide();
			nextSlide = this.getSlideAtKey(key);

			//Trigger public method
			$.when(this.options.onBeforeTransition.apply(this, [currentSlide, nextSlide, nextKey])).then(function () {
				var here = self,
					cKey = currentKey,
					nKey = nextKey,
					cSlide = currentSlide,
					nSlide = nextSlide;

				self.highlightIndicator(nextKey);

				//Away we go!
				def = self[self.options.transition + 'ToSlide'](nextKey);

				//After transition
				def.then(function () {
					here.setCurrentKey(nKey);
					here.animationLock = false;

					//Trigger public method
					here.options.onAfterTransition.apply(here, [cSlide, nSlide, cKey]);
				});
			});
		},


		/**
		 * Highlight indicator
		 * @param key
		 */
		highlightIndicator : function (key) {
			this.$indicators.removeClass(this.options.indicatorActiveClass);
			this.$indicators.eq(key).addClass(this.options.indicatorActiveClass);
		},


		/**
		 * Calculate transition direction between two keys
		 * @param {int} key1
		 * @param {int} key2
		 * @returns {*}
		 */
		getDirectionBetweenKeys : function (key1, key2) {
			var direction;

			if (key1 > key2) {
				direction = constants.DIRECTION_REVERSE;
			} else {
				direction = constants.DIRECTION_FORWARD;
			}

			//Edge cases
			if (key2 === 0 && key1 >= (this.slideCount - 1)) {
				direction = constants.DIRECTION_FORWARD;
			}

			if (key1 === 0 && key2 >= (this.slideCount - 1)) {
				direction = constants.DIRECTION_REVERSE;
			}

			return direction;
		},


		/*
		 * ------------------------------------------------------
		 *  Fade transition
		 * ------------------------------------------------------
		 */

		fadeToSlide : function (key) {
			var self = this,
				def = new $.Deferred(),
				$currentSlide = this.getCurrentSlide(),
				$nextSlide = this.getSlideAtKey(key);


			//Prep layering and position
			$currentSlide.css({
				'zIndex' : this.options.zIndexLayer1
			});

			$nextSlide.hide().css({
				'zIndex' : this.options.zIndexLayer2
			});

			//Fade In
			$nextSlide.fadeIn(this.options.fadeInDuration, function () {
				self.postFade($currentSlide, $nextSlide);
				def.resolve();
			});

			return def;
		},


		postFade : function ($currentSlide, $nextSlide) {
			$currentSlide.hide().css({
				'zIndex' : this.options.inactiveZIndex
			});
			$nextSlide.css({
				'zIndex' : this.options.inactiveZIndex
			});

			//Autoplay
			if (this.options.autoplay) {
				this.autoplay();
			}
		},


		/*
		 * ------------------------------------------------------
		 *  Pub/Sub
		 * ------------------------------------------------------
		 */

		/**
		 * Bind to event
		 * @param {Function} cb
		 */
		on : function (eventName, cb) {
			this.$container.on(eventName, cb);
		},

		/**
		 * Trigger local event
		 * @param {string} eventName
		 */
		trigger : function (eventName, data) {
			this.$container.trigger(eventName, data);
		},


		/**
		 * Bind UI interaction event listeners
		 */
		bindInteractionEvents : function () {
			var self = this;

			//Prev/Next
			this.$nextBtn.click(function (e) {
				e.preventDefault();
				self.trigger('ms.next')
				return false;
			});
			this.$prevBtn.click(function (e) {
				e.preventDefault();
				self.trigger('ms.prev')
				return false;
			});

			//Indicators
			this.$indicators.each(function (i) {
				var there = self;
				$(this).click(function (e) {
					e.preventDefault();
					there.trigger('ms.goTo', [i]);
					return false;
				})
			});

			//Pause on click
			if (this.options.pauseOnClick) {
				this.$container.click(function (e) {
					self.trigger('ms.stop');
				});
			}
		},


		/**
		 * Bind custom event actions
		 */
		bindEvents : function () {
			var self = this;

			//User interaction events
			this.bindInteractionEvents();


			//Next & prev events
			this.on('ms.next', $.proxy(this.onNext, this));
			this.on('ms.prev', $.proxy(this.onPrev, this));

			//Go direct to slide events
			this.on('ms.goTo', function (e, key) {
				self.stopAutoplay();
				self.transitionToSlide(key);
			});

			this.on('ms.start', $.proxy(this.onStart, this));
			this.on('ms.stop', $.proxy(this.stopAutoplay, this));
		},

		preloadImages : function (nodes) {
			$(nodes).each(function () {
				var img = document.createElement("img");
				img.src = $(this).attr('src');
			});
		}
	};


	/**
	 * jQuery API
	 *
	 * @param options
	 * @returns {Array|Object|boolean}
	 */
	$.fn.ckslider = function (options) {
		var a = [];
		this.each(function () {
			a.push(new CKSlider(this, options));
		});

		return a.length > 1 ? a : a.length === 1 ? a[0] : false;
	};
})();

