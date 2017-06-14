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
npm install cg-slider
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
### new CgSlider(settings) - constructor

- `settings` *{Object}* Set of configurable options to set on the slider. Can have the following fields:
    - `container` *{Element | string}* DOM Element or element id in which slider instance should be rendered. 
    This property can be omitted. In this case new DOM element will be created and can be accessed via `sliderInstance.container`
    - `disabled` *{boolean}* Disables the slider if set to true. Default: `false`.
    - `initialValue` *{number | number[]}* Value which will be set on initialization. 
    If this property is not defined minimum value will be set initially. 
    For the range slider value must be array of two numbers. 
    - `isRange` *{boolean}* Whether the slider represents a range.
    If set to true, the slider will detect if you have two handles and create a styleable range element between these two. 
    Default: `false`.
    - `min` *{number}* The minimum value of the slider. Default: `0`.
    - `max` *{number}* The maximum value of the slider. Default: `100`.
    - `tabindex` *{number | number[]}* Tabindex of handle element. It can be array of two numbers for the range slider. Default: `0`.
    - `step` *{number}* Determines the size or amount of each interval or step the slider takes between the min and max. 
    The full specified value range of the slider (max - min) should be evenly divisible by the step. Default: `1`.
    - `ariaLabel` *{string | string[]}* String that labels the current slider for screen readers. 
    It can be array of two strings for the range slider.
    For more info see [WAI-ARIA specification/#aria-label](https://www.w3.org/TR/wai-aria-1.1/#aria-label).
    - `ariaLabelledBy` *{string | string[]}* Id of the element that labels the current slider. It can be array of two strings for the range slider.
    This property has higher priority than `ariaLabel`.
    For more info see [WAI-ARIA specification/#aria-labelledby](https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby).
    - `ariaDescribedBy` *{string | string[]}* Id of the element that describes the current slider. It can be array of two strings for the range slider.
    This property has higher priority than `ariaLabel` and `ariaLabelledBy`.
    For more info see [WAI-ARIA specification/#aria-describedby](https://www.w3.org/TR/wai-aria-1.1/#aria-describedby).
    - `ariaValueTextFormatter` *{function(number):string}* Label formatter callback. It receives value as a parameter and should return corresponding label.
    For more info see [WAI-ARIA specification/#aria-valuetext](https://www.w3.org/TR/wai-aria-1.1/#aria-valuetext).

### Instance properties

#### `.ariaLabel` *{string | string[]}*
String that labels the current slider for screen readers. 
It can be array of two strings for the range slider.
For more info see [WAI-ARIA specification/#aria-label](https://www.w3.org/TR/wai-aria-1.1/#aria-label).

#### `.ariaLabelledBy` *{string | string[]}*
Id of the element that labels the current slider. It can be array of two strings for the range slider.
This property has higher priority than `ariaLabel`.
For more info see [WAI-ARIA specification/#aria-labelledby](https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby).

#### `.ariaDescribedBy` *{string | string[]}*
Id of the element that describes the current slider. It can be array of two strings for the range slider.
This property has higher priority than `ariaLabel` and `ariaLabelledBy`.
For more info see [WAI-ARIA specification/#aria-describedby](https://www.w3.org/TR/wai-aria-1.1/#aria-describedby).

#### `.ariaValueTextFormatter` *{function(number):string}*
Label formatter callback. It receives value as a parameter and should return corresponding label.
For more info see [WAI-ARIA specification/#aria-valuetext](https://www.w3.org/TR/wai-aria-1.1/#aria-valuetext).

#### `.container` *{Element}* (read only)
DOM element which contains the slider.
If it was not set through constructor's settings it can be added to the document after initialization.

#### `.disabled` *{boolean}*
Disables the slider if set to true

#### `.isRange` *{boolean}* (read only)
Whether the slider represents a range.
If set to true, the slider will detect if you have two handles and create a styleable range element between these two.

#### `.min` *{number}*
The minimum value of the slider.

#### `.max` *{number}*
The maximum value of the slider.

#### `.tabindex` *{number | number[]}*
Tabindex of handle element. It can be array of two numbers for the range slider.

#### `.step` *{number}*
Determines the size or amount of each interval or step the slider takes between the min and max. 
The full specified value range of the slider (max - min) should be evenly divisible by the step.

#### `.value` *{number | number[]}*
Current value of the slider.
For the simple slider `newValue` should be *number*.
For the range slider it should be array of two numbers the first of which must be less than the second one.

### Instance methods

#### `.getSetting(name)`
- `name` *{string}* Name of the setting.

Returns value of the specified setting. 
See available settings names in constructor's description (excluding container and value).

<a name="method_on"></a>
#### `.on(eventName, listener)`
- `eventName` *{string}* The name of the event.
- `listener` *{Function}* The callback function.

Adds the `listener` function to the end of the listeners array for the event named `eventName`. 
No checks are made to see if the listener has already been added. 
Multiple calls passing the same combination of eventName and listener will result in the listener being added, 
and called, multiple times.

```javascript
slider.on(CgSlider.EVENTS.CHANGE, function (value) {
    console.log('Slider value was changed to:', value);
});
```

> Current class extends Node.js EventEmitter. More information about working with events you can get [here](https://nodejs.org/api/events.html).

#### `.setSetting(name, value)`
- `name` *{string}* Name of the setting.
- `value` *{any}* New value.

Sets passed value to the specified setting. 
See available settings names in constructor's description (excluding container and value).

[npm-url]: https://www.npmjs.com/package/cg-slider
[npm-image]: https://img.shields.io/npm/v/cg-slider.svg?style=flat-square