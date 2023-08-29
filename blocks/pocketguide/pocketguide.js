/**
 * loads and decorates the pocketguide
 * @param {Element} block The pocketguide block element
 */
export default async function decorate(block) {
  block.textContent = '';

  const resp = await fetch('/templates/pocketguide.plain.html', window.location.pathname.endsWith('/templates/pocketguide') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();
    const pocketguide = document.createElement('div');
    pocketguide.innerHTML = html;
    block.append(pocketguide);
  }
}
