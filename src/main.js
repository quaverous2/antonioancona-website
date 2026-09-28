import './style.css';
import './animations/text.css';
import { TextAnimationController } from './animations/TextAnimationController.js';

const routes = new Set(['home', 'experience', 'contact']);
const routeSections = [...document.querySelectorAll('[data-route]')];
const navigationLinks = [...document.querySelectorAll('[data-nav-link]')];
const defaultRoute = 'home';
const textAnimations = new TextAnimationController({
  sections: routeSections,
  navigationLinks,
  prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
});

function routeFromLocation() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const route = path === '/' ? defaultRoute : path.slice(1);
  return routes.has(route) ? route : defaultRoute;
}

function updateDocumentTitle(activeRoute) {
  document.title = `${activeRoute[0].toUpperCase()}${activeRoute.slice(1)} — Antonio Ancona`;
}

function renderInitialRoute() {
  const activeRoute = routeFromLocation();
  textAnimations.initialize(activeRoute);
  updateDocumentTitle(activeRoute);
}

async function renderRoute() {
  const activeRoute = routeFromLocation();
  const didTransition = await textAnimations.transitionTo(activeRoute);

  if (didTransition) {
    updateDocumentTitle(activeRoute);
  }
}

document.querySelector('#current-year').textContent = new Date().getFullYear();
navigationLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    if (textAnimations.isTransitioning) {
      return;
    }

    const nextRoute = link.pathname.replace(/\/+$/, '').slice(1) || defaultRoute;
    if (nextRoute === textAnimations.activeRoute) {
      return;
    }

    window.history.pushState({}, '', link.href);
    renderRoute();
  });
});

window.addEventListener('popstate', renderRoute);
renderInitialRoute();

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
