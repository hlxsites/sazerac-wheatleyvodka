export default async function decorate(block) {
  block.textContent = '';
  const d = document.createElement('div');
  d.className = 'wheatley-mikmak';
  d.dataset.mikmakUpcs = '088004019761,088004022686,088004027834,088004022679,088004034184,088004034191,088004040574';
  block.appendChild(d);
  const s = document.createElement('script');
  s.textContent = '!function(e,t,i,r,a,d){e[r]=e[r]||!1;var n=t.querySelectorAll(a);if(n)for(var c=0;c<n.length;c++){n[c].addEventListener("click",function(evt){e[r]=evt})}var m=t.createElement("script");m.setAttribute("data-mikmak-brand",i),m.type="text/javascript",m.src=d,m.defer=!0,t.body.appendChild(m)}(window,document,"03aeb86d-b5ed-d9b6-ff65-04b8d33c765f","mikmak_discover",".mikmak-discover","//embed.mikmak.tv/v2");';
  document.body.appendChild(s);
}
