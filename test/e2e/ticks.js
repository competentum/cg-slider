import {Selector} from 'testcafe';

const PAGE_URL = 'http://localhost:4000';
const SIMPLE_TICKS_SLIDER = '#ticks_slider';
const SIMPLE_TICKS_SELECTOR = `${SIMPLE_TICKS_SLIDER} .cg-slider-ticks .cg-slider-tick`;
const CUSTOM_TICKS_SLIDER = '#custom_ticks_slider';
const CUSTOM_TICKS_SELECTOR = `${CUSTOM_TICKS_SLIDER} .cg-slider-ticks .cg-slider-tick`;

fixture('Check ticks count:')
  .page(PAGE_URL);

test('Simple ticks', async t => {
  await t
    .expect(Selector(SIMPLE_TICKS_SLIDER).exists).ok()  
    .expect(Selector(SIMPLE_TICKS_SELECTOR).count).eql(26, 'Simple ticks number should be equal to the: number of steps+1');
});

test('Custom ticks', async t => {
  await t
    .expect(Selector(CUSTOM_TICKS_SLIDER).exists).ok()  
    .expect(Selector(CUSTOM_TICKS_SELECTOR).count).eql(10, 'Custom ticks number should be equal to the: number of steps-skipped ticks+1');
});