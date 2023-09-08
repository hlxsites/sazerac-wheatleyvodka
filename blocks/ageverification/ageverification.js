import { createOptimizedPicture, decorateIcons } from '../../scripts/lib-franklin.js';
import { setCookie } from '../../scripts/scripts.js';
/* age verification overlay */

export default async function decorate(block) {
  block.textContent = '';

  const resp = await fetch('/templates/verification.plain.html', window.location.pathname.endsWith('/templates/verification') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();
    block.innerHTML = html;

    const picture = block.querySelector('picture');
    if (picture.parentElement.tagName === 'P') {
      picture.parentElement.remove();
    } else {
      picture.remove();
    }
    const agegateimage = document.createElement('div');
    agegateimage.className = 'agegate-image';
    agegateimage.append(
      createOptimizedPicture(
        picture.querySelector('img').src,
        '',
        false,
        [{ media: '(min-width: 750px)', width: '2000' }, { width: '450' }],
      ),
    );
    agegateimage.querySelector('img').loading = 'eager';
    block.prepend(agegateimage);

    block.querySelector('.rejection').classList.add('hidden');

    const buttons = block.querySelectorAll('.verification a');

    buttons[0].parentElement.append(buttons[1]);
    buttons[0].parentElement.classList.add('agegate-button-wrap');

    const buttonyes = buttons[0];
    buttonyes.classList.add('agegate-button');

    buttonyes.onclick = (event) => {
      setCookie('sazAgeOK', 'yes', 63113852000, '/');
      document.querySelector('.ageverification-container').remove();
      event.preventDefault();
    };

    const buttonno = buttons[1];
    buttonno.classList.add('agegate-button');

    buttonno.onclick = (event) => {
      const targetDiv = block.querySelector('.rejection');
      if (targetDiv.classList.contains('hidden')) {
        [
          block.querySelector('.agegate-logo'),
          block.querySelector('.verification'),
          buttonyes,
          buttonno,
        ].forEach((e) => e.classList.add('hidden'));

        targetDiv.classList.remove('hidden');
        setTimeout(() => {
          window.location.href = buttonno.href;
        }, (5000));
      }
      event.preventDefault();
    };

    await decorateIcons(block);
  }
}
