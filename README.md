jquery-countimator
==================

> Animated counter

Basic Usage
-----------

```js
$(function() {
  $(".counter").countimator();
});
```

```html
You got to count it <span class="counter counter-default badge">20</span> times
```

### Using inline html
```html
<span class="counter counter-default">
 You achieved <span class="counter-count badge">1430</span>
 out of <span class="counter-max badge">150</span> points
</span>
```

### Using a template-engine
Countimator supports template-engines that follow the compile-pattern such as Handlebars.

You may apply a template in three different ways:

* Using the template-option
* Using an inline template
* Using a selector

#### Using the template-option
```html
<span class="counter counter-default" 
  data-value="120" 
  data-max="1000" 
  data-template="You achieved <span class='badge'>{{count}}</span> out of <span class='badge'>{{max}}</span> points.">
</span>
```

#### Using an inline template
```html
<span class="counter counter-default" 
  data-value="120" 
  data-max="1000">
 <script type="text/x-handlebars-template">
   You achieved <div class="badge">{{count}}</div> out of <div class="badge">{{max}}</div> points.
 </script>
</span>
```

#### Using a selector
```html
<span class="counter counter-default" 
  data-template="#counter-template" 
  data-value="120" 
  data-max="1000">
</span>
<script id="counter-template" type="text/x-handlebars-template">
   You achieved <div class="badge">{{count}}</div> out of <div class="badge">{{max}}</div> points.
</script>
```

Number formatting
-----------------
Use the following options to format values used by countimator: `decimals`, `decimalDelimiter`,`thousandDelimiter`
```html
<span class="counter counter-default badge" 
  data-decimals="2" 
  data-decimal-delimiter="," 
  data-thousand-delimiter="." 
  data-value="12000.32" 
  data-template="{{count}} EUR">
</span>
```
Pad leading zeros by using the `pad`-option

```html
<span class="counter counter-default badge" 
  data-value="100" 
  data-pad="3" 
  data-template="{{count}} %">
</span>
```

Custom styles
-------------

Countimator has built-in support for drawing on a canvas-background.

You can customize the appearance of countimator by providing an object containing a render- and draw-method as `style`-option

### Wheel example

Countimator is shipped with a custom wheel-style.

Add the wheel-plugin after jquery.countimator.js as well as the basic css theme 
```html
<script src="../src/js/jquery.countimator.wheel.js"></script>
<link href="../src/css/countimator.wheel.css" rel="stylesheet">
```
Provide counter markup 
```html
<span class="counter counter-wheel" 
  data-style="wheel" 
  data-max="12" 
  data-value="8" 
  data-count="0">
  <script type="text/x-handlebars-template">
    {{count}} <hr/> {{max}}
  </script>
</span>
```

### Styling the wheel plugin
You can style the wheel plugin using traditional css and the `maxColor`-, `valueColor`- and `lineWidth`-options. 
Use the `verticalAlign`-option if you need to style the inner border.
           

```css
.counter.counter-wheel.counter-wheel-themed {
  background-color: transparent;
  border: none;
  color: #000;
  font-size: 20px;
  font-weight: bold;
  width: 150px;
}
```

```html
<div class="counter counter-wheel counter-wheel-themed" 
  data-style="wheel" 
  data-max="12" 
  data-value="8" 
  data-count="0" 
  data-pad="2" 
  data-value-color="#E71232" 
  data-max-color="#131432" 
  data-vertical-align="justify" 
  data-line-width="15">
  <script type="text/x-handlebars-template">
    <div>
      <div>your</div>
      <div class="counter-values">
        <span style="color: {{valueColor}}">{{count}}</span><span class="counter-separator">/</span><span style="color: {{maxColor}}">{{max}}</span>
      </div>
      <div>score</div>
    </div>
  </script>
</div>
```

