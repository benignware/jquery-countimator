(function ( $, window ) {

  function ellipse(ctx, x, y, rx, ry, a1, a2){
    a1 = a1 || 0;
    a2 = a2 || Math.PI * 2;
    if (rx == ry) {
      ctx.arc(x, y, rx, a1, a2, false);  
    } else {
      ctx.save(); // save state
      ctx.beginPath();
      ctx.translate(x - rx, y - ry);
      ctx.scale(rx, ry);
      ctx.arc(1, 1, 1, a1, a2, false);
      ctx.restore(); // restore to original state
    }
  }

  var wheelStyle = {
      
    resize: function(element, width, height) {
      var $element = $(element);
      $element.css({
        // change some styles
      });
    }, 
      
    draw: function(canvas, count) {
    
      var ctx = canvas.getContext("2d");
    
      // draw
      var max = this.getOption('max');
      
      var rad = (count / max) * Math.PI * 2;
      rad = !isNaN(rad) ? rad : 0; 
      
      var lineWidth = this.getOption('lineWidth');

      var width = canvas.width;
      var height = canvas.height;
      
      var x = width / 2;
      var y = height / 2;
      
      var rx = width / 2 - lineWidth / 2;
      var ry =  height / 2 - lineWidth / 2;
      
      var r = Math.min(rx, ry);
      
      ctx.lineWidth = lineWidth;
      
      ctx.beginPath();                  
      ctx.strokeStyle = this.getOption('maxColor');
      ellipse(ctx, x, y, rx, ry);
      ctx.stroke();
      
      ctx.beginPath();         
      ctx.strokeStyle = this.getOption('valueColor');
      ellipse(ctx, x, y, rx, ry, Math.PI * 2 - Math.PI / 2, Math.PI * 2 - Math.PI / 2 + rad);
      ctx.stroke();
    
    }
  };

  if (!$.fn.countimator) {
    throw 'Include countimator script before style-plugin';
  }

  $.fn.countimator.registerStyle('wheel', wheelStyle);

})(jQuery, window);