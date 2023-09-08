import { decorateButtons, decorateIcons, toClassName } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  block.textContent = '';

  const resp = await fetch('/templates/buy.plain.html', window.location.pathname.endsWith('/templates/buy') ? { cache: 'reload' } : {});

  if (!resp.ok) return;

  const html = await resp.text();
  block.innerHTML = html;
  block.querySelectorAll('.buy-template > div').forEach((row) => {
    if (row.children) {
      const cols = [...row.children];
      let blockLevel = false;
      if (cols[1]) {
        const col = cols[1];
        const name = toClassName(cols[0].textContent);
        col.classList.add(name);
        blockLevel = name.startsWith('block-');
      }
      row.replaceWith(cols[1]);
      if (blockLevel) {
        cols[1].parentElement.parentElement.append(cols[1]);
      }
    } else {
      row.remove();
    }
  });
  decorateButtons(block);
  const buttons = document.createElement('div');
  buttons.classList.add('buttons');
  buttons.append(...block.querySelectorAll('.button-container'));
  block.querySelector('.title').insertAdjacentElement('afterend', buttons);
  block.querySelector('.buy-link').append(block.querySelector('.buy-link-image'));
  block.querySelector('.locator-link').append(block.querySelector('.locator-link-image'));
  await decorateIcons(block);
}
