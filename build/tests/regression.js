/**
 * #13 Smaller min value
 */
(function () {
  var valueElement = document.querySelector('#sliderValue');
  var slider = new CgSlider({
    container: 'slider',
    min: 5,
    max: 10,
    step: 1,
    initialValue: 6
  });
  slider.on(CgSlider.EVENTS.CHANGE, updateValue);
  updateValue();

  document.querySelector('#newLimits').addEventListener('click', () => {
    setLimit(0.3, 1.1, 0.1, 1);
  });

  function updateValue() {
    valueElement.innerHTML = slider.value;
  }

  function setLimit(min, max, step, val) {
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = val;
  }
})();

/**
 * #8 text aria-* attributes bug
 */
(function () {
  var slider = new CgSlider({
    container: 'sliderAria',
    min: 1,
    max: 5,
    step: 1,
    initialValue: 1,
    ariaLabel: 'Aria label',
    ariaLabelledBy: 'some-label-id',
    ariaDescribedBy: 'some-desc-id'
  });

  document.querySelector('#newArias').addEventListener('click', () => {
    slider.ariaLabel = 'New aria label';
    slider.ariaLabelledBy = 'new-label-id';
    slider.ariaDescribedBy = 'new-desc-id';
  });
})();