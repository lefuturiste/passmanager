document.addEventListener("DOMContentLoaded", function() {
  let head = document.getElementsByTagName('head')[0];
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js';
  head.appendChild(script);
  script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://cdn.jsdelivr.net/npm/js-sha512@0.8.0/build/sha512.min.js';
  head.appendChild(script);
  script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'icons.js';
  head.appendChild(script);
  setTimeout(() => {
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'ui.js';
    head.appendChild(script);
  }, 500)
});