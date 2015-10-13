(function ( $, window ) {

  function arcPath(cx, cy, r, sAngle, eAngle, counterclockwise) {
    counterclockwise = typeof counterclockwise === 'boolean' ? counterclockwise : false;
    sAngle-= Math.PI / 2;
    eAngle-= Math.PI / 2;
    var
      d = 'M ' + Math.round(cx) + ', ' + Math.round(cy),
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
        min = options.min ? parseFloat(options.min) : 0,
        max = options.max ? parseFloat(options.max) : 0,
        $svg = $(this).find('> svg.counter-wheel-container');
        
      if (!$svg.length) {
        $svg = $(
          '<svg class="counter-wheel-container" width="180" height="180">'
          + '<circle class="circle" cx="90" cy="90" r="90" fill="#ddd"/>'
          + '<circle class="circle" cx="90" cy="90" r="80" fill="#999"/>'
          + '<path class="level" d="M0 0" fill="blue"/>'
          + '<circle class="circle" cx="90" cy="90" r="60" stroke="#ddd" stroke-width="10" fill="white"/>'
          + '<g class="content" style="text-align: center">'
            + '<foreignObject x="45" y="45" width="90" height="90"></foreignObject>'
          + '</g>' + 
          '</svg>'
        );
        $content = $svg.find('foreignObject').append($(this).children());
        $(this).append($svg);
      }
      $svg.attr('viewBox', "0 0 " + $(this).width() + " " + $(this).height());
      
      var
        cx = 90,
        cy = 90,
        r = 80,
        p = (count - min) / (max - min),
        a = p * Math.PI * 2,
        d = arcPath(cx, cy, r, 0, a);
        
      $svg.find('path').attr('d', d);
    }
  };
  
  if (!$.fn.countimator) {
    throw 'Include countimator script before style-plugin';
  }

  // Add custom style to plugin registry
  $.fn.countimator.registerStyle('wheel', wheelStyle);

})(jQuery, window);