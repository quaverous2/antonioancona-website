import './style.css';

const routes = new Set(['home', 'projects', 'about', 'contact']);
const routeSections = [...document.querySelectorAll('[data-route]')];
const navigationLinks = [...document.querySelectorAll('[data-nav-link]')];
const defaultRoute = 'home';

function routeFromLocation() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const route = path === '/' ? defaultRoute : path.slice(1);
  return routes.has(route) ? route : defaultRoute;
}

function renderRoute() {
  const activeRoute = routeFromLocation();

  routeSections.forEach((section) => {
    section.hidden = section.id !== activeRoute;
  });

  navigationLinks.forEach((link) => {
    const linkRoute = link.pathname.replace(/\/+$/, '').slice(1) || defaultRoute;
    const isCurrent = linkRoute === activeRoute;
    if (isCurrent) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  document.title = `${activeRoute[0].toUpperCase()}${activeRoute.slice(1)} — Antonio Ancona`;
}

document.querySelector('#current-year').textContent = new Date().getFullYear();
navigationLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    window.history.pushState({}, '', link.href);
    renderRoute();
  });
});

window.addEventListener('popstate', renderRoute);
renderRoute();

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  import('./background/BackgroundController.js')
    .then(({ BackgroundController }) => {
      const background = new BackgroundController(document.querySelector('#background-canvas'));
      background.start();
    })
    .catch((error) => {
      console.warn('WebGL background disabled; using CSS fallback.', error);
    });
}
