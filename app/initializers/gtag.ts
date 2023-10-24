import config from 'text2stl/config/environment';
const { gTag, environment } = config;

export function initialize() {
  if (!gTag.forceEnable && ['development', 'test'].includes(environment)) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${gTag.tag}`);
  script.async = true;

  script.onload = initGtag;

  document.body.appendChild(script);
}

function initGtag() {
  const script = document.createElement('script');
  script.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '${gTag.tag}');
`;

  // Append the script tag to the document.
  document.body.appendChild(script);
}

export default {
  initialize,
};
