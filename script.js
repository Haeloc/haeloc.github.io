// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

// Wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
    // Animate hero section
    gsap.from('.hero-content', {
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: 'power4.out'
    });

    // Animate music section
    gsap.from('.music-grid', {
        scrollTrigger: {
            trigger: '.music-section',
            start: 'top center',
            end: 'bottom center',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 100,
        duration: 1,
        ease: 'power3.out'
    });

    // Animate events cards
    gsap.utils.toArray('.event-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            x: i % 2 === 0 ? -100 : 100,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Animate section headers
    gsap.utils.toArray('section h2').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Parallax effect for hero section
    gsap.to('.hero', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        backgroundPosition: '50% 100%',
        ease: 'none'
    });

    // Smooth reveal for contact form
    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top center',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
    });

    // Social links animation
    gsap.from('.social-links a', {
        scrollTrigger: {
            trigger: '.social-links',
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)'
    });

    // Showcase Slider functionality
    const track = document.querySelector('.showcase-track');
    const slides = document.querySelectorAll('.showcase-slide');
    const nextButton = document.querySelector('.next-arrow');
    const prevButton = document.querySelector('.prev-arrow');
    const dotsContainer = document.querySelector('.showcase-dots');
    
    let currentIndex = 0;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        track.style.transition = 'transform 0.3s ease-out';
        updateDots();
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        goToSlide(currentIndex);
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(currentIndex);
    }
    
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);
    
    // Enhanced touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;
    let initialTransform = 0;

    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        isSwiping = true;
        initialTransform = track.getBoundingClientRect().left;
        
        // Disable transition during swipe
        track.style.transition = 'none';
    }

    function handleTouchMove(e) {
        if (!isSwiping) return;
        
        e.preventDefault();
        const currentX = e.touches[0].clientX;
        const diff = currentX - touchStartX;
        
        // Add the drag effect
        track.style.transform = `translateX(${diff + initialTransform}px)`;
    }

    function handleTouchEnd(e) {
        if (!isSwiping) return;
        
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchEndX - touchStartX;
        
        // Re-enable transition
        track.style.transition = 'transform 0.3s ease-out';
        
        // Determine if swipe was significant enough
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            // If swipe wasn't significant, return to current slide
            goToSlide(currentIndex);
        }
        
        isSwiping = false;
    }

    // Add touch event listeners
    track.addEventListener('touchstart', handleTouchStart, { passive: false });
    track.addEventListener('touchmove', handleTouchMove, { passive: false });
    track.addEventListener('touchend', handleTouchEnd);

    // Add mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
});

// Modify the smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: target,
                    offsetY: 70
                },
                ease: 'power3.inOut',
                onComplete: () => {
                    // Check if this is the "Listen Now" button
                    if (this.classList.contains('cta-button')) {
                        // Get the SoundCloud iframe and trigger play
                        const scWidget = SC.Widget(document.querySelector('.music-grid iframe'));
                        scWidget.play();
                    }
                }
            });
        }
    });
});

// Navigation background change on scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        nav.style.background = 'rgba(0, 0, 0, 0.8)';
    }
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Add your form submission logic here
    alert('Message sent successfully!');
    contactForm.reset();
}); 