import { Selector } from 'testcafe';

const PAGE_URL = 'http://localhost:4000';
const SLIDER_VALUE = '#sliderValue_steps';
const SLIDER_BTN_BACK = '#stepBack'; // -5
const SLIDER_BTN_FORWARD = '#stepForward'; // +10

const getSliderValue = (selector) => Selector(selector).innerText;

fixture('Move API:')
  .page(PAGE_URL);

test('Correct increment/decrement', async t => {
  await t
    .expect(getSliderValue(SLIDER_VALUE)).eql('50', 'Initial value must be 50')
    .click(SLIDER_BTN_FORWARD)
    .expect(getSliderValue(SLIDER_VALUE)).eql('60', 'Value after moving forward must be 60')
    .click(SLIDER_BTN_BACK)
    .click(SLIDER_BTN_BACK)
    .click(SLIDER_BTN_BACK)
    .expect(getSliderValue(SLIDER_VALUE)).eql('45', 'Value after moving back 3 times must be 45');
});
