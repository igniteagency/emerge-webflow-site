import { animatedDetailsAccordions } from '$components/accordions';
import Dialog from '$components/dialog';
import { setCurrentYear } from '$utils/current-year';
import '$utils/disable-webflow-scroll';
import { disableWebflowAnchorSmoothScroll } from '$utils/disable-webflow-scroll';
import handleExternalLinks from '$utils/external-link';
import addMainElementId from '$utils/main-element-id';
import { duplicateMarqueeList } from '$utils/marquee-list';
import { initGoogleTranslate } from '$components/google-translate';
import { navbarScrollToggle } from '$components/nav-scroll';

window.Webflow = window.Webflow || [];
window.Webflow?.push(() => {
  setTimeout(() => {
    const webflow = window.Webflow as any;
    window.WF_IX = webflow?.require?.('ix3');
    console.debug('Webflow IX3 globalised:', window.WF_IX);
  }, 100);

  // Set current year on respective elements
  setCurrentYear();
  addMainElementId();
  handleExternalLinks();

  initComponents();
  UIFunctions();
  webflowOverrides();

  loadScrollTimelineCSSPolyfill();
});

function initComponents() {
  new Dialog();
  initGoogleTranslate();
}

function UIFunctions() {
  navbarScrollToggle();
  duplicateMarqueeList();
  animatedDetailsAccordions();
  window.conditionalLoadScript('[data-el="counter"]', 'components/counter.js');
  window.conditionalLoadScript('[data-slider-el="component"]', 'components/slider.js');
}

function webflowOverrides() {
  disableWebflowAnchorSmoothScroll();
}

function loadScrollTimelineCSSPolyfill() {
  window.loadScript('https://flackr.github.io/scroll-timeline/dist/scroll-timeline.js');
}
