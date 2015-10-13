jquery-countimator
==================

> Animated counter

## Usage

Include dependencies.

```html
<script src="http://code.jquery.com/jquery-1.11.2.min.js"></script>
<script src="jquery.countimator.min.js"></script>
```

```js
$(function() {
  $(".counter").countimator();
});
```

```html
You got to count it <span class="counter counter-default badge">1000</span> times
```

### Using inline html
```html
<span class="counter counter-default">
 You achieved <span class="counter-count badge">120</span>
 out of <span class="counter-max badge">1000</span> points
</span>
```

### Using a template-engine
Countimator supports templates with [Handlebars](http://handlebarsjs.com/) 

Include handlebars as dependency:

```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.3/handlebars.min.js"></script>
```

You may apply a template in three different ways:

* Using the template-option
* Using an inline template
* Using a selector

#### Using the template-option
```html+handlebars
<div class="counter counter-default" 
  data-value="120" 
  data-max="1000" 
  data-template="You achieved <span class='badge'>{{count}}</span> out of <span class='badge'>{{max}}</span> points.">
</div>
```

#### Using an inline template
```html+handlebars
<div class="counter counter-default" 
  data-value="120" 
  data-max="1000">
 <script type="text/x-handlebars-template">
   You achieved <span class="badge">{{count}}</span> out of <span class="badge">{{max}}</span> points.
 </script>
</div>
```

#### Using a selector
```html+handlebars
<div class="counter counter-default" 
  data-template="#counter-template" 
  data-value="120" 
  data-max="1000">
</div>
<script id="counter-template" type="text/x-handlebars-template">
   You achieved <span class="badge">{{count}}</span> out of <span class="badge">{{max}}</span> points.
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

## Callbacks

Get notified when animation changes by providing a callback function to `start`, `step` or `complete`-option.

```html
<div class="counter-callbacks" 
  data-duration="2500" 
  data-value="120" 
  data-pad="3"
  data-highscore="65">
  You achieved <span class="counter-count">0</span> out of <span class="badge counter-max">1000</span> points.
</div>
```

```css
.counter-callbacks {
  transition: all 0.5s ease-out; 
  position: relative;
  top: 0;
  opacity: 1;
}
.counter-callbacks:after {
  transition: all 0.5s ease-out;
  opacity: 0;
  content: "New Highscore!";
  font-size: 60%;
  vertical-align: top;
  background: #ddd;
  border-radius: 4px;
  padding: 4px;
}
.counter-callbacks.highscore:after {
  opacity: 1;
}
.counter-callbacks.highscore {
  color: teal;
}
.counter-callbacks.running,
.counter-callbacks.complete {
  font-size: 22px;
}
.counter-callbacks.complete {
  top: -1em;
  opacity: 0;
  transition-duration: 2s;
  transition-delay: 1s;
}
```

```js
$('.counter-callbacks').countimator({
  start: function(count, options) {
    $(this).toggleClass('running');
  },
  step: function(count, options) {
    $(this).toggleClass('highscore', count > $(this).data('highscore'));
  },
  complete: function() {
    $(this).toggleClass('running');
    $(this).toggleClass('complete');
  }
});
```


## Wheel

Countimator is shipped with a custom wheel-style.

Add the wheel-plugin after jquery.countimator.js
```html
<script src="jquery.countimator.wheel.min.js"></script>
```

The appearance of the wheel can be customized using tradional css. See the following code for an example of using the wheel-plugin with callbacks and custom styles:


Provide counter markup
 
```html
<div class="counter-wheel" 
 data-style="wheel" 
 data-max="12" 
 data-value="10" 
 data-pad="2">
   <span class="counter-count">0</span><hr/><span class="counter-max">12</span>
</div>
```

Initialize countimator with callbacks
```js
$(function() {
  $('.counter-wheel').countimator({
    step: function(count, options) {
      var
        p = count / options.max;
      $('.counter-wheel').toggleClass('counter-level-ok', p >= 0.75);
      $('.counter-wheel').toggleClass('counter-level-warn', p >= 0.1 && p < 0.75);
      $('.counter-wheel').toggleClass('counter-level-critical', p < 0.1);
    }
  });
});
```

```css
.counter-wheel path {
  fill: red;
  transition: all 0.25s ease-in;
} 
.counter-wheel .counter-count {
  color: red;
  transition: all 0.25s ease-in;
}
.counter-level-warn path {
  fill: orange;
}
.counter-level-warn .counter-count {
  color: orange;
}
.counter-level-ok path {
  fill: green;
}
.counter-level-ok .counter-count {
  color: green;
}
```


## Options

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>animateOnAppear</td>
      <td>Specifies whether to start animation when scrolled into view. Defaults to `true`</td>
    </tr>
    <tr>
      <td>animateOnInit</td>
      <td>Specifies whether to start animation when initialized. Defaults to `true`</td>
    </tr>
    <tr>
      <td>complete</td>
      <td>Callback function to be executed when animation completes.</td>
    </tr>
    <tr>
      <td>count</td>
      <td>Current animation count. Updated on step. Defaults to `0`</td>
    </tr>
    <tr>
      <td>countSelector</td>
      <td>Specifies the selector of count element. Defaults to `'.counter-count'`</td>
    </tr>
    <tr>
      <td>decimals</td>
      <td>Specifies the number of decimals for number formatting. Defaults to `0`</td>
    </tr>
    <tr>
      <td>decimalDelimiter</td>
      <td>Specifies a decimal separator for number formatting. Defaults to `.`</td>
    </tr>
    <tr>
      <td>duration</td>
      <td>Specifies the animation duration in milliseconds. Defaults to `1400`</td>
    </tr>
    <tr>
      <td>engine</td>
      <td>Specifies the template engine to use. `Handlebars` used, if defined</td>
    </tr>
    <tr>
      <td>max</td>
      <td>Specifies the maximum value of the animation. Defaults to `0`</td>
    </tr>
    <tr>
      <td>maxSelector</td>
      <td>Specifies the selector of maximum element. Defaults to `'.counter-max'`</td>
    </tr>
    <tr>
      <td>min</td>
      <td>Specifies the minimum value of the animation. Defaults to `null`</td>
    </tr>
    <tr>
      <td>pad</td>
      <td>Specifies the number of digits to be padded with leading zeros</td>
    </tr>
    <tr>
      <td>start</td>
      <td>Callback function to be executed when animation starts.</td>
    </tr>
    <tr>
      <td>step</td>
      <td>Callback function to be executed when animation on animation step.</td>
    </tr>
    <tr>
      <td>style</td>
      <td>Specifies a custom style. Either provide a string identifier of a predefined style or an object containing a `render`-method.</td>
    </tr>
    <tr>
      <td>template</td>
      <td>Either specifies an inline-template or a selector for dom-template.</td>
    </tr>
    <tr>
      <td>thousandDelimiter</td>
      <td>Specifies a thousand delimiter for number formatting. Defaults to `null`</td>
    </tr>
    <tr>
      <td>value</td>
      <td>Specifies the target value of the animation. Defaults to `null`</td>
    </tr>
  </tbody>
</table>