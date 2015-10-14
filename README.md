jquery-countimator
==================

> Animated counter

[Demo](http://benignware.github.io/jquery-countimator)

## Usage

Include dependencies.

```html
<script src="http://code.jquery.com/jquery-1.11.2.min.js"></script>
<script src="js/jquery.countimator.min.js"></script>
```

```js
$(function() {
  $(".counter").countimator();
});
```

```html
You got to count it <kbd class="counter counter-default">1000</kbd> times
```

### Using inline html
```html
<span class="counter counter-default">
 You achieved <kbd class="counter-count">120</kbd>
 out of <kbd class="counter-max">1000</kbd> points
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
  data-template="You achieved <kbd>{{count}}</kbd> out of <kbd>{{max}}</kbd> points.">
</div>
```

#### Using an inline template
```html+handlebars
<div class="counter counter-default" 
  data-value="120" 
  data-max="1000">
 <script type="text/x-handlebars-template">
   You achieved <kbd>{{count}}</kbd> out of <kbd>{{max}}</kbd> points.
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
   You achieved <kbd>{{count}}</kbd> out of <kbd>{{max}}</kbd> points.
</script>
```

Number formatting
-----------------
Use the following options to format values used by countimator: `decimals`, `decimalDelimiter`,`thousandDelimiter`
```html
<kbd class="counter counter-default" 
  data-decimals="2" 
  data-decimal-delimiter="," 
  data-thousand-delimiter="." 
  data-value="12000.32" 
  data-template="{{count}} EUR">0 EUR
</kbd>
```
Pad leading zeros by using the `pad`-option

```html
<kbd class="counter counter-default badge" 
  data-value="100" 
  data-pad="3" 
  data-template="{{count}} %">000 %
</kbd>
```

## Trigger update

To trigger the animation from an event at runtime, just call countimator again with a new value:

```html
<kbd class="counter counter-default" 
  data-decimals="2" 
  data-decimal-delimiter="," 
  data-thousand-delimiter="." 
  data-value="12000.32" 
  data-template="{{count}} EUR">0 EUR
</kbd>
<button id="update-counter">
  Want more?
</button>
```

```js
$('#update-counter').on('click', function() {
  $(this).fadeOut(500).prev().countimator({
    value: 22000.12
  });
}); 
```

## Callbacks

Get notified when animation changes by providing a callback function to `start`, `step` or `complete`-option.

```html
<div class="counter-callbacks" 
  data-duration="2500" 
  data-value="120" 
  data-pad="3"
  data-highscore="65">
  You achieved <kbd class="counter-count">0</kbd> out of <kbd class="counter-max">1000</kbd> points.
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
  -webkit-transition: all 0.5s ease-out;
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
<script src="js/jquery.countimator.wheel.min.js"></script>
```

Include the wheel stylesheet.

```html
<link rel="stylesheet" href="css/jquery.countimator.wheel.css"></link>
```

```html
<div class="counter counter-wheel" 
 data-style="wheel" 
 data-max="12" 
 data-value="10"
 data-count="0"  
 data-pad="2">0
</div>
```

```css
.counter-wheel {
  color: teal;
}
```

### Customize

See the following code for an example of using the wheel-plugin with styles, callbacks and triggers:

```html
<div class="counter-wheel counter-wheel-callbacks" 
 data-style="wheel" 
 data-max="12" 
 data-value="2" 
 data-pad="2">
  <div class="counter-wheel-content">
    <small>Your</small><br/>
    <div><span class="counter-count counter-wheel-highlight">00</span>/<span class="counter-max">12</span></div>
    <small>Score</small>
  </div>
</div>
<button>Click me!</button>
```

Customize appearance using css:

```css
.counter-wheel-callbacks {
  width: 200px;
  height: 200px;
  border-color: #ddd;
  border-width: 10px;
  background: #101433;
  text-transform: uppercase;
  font-family: inherit;
  font-size: 16px;
  padding: 15px;
  line-height: 28px;
}

.counter-wheel-callbacks .counter-wheel-content {
  background: #fff;
  color: #000;
}

.counter-wheel-callbacks .counter-wheel-content > div {
  font-weight: bold;
  font-size: 32px;
}

.counter-wheel-callbacks .counter-wheel-content > div > * {
  margin: 0 5px;
}

.counter-wheel-callbacks .counter-wheel-highlight {
  transition: all .25s ease-in;
  -webkit-transition: all .25s ease-in;
  color: #E71232;
}

.counter-level-warn .counter-wheel-highlight {
  color: orange;
}

.counter-level-ok .counter-wheel-highlight {
  color: green;
}
```

Initialize countimator with callbacks and register button listener
```js
$(function() {
  $('.counter-wheel-callbacks').countimator({
    step: function(count, options) {
      var
        p = count / options.max;
      $(this).toggleClass('counter-level-ok', p >= 0.5);
      $(this).toggleClass('counter-level-warn', p >= 0.25 && p < 0.5);
      $(this).toggleClass('counter-level-critical', p < 0.25);
    }
  });
  $('.counter-wheel-callbacks + button').on('click', function() {
    var countimator = $('.counter-wheel-callbacks').data('countimator');
    $(this).fadeOut(500).prev().countimator({
      value: 8
    });
  });
});
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