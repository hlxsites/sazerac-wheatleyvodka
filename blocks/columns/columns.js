import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      } else if (block.parentElement.parentElement.dataset.backgroundImage) {
        const div = document.createElement('div');
        div.classList.add('background-image');
        div.append(createOptimizedPicture(
          block.parentElement.parentElement.dataset.backgroundImage,
          '',
          false,
          [{ media: '(min-width: 750px)', width: '2000' }, { width: '450' }],
        ));
        col.prepend(div);
      }
    });
  });
}
