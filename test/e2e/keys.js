import {Selector} from 'testcafe';

const PAGE_URL = 'http://localhost:4000';
const SIMPLE_SLIDER_HANDLE_SELECTOR = '#slider .cg-slider-handle-max';

/**
 * Focus simple slider handle
 * @param t - Test Controller object
 * @returns {Promise.<void>}
 */
async function focusHandle(t) {
  await t.click(SIMPLE_SLIDER_HANDLE_SELECTOR);
  return t;
}

function getSimpleSliderValue() {
  return Selector('#sliderValue').innerText;
}

fixture('Check Keys Actions:')
  .page(PAGE_URL)
  .beforeEach(focusHandle);

test('Left', async t => {
  await t
    .pressKey('left')
    .expect(getSimpleSliderValue()).eql('49', 'Should be reduced by a step value');
});

test('Right', async t => {
  await t
    .pressKey('right')
    .expect(getSimpleSliderValue()).eql('51', 'Should be increased by a step value');
});

test('Down', async t => {
  await t
    .pressKey('down')
    .expect(getSimpleSliderValue()).eql('49', 'Should be reduced by a step value');
});

test('Up', async t => {
  await t
    .pressKey('up')
    .expect(getSimpleSliderValue()).eql('51', 'Should be increased by a step value');
});

test('Home', async t => {
  await t
    .pressKey('home')
    .expect(getSimpleSliderValue()).eql('0', 'Should be equal to minimum value');
});

test('End', async t => {
  await t
    .pressKey('end')
    .expect(getSimpleSliderValue()).eql('100', 'Should be equal to maximum value');
});

test('Page down', async t => {
  await t
    .pressKey('pagedown')
    .expect(getSimpleSliderValue()).eql('0', 'Should be equal to minimum value');
});

test('Page up', async t => {
  await t
    .pressKey('pageup')
    .expect(getSimpleSliderValue()).eql('100', 'Should be equal to maximum value');
});

test('Check all modifying keys sequentially', async t => {
  await t
    .pressKey('left')
    .expect(getSimpleSliderValue()).eql('49', '[Left] Should be reduced by a step value')

    .pressKey('down')
    .expect(getSimpleSliderValue()).eql('48', '[Down] Should be reduced by a step value')

    .pressKey('right')
    .expect(getSimpleSliderValue()).eql('49', '[Right] Should be increased by a step value')

    .pressKey('up')
    .expect(getSimpleSliderValue()).eql('50', '[Up] Should be increased by a step value')

    .pressKey('home')
    .expect(getSimpleSliderValue()).eql('0', '[Home] Should be equal to minimum value')

    .pressKey('end')
    .expect(getSimpleSliderValue()).eql('100', '[End] Should be equal to maximum value')

    .pressKey('pagedown')
    .expect(getSimpleSliderValue()).eql('0', '[Page Down] Should be equal to minimum value')

    .pressKey('pageup')
    .expect(getSimpleSliderValue()).eql('100', '[Page Up] Should be equal to maximum value');
});