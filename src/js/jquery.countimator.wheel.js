(function ( $, window ) {

  function arcPath(cx, cy, r, sAngle, eAngle, counterclockwise) {
    counterclockwise = typeof counterclockwise === 'boolean' ? counterclockwise : false;
    sAngle-= Math.PI / 2;
    eAngle-= Math.PI / 2;
    var
      d = 'M ' + cx + ', ' + cy,
      cxs,
      cys,
      cxe,
      cye;
    if (eAngle - sAngle === Math.PI * 2) {
      // Circle
      d+= ' m -' + r + ', 0 a ' + r + ',' + r + ' 0 1,0 ' + (r * 2) + ',0 a ' + r + ',' + r + ' 0 1,0 -' + (r * 2) + ',0';
    } else {
      cxs = cx + Math.cos(sAngle) * r;
      cys = cy + Math.sin(sAngle) * r;
      cxe = cx + Math.cos(eAngle) * r;
      cye = cy + Math.sin(eAngle) * r;
      d+= " L" + cxs + "," + cys +
        " A" + r + "," + r + " 0 " + (eAngle - sAngle > Math.PI ? 1 : 0) + "," + (counterclockwise ? 0 : 1) +
        " " + cxe + "," + cye + " Z";
    }
    return d;
  }

  var wheelStyle = {
    render: function(count, options) {
      var
        radius = 200,
        min = options.min ? parseFloat(options.min) : 0,
        max = options.max ? parseFloat(options.max) : 0,
        cx = radius,
        cy = radius,
        r = radius,
        p = (count - min) / (max - min),
        a = p * Math.PI * 2,
        d = arcPath(cx, cy, r + 1, 0, a),
        $graphics = $(this).find('> .counter-wheel-graphics'),

        $content = $(this).find('> .counter-wheel-content');
      
      count = Math.min(max, Math.max(min, count));
      
      if (!$content.length) {
        $(this).prepend($(this).wrapInner('<div class="counter-wheel-content"></div>'));
      }
      
      if (!$graphics.length) {
        $graphics = $(
          '<svg preserveAspectRatio="none" class="counter-wheel-graphics" viewBox="0 0 ' + radius * 2 + ' ' + radius * 2 + '">' + 
            '<path class="counter-wheel-highlight" d="M0 0" fill="teal"/>' + 
          '</svg>'
        );
        $(this).prepend($graphics);
      }
      
      $graphics.find('path').attr('d', d);
      
    }
  };
  
  if (!$.fn.countimator) {
    throw 'Include countimator script before style-plugin';
  }

  // Add custom style to plugin registry
  $.fn.countimator.registerStyle('wheel', wheelStyle);

})(jQuery, window);