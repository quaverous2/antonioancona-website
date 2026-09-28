const animationEnd = (element) => new Promise((resolve) => {
  const finish = (event) => {
    if (event.target !== element) {
      return;
    }

    element.removeEventListener('animationend', finish);
    element.removeEventListener('animationcancel', finish);
    resolve();
  };

  element.addEventListener('animationend', finish);
  element.addEventListener('animationcancel', finish);
});

/**
 * Owns text/UI motion only. Background animation remains independent.
 */
export class TextAnimationController {
  constructor({ sections, navigationLinks, prefersReducedMotion }) {
    this.sections = sections;
    this.navigationLinks = navigationLinks;
    this.prefersReducedMotion = prefersReducedMotion;
    this.activeRoute = null;
    this.isTransitioning = false;
  }

  initialize(route) {
    this.activeRoute = route;

    this.sections.forEach((section) => {
      const isActive = section.id === route;
      section.hidden = !isActive;
      section.classList.remove('is-route-entering', 'is-route-leaving');

      if (isActive && !this.prefersReducedMotion.matches) {
        section.classList.add('is-route-entering');
      }
    });

    this.updateNavigation(route);
  }

  async transitionTo(route) {
    if (this.isTransitioning || route === this.activeRoute) {
      return false;
    }

    const previousSection = this.sectionFor(this.activeRoute);
    const nextSection = this.sectionFor(route);
    if (!previousSection || !nextSection) {
      return false;
    }

    this.isTransitioning = true;
    document.documentElement.classList.add('is-route-transitioning');

    if (!this.prefersReducedMotion.matches) {
      previousSection.classList.remove('is-route-entering');
      previousSection.classList.add('is-route-leaving');
      await animationEnd(previousSection);
    }

    previousSection.hidden = true;
    previousSection.classList.remove('is-route-leaving');
    nextSection.hidden = false;
    this.activeRoute = route;
    this.updateNavigation(route);

    if (!this.prefersReducedMotion.matches) {
      nextSection.classList.add('is-route-entering');
      await animationEnd(nextSection);
      nextSection.classList.remove('is-route-entering');
    }

    document.documentElement.classList.remove('is-route-transitioning');
    this.isTransitioning = false;
    return true;
  }

  sectionFor(route) {
    return this.sections.find((section) => section.id === route);
  }

  updateNavigation(route) {
    this.navigationLinks.forEach((link) => {
      const linkRoute = link.pathname.replace(/\/+$/, '').slice(1) || 'home';
      link.toggleAttribute('aria-current', linkRoute === route);
    });
  }
}
