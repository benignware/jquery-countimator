(function ( $, window ) {
  
  var pluginName = 'countimator';
  
  var defaults = {
    // Values
    count: 0,
    value: null, 
    min: null,
    max: 0,
    // Animation options
    duration: 1000, 
    // Property selector
    countSelector: '.counter-count', 
    maxSelector: '.counter-max', 
    // Template options
    template: null, 
    engine: null,
    // Trigger animation options
    animateOnInit: true, 
    animateOnAppear: true, 
    // Format options 
    decimals: 0, 
    decimalDelimiter: '.', 
    thousandDelimiter: null, 
    pad: false,
    // Style plugin
    style: null, 
    // Callbacks
    start: function() {},
    step: function(step) {},
    complete: function() {}
  };
  
  function formatNumber(n, decimals, decimalDelimiter, thousandDelimiter){
    decimals = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals, 
    decimalDelimiter = typeof decimalDelimiter == 'undefined' ? "." : decimalDelimiter, 
    thousandDelimiter = typeof thousandDelimiter == 'undefined' ? "," : thousandDelimiter, 
    thousandDelimiter = typeof thousandDelimiter == 'string' ? thousandDelimiter : "", 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(decimals)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + thousandDelimiter : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousandDelimiter) + (decimals ? decimalDelimiter + Math.abs(n - i).toFixed(decimals).slice(2) : "");
  };
  
  function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
  }
  
  function textNodes(parent) {
    return $(parent).contents().filter(function () {
      return this.nodeType === Node.TEXT_NODE;
    });
  }
  
  function inView(elem){
    var $elem = $(elem);
    var $window = $(window);

    var docViewTop = $window.scrollTop();
    var docViewBottom = docViewTop + $window.height();

    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  };

  // Request animation frame Polyfill
  var requestAnimationFrame = 
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame || 
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };

  var pluginClass = function Countimator(element, options) {
    
    var instance = this;
    var $element = $(element);
    
    options = $.extend({}, defaults, options, $element.data());
    
    var startTime, startCount;
    var animating = false;
    
    
    // private methods
    function init() {
    
      var value = getValue();
      var count = getCount();
      var max = getMax();
      
      // init values
      if (!count) {
        var countNode = getCountNode();
        if (countNode) {
          if (typeof options.value !== 'number') {
            options.value = countNode.nodeValue;
          } else {
            options.count = countNode.nodeValue;
          }
        }
      }
      
      if (!max) {
        var maxNode = getMaxNode();
        if (maxNode) {
          options.max = maxNode.nodeValue;
        }
      }
      
      // init template
      var script = $element.find("script[type*='text/x-']");
      if (script.length) {
        options.template = script.html();
        script.remove();
      }

      // init listeners
      $(window).on('resize', function() {
        resize.call(instance);
      });
      
      $(window).on('scroll touchmove', function() {
        if (options.animateOnInit && options.animateOnAppear && inView(element)) {
          $(window).off('scroll touchmove', arguments.callee);
          if (!animating) {
            start.call(instance);
          }
        }
      });
      
      if (options.animateOnInit) {
        if (options.animateOnAppear && inView(element)) {
          options.count = typeof count == 'number' ? count : 0; 
          start.call(instance);
        } else {
          render.call(this);
        }
      } else {
        options.count = getValue();
        render.call(this);
      }
      
      resize.call(this);
    };
    
    function setOption(name, value) {
      var old = options[name];
      options[name] = value;
      switch (name) {
        case 'value': 
          if (old == value) {
            return;
          }
          if (typeof old != 'number') {
            options['count'] = value;
            render.call(this);
          } else {
            options['count'] = old;
            start();
          }
          break;
       }
    }
    
    function getMin() {
      var min = parseFloat(options.min);
      return isNaN(min) ? 0 : min;
    }
    
    function getMax() {
      var max = parseFloat(options.max);
      return isNaN(max) ? 0 : max;
    }
    
    function getValue() {
      var max = getMax();
      var min = getMin();
      var count = getCount();
      var value = parseFloat(options.value);
      if (isNaN(value)) {
        value = min;
      }
      return value;
    }
    
    function getCount() {
      var max = getMax();
      var min = getMin();
      var count = parseFloat(options.count);
      if (isNaN(count)) {
        count = min;
      }
      return count;
    }
    /*
    function getOption(name) {
      var value = options[name];
      switch (name) {          
        case 'value': 
          var max = getOption('max');
          var min = getOption('min');
          var count = getOption('count');
          var floatValue = parseFloat(value);
          if (!isNaN(floatValue)) {
            floatValue = Math.max(floatValue, min);
            value = Math.min(floatValue, max);
          }
          break;
        case 'count': 
          if (!value) {
            var max = getOption('max');
            var min = getOption('min');
            value = Math.max(value, min);
            value = Math.min(value, max);
            value = parseFloat(value);
            if (isNaN(value)) {
              value = min;
            }
          }
          break;
        case 'max': 
          value = parseFloat(value ? value : options.value);
          break;
        case 'min': 
          if (!value) {
            value = 0;
          }
          break;
      }
      return value;
    }*/
    
    function resize() {
    };
    
    function getCountNode(count) {
      var countElement = $element.find(options.countSelector)[0];
      if (!countElement) {
        countElement = $element.find("*").last().siblings().addBack()[0];
      }
      var textNode = textNodes(countElement || element)[0];
      return textNode;
    }
    
    function getMaxNode(count) {
      var maxElement = $element.find(options.maxSelector)[0];
      if (maxElement) {
        return textNodes(maxElement)[0];
      }
      return null;
    }
    
    function getFormattedValue(value) {
      // format number
      var decimals = options.decimals;
      var decimalDelimiter = options.decimalDelimiter;
      var thousandDelimiter = options.thousandDelimiter;
      string = formatNumber(value, decimals, decimalDelimiter, thousandDelimiter);
      // pad
      string = pad(string, options.pad);
      return string;
    }
    
    function render() {

      var max = getMax();
      var min = getMin();
      var value = getValue();
      var count = getCount();
      
      var formattedCount = getFormattedValue(count);
      var formattedValue = getFormattedValue(value);
      var formattedMax = getFormattedValue(max);
      var formattedMin = getFormattedValue(min);
      
      var engine = options.engine || typeof Handlebars !== 'undefined' ? Handlebars : null;
      
      var template = options.template;
      
      try {
        var $template = $(options.template);
        template = $template.length && $template[0].innerHTML || template;
      } catch (e) {
        // Template is not a dom element
      }
      
      var string;
      if (engine && template) {
        // Template engine
        var tmpl = engine.compile(template);
        if (tmpl) {
          var tmplData = $.extend({}, options, {count: formattedCount, value: formattedValue, max: formattedMax, min: formattedMin});
          string = tmpl(tmplData);
        }
        var div = document.createElement('div');
        div.innerHTML = string;
        var nodeList = div.childNodes;
        $(element).contents().remove();
        $(element).append(nodeList);
        
      } else {
        // Classic approach without a template engine
        string = formattedCount;
        // set count
        var countNode = getCountNode();
        if (countNode) {
          countNode.nodeValue = formattedCount;
        }
        var maxNode = getMaxNode();
        if (maxNode) {
          maxNode.nodeValue = formattedMax;
        }
        if (!countNode && !maxNode) {
          element.innerHTML = formattedCount;
        }
      }
      
      if (options.style) {
        var style = $.fn[pluginName].getStyle(options.style);
        if (style && style.render) {
          style.render.call(element, count, options);
        }
      }
      
    }
    
    function animate(value) {
      options.value = value;
      if (!animating) {
        start();
      }
    }
    
    function start() {
      if (!animating) {
        startTime = new Date().getTime();
        startCount = getCount();
        var startCallback = options.start;
        animating = true;
        if (typeof startCallback === 'function') {
          startCallback.call(element);
        }
        requestAnimationFrame(step);
      }
    }

    function step() {
        
      var duration = options.duration;
      var max = getMax();
      var value = getValue();
      
      var currentTime = new Date().getTime();
      var endTime = startTime + duration;
      
      var currentStep = Math.min((duration - (endTime - currentTime)) / duration, 1);
      
      var count = startCount + currentStep * (value - startCount);
      
      options.count = count;
      
      render.call(this);
      
      // Step Callback
      var stepCallback = options.step;
      if (typeof stepCallback === 'function') {
        stepCallback.call(element, count, options);
      }
      
      if (currentStep < 1 && animating) {
        // Run loop
        requestAnimationFrame(step);
      } else {
        // Complete
        stop.call(this);
      }
    }
    
    
    function stop() {
      animating = false;
      var completeCallback = options.complete;
      if (typeof completeCallback === 'function') {
        completeCallback.call(element);
      }
    }
    
    // public methods
    
    this.resize = function() {
      resize.call(this);
    };
    
    this.getOption = function(name) {
      return getOption.call(this, name);
    };
    
    this.setOption = function(name, value) {
      setOption.call(this, name, value);
    };
    
    this.animate = function(value) {
      animate.call(this, value);
    };
    
    this.setOptions = function(opts) {
      var old = this.getOptions();
      $.extend(true, options, opts);
      if (options.value !== old.value) {
        start();
      }
    };
    
    this.getOptions = function() {
      return $.extend(true, {}, options);
    };
    
    // call init
    init.call(this);

  };
  

  // bootstrap plugin
  
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      var
        opts = $.extend(true, {}, options);
        countimator = $(this).data(pluginName);
      if (!countimator) {
        $(this).data(pluginName, new pluginClass(this, opts));
      } else {
        countimator.setOptions(opts);
      }
      return $(this);
    });
  };
  
  
  // style api
  var styles = {};
  $.fn[pluginName].registerStyle = function(name, def) {
    styles[name] = def; 
  };
  
  $.fn[pluginName].getStyle = function(name) {
    return styles[name];
  };
  

})( jQuery, window );