export default function decorate(block) {
  const h2 = block.querySelector('h2');
  const [pictureFull, pictureMobile] = block.querySelectorAll('picture');
  block.textContent = '';
  block.append(pictureFull);
  block.append(h2);
  block.append(pictureMobile);
}
