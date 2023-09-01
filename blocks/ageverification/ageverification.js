import { decorateIcons } from '../../scripts/lib-franklin.js';
/* age verification overlay */

export default async function decorate(block) {
  block.textContent = '';

  const resp = await fetch('/templates/ageverification.plain.html', window.location.pathname.endsWith('/templates/ageverification') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();
    const ageverification = document.createElement('div');
    ageverification.innerHTML = html;
    const agegateimage = document.createElement('div');
    agegateimage.className = 'agegate-image';
    const agegateform = document.createElement('div');
    agegateform.className = 'agegate-form';
    agegateform.id = 'agegateform';

    const agegatelogo = document.createElement('div');
    agegatelogo.className = 'agegate-logo';
    const logoicon = document.createElement('p');
    const logo = document.createElement('span');
    logo.className = 'icon icon-logo-agegate';
    logoicon.appendChild(logo);
    agegatelogo.appendChild(logoicon);
    const agegatetitle = document.createElement('div');
    agegatetitle.className = 'title-wrapper';
    const agetittletxt = document.createElement('h2');
    agetittletxt.innerText = ageverification.querySelector('div').querySelector('h1').innerText;
    const agegatebutton = document.createElement('div');
    agegatebutton.className = 'agegate-button-wrap';
    const buttonyes = document.createElement('a');
    buttonyes.id = 'agegate-button-yes';
    buttonyes.href = '#';
    buttonyes.innerText = 'Yes';
    const buttonno = document.createElement('a');
    buttonno.id = 'agegate-button-no';
    buttonno.href = '#';
    buttonno.innerText = 'No';
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
    const afstitle = document.createElement('h3');
    afstitle.innerText = ageverification.querySelector('div').querySelector('h2').innerText;
    const afstext = document.createElement('p');
    afstext.innerHTML = ageverification.querySelector('div').querySelector('h3').innerHTML;
    agefailscreen.appendChild(afstitle);
    agefailscreen.appendChild(afstext);

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
