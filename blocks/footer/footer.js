import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const footer = document.createElement('div');
    footer.innerHTML = html;

    // get first and second child element
    const first = footer.firstElementChild;
    if (first) first.className = 'footer-social';
    const second = first.nextElementSibling;
    if (second) {
      second.className = 'footer-links';
      const items = second.querySelectorAll('li');
      // iterate over items and add an element after each, except for the last one
      items.forEach((item, i) => {
        if (i < items.length - 1) {
          const span = document.createElement('span');
          span.className = 'footer-link-separator';
          span.textContent = ' · ';
          item.after(span);
        }
        const link = item.querySelector('a');
        if (link) link.className = 'navigation';
      });
    }

    decorateIcons(footer);
    block.append(footer);
  }
}
