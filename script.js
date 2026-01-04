document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }

  // Close menu when clicking a link
  const navLinks = document.querySelectorAll('.nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
});

// CUSTOM CAROUSEL IMPLEMENTATION
function initCarousel() {
  const wrapper = document.querySelector('.cards-wrapper');
  const cards = Array.from(document.querySelectorAll('.style-card'));

  if (!wrapper || cards.length === 0 || window.innerWidth >= 700) return;

  let currentIndex = 0;
  let isAnimating = false;
  let autoSlideInterval = null;
  let resumeTimeout = null;
  let touchStartX = 0;
  let touchEndX = 0;
  const paginationContainer = document.querySelector('.carousel-pagination');
  let paginationDots = [];

  // Create pagination dots
  function createPagination() {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';
    paginationDots = [];

    cards.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (index === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => {
        const diff = index - currentIndex;
        const normalizedDiff = diff > cards.length / 2 ? diff - cards.length :
          diff < -cards.length / 2 ? diff + cards.length : diff;
        navigate(normalizedDiff);
      });
      paginationContainer.appendChild(dot);
      paginationDots.push(dot);
    });
  }

  // Update pagination
  function updatePagination() {
    paginationDots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  // Calculate and apply transforms for all cards
  function updateCarousel(animate = true) {
    const totalCards = cards.length;

    cards.forEach((card, index) => {
      // Calculate circular offset from current center
      let offset = index - currentIndex;

      // Normalize offset to shortest path
      if (offset > totalCards / 2) offset -= totalCards;
      if (offset < -totalCards / 2) offset += totalCards;

      // Calculate transform values
      const spacing = window.innerWidth < 500 ? 280 : 360; // Reduced spacing for small screens
      const translateX = offset * spacing;
      const scale = offset === 0 ? 1.05 : 0.9; // Center vs side scale
      const rotateY = Math.max(-10, Math.min(10, offset * 8)); // Subtle rotation
      const opacity = Math.abs(offset) <= 1 ? (offset === 0 ? 1 : 0.8) : 0;
      const zIndex = offset === 0 ? 10 : (5 - Math.abs(offset));

      // Apply transforms
      card.style.transition = animate ? 'transform 0.7s ease-in-out, opacity 0.7s ease-in-out' : 'none';
      card.style.transform = `translate(-50%, -50%) translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`;
      card.style.opacity = opacity;
      card.style.zIndex = zIndex;
    });

    // Update pagination dots
    updatePagination();
  }

  // Navigate carousel
  function navigate(direction) {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex = (currentIndex + direction + cards.length) % cards.length;
    updateCarousel(true);
    setTimeout(() => { isAnimating = false; }, 700);
    resetAutoSlide();
  }

  // Auto-slide functionality
  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => navigate(1), 4500);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }

  function resetAutoSlide() {
    stopAutoSlide();
    if (resumeTimeout) clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => startAutoSlide(), 3000);
  }

  // Touch handlers
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoSlide();
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      navigate(diff > 0 ? 1 : -1);
    } else {
      resetAutoSlide();
    }
  }

  // Click handlers
  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      if (index !== currentIndex) {
        const diff = index - currentIndex;
        const normalizedDiff = diff > cards.length / 2 ? diff - cards.length :
          diff < -cards.length / 2 ? diff + cards.length : diff;
        navigate(normalizedDiff);
      }
    });
  });

  // Event listeners
  wrapper.addEventListener('touchstart', handleTouchStart, { passive: true });
  wrapper.addEventListener('touchend', handleTouchEnd, { passive: true });
  wrapper.addEventListener('mouseenter', stopAutoSlide);
  wrapper.addEventListener('mouseleave', () => {
    if (window.innerWidth < 700) resetAutoSlide();
  });

  // Initialize
  createPagination();
  updateCarousel(false);
  startAutoSlide();

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth >= 700) {
        stopAutoSlide();
        cards.forEach(card => {
          card.style.transform = '';
          card.style.opacity = '';
          card.style.zIndex = '';
          card.style.transition = '';
        });
      } else {
        updateCarousel(false);
        startAutoSlide();
      }
    }, 250);
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initCarousel);
