# cg-slider

> JavaScript Accessible Slider Component by [Competentum Group](http://competentum.com/).
  Exported as a [UMD](https://github.com/umdjs/umd) module.

[![NPM][npm-image]][npm-url]

## Contents
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
    - [Static properties](#static-properties)
    - [Constructor](#constructor)
    - [Instance properties](#instance-properties)
    - [Instance methods](#instance-methods)


## Installation
Component can be installed with npm:
```
npm install --save cg-slider
```

## Usage
to be described

## API

### Static properties

- `EVENTS` *{Object}* Events which slider can emit.
    - `CHANGE` - Emits when slider value is changed.
    - `START_CHANGE` - Emits when slider value is started to change (when the user starts dragging).
    - `STOP_CHANGE` - Emits when slider value is stopped to change (when a drag operation is being ended).

Slider `value` is passed as argument to callback functions of these events.
See [slider.on](#method_on) method to know how to use events.

<a name="constructor"></a>
### new CgSlider(settings, [element]) - constructor

- `settings` *{Object}* Set of configurable options to set on the slider. Can have the following fields:
    - `min` *{number}* Minimum slider value. Default: `0`.
    - `max` *{number}* Maximum slider value. Default: `100`.
    - `step` *{number}* Default: `1`.
- `element` *{Element | string}* Root element (or id) of the slider instance. If this argument is not defined (or element with passed id does not exist) element will be created automatically. After initialization this element can be accessed via `slider.domElement` property.

### Instance properties
to be described

#### DOM Elements
to be described

### Instance methods
to be described

#### `.getValue()`
Returns current slider value.
#### `.setValue(newValue, [animate = true], [forceRedraw = false])`
- `newValue` *{number | number[]}* New slider value.
- `animate` *{boolean}* If `true` handles will be moved with animation.
- `forceRedraw` *{boolean}* Redraw slider even if value has not changed.

Sets `newValue` to slider. For simple slider `newValue` should be *number*. For range slider it should be array of two numbers first of which must be less than the second one.

<a name="method_on"></a>
#### `.on(eventName, listener)`
- `eventName` *{string}* The name of the event.
- `listener` *{Function}* The callback function.

Adds the `listener` function to the end of the listeners array for the event named `eventName`. No checks are made to see if the listener has already been added. Multiple calls passing the same combination of eventName and listener will result in the listener being added, and called, multiple times.

```javascript
slider.on(CgSlider.EVENTS.CHANGE, function (value) {
    console.log('Slider value was changed to:', value);
});
```

> Current class extends Node.js EventEmitter. More information about working with events you can get [here](https://nodejs.org/api/events.html).



[npm-url]: https://www.npmjs.com/package/cg-slider
[npm-image]: https://img.shields.io/npm/v/cg-slider.svg