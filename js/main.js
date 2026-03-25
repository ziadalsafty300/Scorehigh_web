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

  // AJAX Contact Form Handling
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formReview = document.getElementById('formReview');

  if (contactForm && submitBtn && formReview) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Basic Validation
      let isValid = true;
      const requiredFields = contactForm.querySelectorAll('[required]');
      const data = {};
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = 'red';
        } else {
          field.style.borderColor = 'var(--border)';
          data[field.name] = field.value;
        }
      });

      // Add non-required fields to data
      const otherFields = contactForm.querySelectorAll('input:not([required]), select:not([required])');
      otherFields.forEach(field => {
        data[field.name] = field.value;
      });

      if (!isValid) {
        alert('Please fill out all required fields.');
        return;
      }

      // UI Loading State
      submitBtn.disabled = true;
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending...';
      formReview.style.display = 'none';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          // Success Feedback
          formReview.innerHTML = 'Success! Your message has been sent. I will contact you shortly.';
          formReview.style.backgroundColor = '#d1e7dd';
          formReview.style.color = '#0f5132';
          formReview.style.display = 'block';
          contactForm.reset();
        } else {
          throw new Error(result.error || 'Something went wrong.');
        }
      } catch (err) {
        // Error Feedback
        console.error("Contact Form Error:", err);
        formReview.innerHTML = `We are unable to process your request at this time. Please contact us directly via WhatsApp!`;
        formReview.style.backgroundColor = '#f8d7da';
        formReview.style.color = '#842029';
        formReview.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }
});
