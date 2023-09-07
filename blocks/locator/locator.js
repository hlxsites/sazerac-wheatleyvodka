export default async function decorate() {
  // create locator div
  const locator = document.createElement('div');
  locator.className = 'wheatley-mikmak';
  locator.style = 'visibility: hidden';
  locator.dataset.mikmakUpcs = '088004019761,088004022686,088004027834,088004022679,088004034184,088004034191,088004040574';
  // append locator before section
  const section = document.querySelector('.section.locator-container');
  section.before(locator);
  // remove section
  section.remove();
}
