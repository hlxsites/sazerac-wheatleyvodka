export default async function decorate() {
  const loader = document.createElement('div');
  loader.className = 'locator-loader';
  const locator = document.createElement('div');
  locator.className = 'wheatley-mikmak';
  locator.style = 'visibility: hidden';
  locator.dataset.mikmakUpcs = '088004019761,088004022686,088004027834,088004022679,088004034184,088004034191,088004040574';
  // split main into two parts
  const main2 = document.createElement('main');
  const section = document.querySelector('.section.locator-container');
  // move all siblings of section into main2
  while (section.nextSibling) {
    const s = section.nextSibling;
    s.style = '';
    main2.appendChild(s);
  }
  // append loader before section
  section.before(loader);
  // remove section
  section.remove();
  // append locator after main
  const main = document.querySelector('main');
  main.after(locator);
  locator.after(main2);
}
