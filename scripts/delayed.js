// eslint-disable-next-line import/no-cycle
import { loadScript, sampleRUM } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// GTM
loadScript('/scripts/gtm-init.js', { defer: true });

// add more delayed functionality here
const curator = document.querySelector('main a[href="https://curator.io"]');

if (curator) {
  curator.parentElement.id = 'curator-feed-wheatley-vodka-layout';
  loadScript('https://cdn.curator.io/published/704d1255-1e66-44bb-b7a5-5d48cf42802c.js');
}

const mikmak = document.querySelector('body .wheatley-mikmak');
if (mikmak) {
  const loader = document.querySelector('.locator-loader');
  if (loader) loader.remove();
  mikmak.style = 'visibility: visable';
  // add script
  loadScript('/blocks/locator/locator-init.js', { defer: true });
}
