document.addEventListener('DOMContentLoaded', function() {
    // === THEME TOGGLE FUNCTIONALITY ===
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('cit-syscheck-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    // Toggle event listener
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = 'dark';
        
        if (currentTheme === 'dark') {
            newTheme = 'light';
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            newTheme = 'dark';
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('cit-syscheck-theme', newTheme);
    });

    // === LIGHTBOX FUNCTIONALITY ===
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');

    // Select all images that should have lightbox (Gallery images + Feature images + Hero Image)
    const galleryImages = document.querySelectorAll('.gallery-item img, .feature-card img, .hero-image img');

    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            lightbox.classList.add('active');
            lightboxImg.src = this.src;
            
            // Get caption from alt text or parent div
            let captionText = this.alt;
            // Try to find a better title if it's a feature card
            const featureCard = this.closest('.feature-card');
            if (featureCard) {
                const title = featureCard.querySelector('h3');
                if (title) captionText += ` - ${title.textContent}`;
            }
            
            lightboxCaption.innerHTML = captionText;
            document.body.style.overflow = 'hidden'; // Disable scroll
        });
    });

    // Close Lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Enable scroll
    }

    closeBtn.addEventListener('click', closeLightbox);

    // Close when clicking outside of the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // === MOBILE MENU ===
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', toggleMenu);
    }

    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // === SMOOTH SCROLL ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // === SLIDER DRAG ===
    const slider = document.querySelector('.gallery-track');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (slider) {
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    }
});
