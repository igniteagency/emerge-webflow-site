export function navbarScrollToggle() {
  const navbar = document.querySelector('.navbar-wrapper');
  if (!navbar) {
    console.warn('NavbarScrollToggle: .navbar-wrapper not found');
    return;
  }

  const container = navbar.querySelector<HTMLElement>('.navbar_container');
  const logoLink = navbar.querySelector<HTMLElement>('.navbar_logo-link');

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Capture initial states
  const initialLogoWidth = logoLink ? getComputedStyle(logoLink).width : 'auto';
  const initialLogoTransform = logoLink ? getComputedStyle(logoLink).transform : 'none';
  const initialContainerHeight = container ? getComputedStyle(container).height : 'auto';

  let isHidden = false;

  const hideNav = () => {
    if (isHidden) return;
    isHidden = true;
    navbar.classList.add('is-hidden');
    
    if (container) {
      gsap.to(container, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (logoLink) {
      gsap.to(logoLink, {
        width: '10rem',
        y: 0,
        x: 0,
        scale: 1,
        rotation: 0,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const showNav = () => {
    if (!isHidden) return;
    isHidden = false;
    navbar.classList.remove('is-hidden');
    
    if (container) {
      gsap.to(container, {
        height: initialContainerHeight,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (logoLink) {
      gsap.to(logoLink, {
        width: initialLogoWidth,
        transform: initialLogoTransform,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };


  ScrollTrigger.create({
    start: 'top top', // Start at the very top
    onUpdate: (self) => {
      const scrollY = self.scroll();
      const direction = self.direction; // 1 = down, -1 = up

      // 1. If we are near the top (e.g. < 100px), always show
      if (scrollY < 100) {
        showNav();
        return;
      }

      // 2. Otherwise, toggle based on direction
      if (direction === 1) {
        hideNav();
      } else if (direction === -1) {
        showNav();
      }
    },
  });
}



