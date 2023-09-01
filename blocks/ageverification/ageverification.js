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

    const agegatelogo = document.createElement('div');
    agegatelogo.className = 'agegate-logo';
    const logo = document.createElement('img');
    logo.src = '/templates/logo-agegate.svg';
    logo.alt = '';
    agegatelogo.appendChild(logo);
    const agegatetitle = document.createElement('div');
    agegatetitle.className = 'title-wrapper';
    const agetittletxt = document.createElement('h2');
    agetittletxt.innerText = ageverification.querySelector('div').querySelector('h2').innerText;
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

    const agefailscreen = document.createElement('div');
    agefailscreen.id = 'agefailscreen';

    agegatetitle.appendChild(agetittletxt);
    agegateform.appendChild(agegatelogo);
    agegateform.appendChild(agegatetitle);
    agegatebutton.appendChild(buttonyes);
    agegatebutton.appendChild(buttonno);
    agegateform.appendChild(agegatebutton);
    block.append(agegateimage);
    block.append(agegateform);
  }
}
