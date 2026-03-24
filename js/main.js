document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Sticky Navbar on Scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Active Link Highlighting
  const currentPath = window.location.pathname;
  const navItems = document.querySelectorAll('.nav-link');
  
  navItems.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.endsWith(href)) {
      link.classList.add('active');
    } else if (currentPath.endsWith('/') && href === 'index.html') {
      link.classList.add('active');
    }
  });

  // Client-side Contact Form Validation (basic)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      let isValid = true;
      const requiredFields = contactForm.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = 'red';
        } else {
          field.style.borderColor = 'var(--border)';
        }
      });

      if (!isValid) {
        e.preventDefault();
        alert('Please fill out all required fields.');
      }
    });
  }
});
