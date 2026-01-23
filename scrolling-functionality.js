 document.getElementById('scroll-button').addEventListener('click', function () {
    document.getElementById('upcoming-events')?.scrollIntoView({ behavior: 'smooth' });
  });


  const toggleButton = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  toggleButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  function scrollToSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      mobileMenu.classList.add('hidden'); // Close menu on scroll
    }
  }