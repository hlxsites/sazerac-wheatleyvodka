import { decorateIcons } from '../../scripts/lib-franklin.js';
import { setCookie } from '../../scripts/scripts.js';
/* age verification overlay */

export default async function decorate(block) {
  block.textContent = '';

  const resp = await fetch('/templates/verification.plain.html', window.location.pathname.endsWith('/templates/verification') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();
    const ageverification = document.createElement('div');
    ageverification.innerHTML = html;

    const verification = ageverification.getElementsByClassName('verification')[0];
    const rejection = ageverification.getElementsByClassName('rejection')[0];

    const agegateimage = document.createElement('div');
    agegateimage.className = 'agegate-image';
    agegateimage.style.backgroundImage = `url(${ageverification.querySelector('p picture img').getAttribute('src')})`;
    const agegateform = document.createElement('div');
    agegateform.className = 'agegate-form';
    agegateform.id = 'agegateform';

    const agegatelogo = ageverification.getElementsByClassName('agegate-logo')[0];
    const agegatetitle = document.createElement('div');
    agegatetitle.className = 'title-wrapper';
    const agetittletxt = verification.querySelector('h1');
    const agegatebutton = document.createElement('div');
    agegatebutton.className = 'agegate-button-wrap';
    const buttonyes = document.createElement('a');
    buttonyes.id = 'agegate-button-yes';
    buttonyes.href = '#';
    buttonyes.innerText = verification.querySelectorAll('div')[2].querySelector('div').innerText;
    // eslint-disable-next-line func-names
    buttonyes.onclick = function () {
      setCookie('sazAgeOK', 'yes', 63113852000, '/');
      document.getElementsByClassName('ageverification-container')[0].style.display = 'none';
    };

    const buttonno = document.createElement('a');
    buttonno.id = 'agegate-button-no';
    buttonno.href = '#';
    buttonno.innerText = verification.querySelectorAll('div')[4].querySelector('div').innerText;
    // eslint-disable-next-line func-names
    buttonno.onclick = function () {
      const targetDiv = document.getElementById('agefailscreen');
      const hideDiv = document.getElementById('agegateform');
      if (targetDiv.style.display === 'none') {
        hideDiv.style.display = 'none';
        targetDiv.style.display = 'block';
        setTimeout(() => {
          window.location.href = 'https://www.responsibility.org/';
        }, (5000));
      }
    };

    const agefailscreen = document.createElement('div');
    agefailscreen.id = 'agefailscreen';
    agefailscreen.style.display = 'none';
    agefailscreen.innerHTML = rejection.innerHTML;

    agegatetitle.appendChild(agetittletxt);
    agegateform.appendChild(agegatelogo);
    agegateform.appendChild(agegatetitle);
    agegatebutton.appendChild(buttonyes);
    agegatebutton.appendChild(buttonno);
    agegateform.appendChild(agegatebutton);
    block.append(agegateimage);
    await decorateIcons(agegateform);
    block.append(agegateform);
    block.append(agefailscreen);
  }
}
