(function ( $, window ) {
  
  var pluginName = 'countimator';
  
  var defaults = {
    duration: 1000, 
    value: null, 
    max: 0, 
    lineWidth: 8, 
    valueColor: "#aaeeff", 
    maxColor: "lightgray",  
    countSelector: '.counter-count', 
    maxSelector: '.counter-max', 
    style: null, 
    template: null, 
    engine: "auto", 
    animateOnInit: true, 
    animateOnAppear: true, 
    bodyClass: 'counter-body',
    // format options 
    decimals: 0, 
    decimalDelimiter: '.', 
    thousandDelimiter: null, 
    pad: false, 
    // appearance
    textAlign: '', 
    verticalAlign: 'middle'
  };
  
  var dataOpts = [
    "value", 
    "count", 
    "min", 
    "max", 
    "template", 
    "decimals", 
    "decimalDelimiter", 
    "thousandDelimiter", 
    "pad", 
    "style"
  ];
  
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
  
  function inView(el){
    var top = el.getBoundingClientRect().top, left = el.getBoundingClientRect().left, rect, el = el.parentNode;
    do {
        rect = el.getBoundingClientRect();
        if (top <= rect.bottom === false && left <= rect.right === false)
            return false;
        el = el.parentNode;
    } while (el != document.body);
    // Check its within the document viewport
    return top <= document.documentElement.clientHeight && left <= document.documentElement.clientWidth;
  };
  
  function isElementInViewport (el) {

    //special bonus for those using jQuery
    if (el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
  }

  // request animation frame
  // TODO: polyfill
  var requestAnimationFrame = 
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame || 
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };


  function detectEngine() {
    var engines = ['Handlebars', 'Mugine'];
    for (var i = 0, engine; engine = engines[i]; i++) {
      if (window[engine] && window[engine].compile) return engine;
    }
    return null;
  }

  var pluginClass = function Countimator(element, options) {
    
    var instance = this;
    var $element = $(element);
    
    options = $.extend({}, defaults, options, $element.data());
    
    // $(dataOpts).each(function(index, value) {
      // if (typeof $element.data(value) != 'undefined') {
        // options[value] = $element.data(value);
      // }
    // });
    
    var canvas, ctx, container, body;
    var startTime, startCount;
    var animating = false;
    
    
    // private methods
    function init() {
    
      var value = getOption('value');
      var count = getOption('count');
      var max = getOption('max');
    
      // init values
      if (!count) {
        var countNode = getCountNode();
        if (countNode) {
          var value = getOption('value');
          if (typeof value != 'number') {
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

      // init style
      var style = getOption('style');
      
      if (typeof style == "object") {
        if (typeof style.draw == "function") {
          
          canvas = document.createElement('canvas');
          if (canvas.getContext) {
            // is supported
            var contentNode = element.firstChild;
            body = $('<span class="' + getOption('bodyClass') + '"></span>');
            $element.append(body);
            body.append(contentNode);
            $(canvas).insertBefore(body);
          }
        }
      }
      
      // init listeners
      $(window).on('resize', function() {
        resize.call(instance);
      });
      
      
      $(window).on('scroll touchmove', function() {
        if (getOption('animateOnInit') && getOption('animateOnAppear') && isElementInViewport(element)) {
          $(window).off('scroll touchmove', arguments.callee);
          start.call(instance);
        }
      });
      
      // render.call(this);
      
      if (getOption('animateOnInit')) {
        if (getOption('animateOnAppear') && isElementInViewport(element)) {
          options.count = typeof count == 'number' ? count : 0; 
          start.call(instance);
        } else {
          render.call(this);
        }
      } else {
        options.count = getOption('value');
        render.call(this);
      }
      
      resize.call(this);
      
    };
    
    function setOption(name, value) {
      if (name == "style") return; // style cannot be set at runtime
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
        case 'style':
          value = $.fn.countimator.getStyle(value);
          break;
        case 'template':
          // try to find by selector
          try {
            value = $(value).html();
          } catch(e) {
            // not a valid selector
          }
          break;
      }
      return value;
    }
    
    function resize() {
      
      
      
      var $body = $element.find("." + this.getOption('bodyClass'));

      // reset element
      $element.css({
        textAlign: ''
      });
      
      var textAlign = this.getOption('textAlign') || $element.css('text-align');
      var verticalAlign = this.getOption('verticalAlign');
      
      $element.css({
        textAlign: textAlign
      });
      
      // TODO: replace canvas with background
      
      if (canvas) {
        
        $element.css({
          position: position != "static" ? position : 'relative' 
        });
        
        $(canvas).css({
          position: 'absolute',
          top: 0, 
          left: 0
        });
        
        // reset body
        $body.css({
          position: 'absolute', 
          top: "", 
          bottom: "",  
          left: "", 
          right: "", 
          textAlign: "", 
          display: 'none'
        });
        
        
        
      }
      
      
      var position = $element.css('position');
      var display = $element.css('display');

      var width = $element.width();
      var height = $element.height();
      
      var outerWidth = $element.outerWidth(false);
      var outerHeight = $element.outerHeight(false);
      
      
      if (canvas) {
        // vertical-align
        var paddingLeft = parseFloat($element.css('padding-left'));
        var paddingRight = parseFloat($element.css('padding-right'));
        var paddingTop = parseFloat($element.css('padding-top'));
        var paddingBottom = parseFloat($element.css('padding-top'));
        var top, bottom;
        if (verticalAlign == 'justify') {
          top = paddingTop; 
          bottom = paddingBottom;
        } else {
          var va = verticalAlign == 'top' ? 0 : verticalAlign == 'bottom' ? 1 : 0.5;
          top = paddingTop + ( height - $body.outerHeight(false) ) * va;
          bottom = 'auto';
        }
        
        $body.css({
          position: 'absolute', 
          top: top, 
          bottom: bottom,  
          left: paddingLeft, 
          right: paddingRight, 
          textAlign: textAlign, 
          display: ''
        });
        
      }
      
      var style = getOption('style');
      if (style && style.resize) {
        style.resize.call(instance, element, width, height);
      }
      
      if (canvas) {
        // resize canvas
        canvas.width = $element.innerWidth();
        canvas.height = $element.innerHeight();
      }
      
      draw.call(this);
      
    };
    
    function animate(value) {
      options.value = value;
      if (!animating) {
        start();
      } else {
        // TODO: stretch duration
      }
    }
    
    function start() {
      startTime = new Date().getTime();
      startCount = getOption('count');
      animating = true;
      requestAnimationFrame(step);
    }
    
    function getCountNode(count) {
      var countElement = $element.find(options.countSelector)[0];
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
      var decimals = getOption('decimals');
      var decimalDelimiter = getOption('decimalDelimiter');
      var thousandDelimiter = getOption('thousandDelimiter');
     
      string = formatNumber(value, decimals, decimalDelimiter, thousandDelimiter);
      
      // pad
      string = pad(string, getOption('pad'));
      
      return string;
    }
    
    
    function render() {
    
      var max = getOption('max');
      var min = getOption('min');
      var value = getOption('value');
      var count = getOption('count');
      
      var formattedCount = getFormattedValue(count);
      var formattedValue = getFormattedValue(value);
      var formattedMax = getFormattedValue(max);
      var formattedMin = getFormattedValue(min);
      
      var engine = getOption('engine');
      engine = engine && engine != 'auto' ? engine : detectEngine(); 
      engine = typeof engine == "string" ? window[engine] : engine;
      
      var template = getOption('template');
      var string;
      
      if (engine && template) {
        
        // template engine
        var tmpl = engine.compile(template);
        
        if (tmpl) {
          var tmplData = $.extend({}, options, {count: formattedCount, value: formattedValue, max: formattedMax, min: formattedMin});
          string = tmpl(tmplData);
        }
        var div = document.createElement('div');
        div.innerHTML = string;
        var nodeList = div.childNodes; 
        
        if (body) {
          $(body).empty();
          $(body).append(nodeList);
        } else {
          $(element).contents().not(container).remove();
          $(element).append(nodeList);
        }
        
      } else {
      
        // classic approach without template engine
        
        string = formattedCount;
        
        // set count
        var countNode = getCountNode();
        if (countNode) {
          countNode.nodeValue = formattedCount;
        }
        // set max (there will be no max-node when using templates)
        var maxNode = getMaxNode();
        if (maxNode) {
          maxNode.nodeValue = formattedMax;
        }
        
        if (!countNode && !maxNode) {
          element.innerHTML = formattedCount;
        }
      
      }
      
      var style = getOption('style');
      if (style && style.render) {
        style.render.call(instance, count);
      }
      
      // draw
      draw.call(this);
        
    }

    function draw() {
      var count = getOption('count');
      var style = getOption('style');
      if (style && style.draw && canvas && canvas.getContext) {
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        style.draw.call(instance, canvas, count);
      }
    }

    function step() {
        
        var duration = getOption('duration');
        var max = getOption('max');
        var value = getOption('value');
        
        var currentTime = new Date().getTime();
        var endTime = startTime + duration;
        
        var currentStep = Math.min((duration - (endTime - currentTime)) / duration, 1);
        
        var count = startCount + currentStep * (value - startCount);
        
        options.count = count;
        
        render.call(this);
        
        if (currentStep < 1 && animating) {
        
          requestAnimationFrame(step);
          
        } else {
        
          end.call(this);
        }
        
    }
    
    
    function end() {
      animating = false;
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
    
    // call init
    init.call(this);

  };
  

  // bootstrap plugin
  
  $.fn[pluginName] = function(options) {
      
    return this.each(function() {

      if (!$(this).data(pluginName)) {
        $(this).data(pluginName, new pluginClass(this, options));
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