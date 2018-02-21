import { Selector } from 'testcafe';

const PAGE_URL = 'http://localhost:4000/e2e.html';
const SIMPLE_SLIDER_HANDLE_SELECTOR = '#slider .cg-slider-handle-max';
const ARIA_SLIDER_HANDLE_SELECTOR = '#sliderAria .cg-slider-handle-max';
const ARIA_BTN_ATTRS_SELECTOR = '#newArias';
const ARIA_LBL = 'Aria label';
const ARIA_LBLDBY = 'some-label-id';
const ARIA_DSCRBY = 'some-desc-id';
const ARIA_LBL_NEW = 'New aria label';
const ARIA_LBLDBY_NEW = 'new-label-id';
const ARIA_DSCRBY_NEW = 'new-desc-id';

const ATTR_ARIA_LBL = 'aria-label';
const ATTR_ARIA_LBLDBY = 'aria-labelledby';
const ATTR_ARIA_DSCRBY = 'aria-describedby';

const getSliderValue = (selector) => Selector(selector).innerText;
const getAttribute = (selector, attrName) => Selector(selector).getAttribute(attrName);

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

test('#8: Constructor ariaLabel and ariaLabelledBy settings are broken', async t => {
  await t
    .expect(getAttribute(ARIA_SLIDER_HANDLE_SELECTOR, ATTR_ARIA_LBL))
    .eql(ARIA_LBL, 'aria-label not set')
    .expect(getAttribute(ARIA_SLIDER_HANDLE_SELECTOR, ATTR_ARIA_LBLDBY))
    .eql(ARIA_LBLDBY, 'aria-labelledby not set')
    .expect(getAttribute(ARIA_SLIDER_HANDLE_SELECTOR, ATTR_ARIA_DSCRBY))
    .eql(ARIA_DSCRBY, 'aria-describedby not set')
    .click(ARIA_BTN_ATTRS_SELECTOR)
    .expect(getAttribute(ARIA_SLIDER_HANDLE_SELECTOR, ATTR_ARIA_LBL))
    .eql(ARIA_LBL_NEW, 'aria-label not changed')
    .expect(getAttribute(ARIA_SLIDER_HANDLE_SELECTOR, ATTR_ARIA_LBLDBY))
    .eql(ARIA_LBLDBY_NEW, 'aria-labelledby not changed')
    .expect(getAttribute(ARIA_SLIDER_HANDLE_SELECTOR, ATTR_ARIA_DSCRBY))
    .eql(ARIA_DSCRBY_NEW, 'aria-describedby not changed');
});
