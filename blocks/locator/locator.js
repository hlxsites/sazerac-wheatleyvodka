export default async function decorate(block) {
  block.textContent = '';
  const d = document.createElement('div');
  d.className = 'wheatley-mikmak';
  d.style = 'display: none';
  d.dataset.mikmakUpcs = '088004019761,088004022686,088004027834,088004022679,088004034184,088004034191,088004040574';
  block.appendChild(d);
  const s = document.createElement('script');
  s.src = '/blocks/locator/locator-init.js';
  s.async = true;
  document.body.appendChild(s);
}
