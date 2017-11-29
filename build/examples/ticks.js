(function () {
  new CgSlider({
    container: 'ticks_slider',
    initialValue: 22,
    max: 50,
    ariaLabel: 'slider with ticks',
    ticks: true
  });

  new CgSlider({
    container: 'custom_ticks_slider',
    initialValue: 5,
    max: 15,
    ariaLabel: 'slider with custom ticks',
    ticks: function (tick, step, offsetPercent) {
      if ([1, 4, 6, 9, 11, 14].indexOf(step) > -1) {
        return false;
      }

      if (step % 5 === 0) {
        tick.style.height = '10px';
        tick.style.marginTop = '-4px';
        tick.style.backgroundColor = 'black';
      }
    }
  });
})();