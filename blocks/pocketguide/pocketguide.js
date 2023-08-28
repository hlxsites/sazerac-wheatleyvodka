import { readBlockConfig } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the pocketguide
 * @param {Element} block The pocketguide block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  const footerPath = cfg.footer || '/cocktails/pocketguide';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/cocktails/pocketguide') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const pocketguide = document.createElement('div');
    pocketguide.innerHTML = html;
    block.append(pocketguide);
  }
}
