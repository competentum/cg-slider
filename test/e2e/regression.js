import { Selector } from 'testcafe';

const PAGE_URL = 'http://localhost:4000/e2e.html';
const SIMPLE_SLIDER_HANDLE_SELECTOR = '#slider .cg-slider-handle-max';

const getSliderValue = (selector) => Selector(selector).innerText;

fixture('Regression tests:')
  .page(PAGE_URL);

test('#16: smaller min value', async t => {
  await t
    .expect(getSliderValue('#sliderValue')).eql('6', 'Initial value must be 6')
    .click('#newLimits')
    .click(SIMPLE_SLIDER_HANDLE_SELECTOR)
    .expect(getSliderValue('#sliderValue')).eql('1', 'Value after setting new limits must be 1')
    .pressKey('left')
    .expect(getSliderValue('#sliderValue')).eql('0.9', 'Value after moving left must be 0.9');
});
