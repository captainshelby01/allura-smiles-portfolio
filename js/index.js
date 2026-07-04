/* ==========================================================================
   ALLURA SMILES CREATIVE - INTERACTION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Navigation Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile drawer when a nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 2. Active Section Scrollspy
    const sections = document.querySelectorAll('section');
    
    const scrollspyOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section occupies the middle of the viewport
        threshold: 0
    };

    const scrollspyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, scrollspyOptions);

    sections.forEach(section => {
        scrollspyObserver.observe(section);
    });

    // 3. Testimonials Slider Carousel
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    
    let currentSlide = 0;
    let autoSlideInterval;
    const slideDuration = 6000; // 6 seconds

    function showSlide(index) {
        // Reset indexes boundary
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        // Update slides visibility
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === currentSlide) {
                slide.classList.add('active');
            }
        });

        // Update dots state
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === currentSlide) {
                dot.classList.add('active');
            }
        });
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Start auto slide
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, slideDuration);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    // Add controls listeners
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoSlide(); // Reset interval
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoSlide(); // Reset interval
        });
    }

    // Add dots listeners
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            showSlide(index);
            startAutoSlide(); // Reset interval
        });
    });

    // Pause auto slide on hover
    const testimonialsContainer = document.querySelector('.testimonials-slider-container');
    if (testimonialsContainer) {
        testimonialsContainer.addEventListener('mouseenter', stopAutoSlide);
        testimonialsContainer.addEventListener('mouseleave', startAutoSlide);
    }

    // Initialize slides
    if (slides.length > 0) {
        showSlide(0);
        startAutoSlide();
    }

    // 4. WhatsApp Inquiry Form Formatter & Redirector
    const whatsappForm = document.getElementById('whatsapp-inquiry-form');
    
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const service = document.getElementById('form-service').value;
            const message = document.getElementById('form-message').value.trim();
            
            // Format WhatsApp Message
            const formattedMessage = `Hello Marvellous!\n\nI would like to inquire about your creative services. Here are my details:\n\n` +
                                     `👤 *Name*: ${name}\n` +
                                     `📧 *Email*: ${email}\n` +
                                     `💼 *Service Required*: ${service}\n\n` +
                                     `📝 *Project details*:\n${message}\n\n` +
                                     `Looking forward to connecting!`;
            
            const encodedText = encodeURIComponent(formattedMessage);
            const whatsappUrl = `https://wa.me/2347044248545?text=${encodedText}`;
            
            // Redirect to WhatsApp
            window.open(whatsappUrl, '_blank');
        });
    }

    // 5. Dynamic Lightbox Video Modal Player
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const videoModal = document.getElementById('video-modal');
    const modalClose = document.getElementById('modal-close');
    const modalContent = document.getElementById('modal-content');

    if (portfolioCards.length > 0 && videoModal && modalClose && modalContent) {
        
        portfolioCards.forEach(card => {
            card.addEventListener('click', () => {
                const videoSrc = card.getAttribute('data-video');
                const videoTitle = card.getAttribute('data-title') || "Creative Video";
                
                if (videoSrc) {
                    // Inject Video Tag with attributes
                    // preload="auto" to start loading immediately inside the modal
                    modalContent.innerHTML = `
                        <video controls autoplay loop playsinline name="media">
                            <source src="${videoSrc}">
                            Your browser does not support the video tag.
                        </video>
                    `;
                    
                    // Show modal
                    videoModal.classList.add('active');
                    videoModal.setAttribute('aria-hidden', 'false');
                    
                    // Prevent page body scrolling
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Close Modal handler
        const closePlayer = () => {
            videoModal.classList.remove('active');
            videoModal.setAttribute('aria-hidden', 'true');
            
            // Remove video from DOM to immediately stop audio, release memory and network download
            modalContent.innerHTML = '';
            
            // Restore page scrolling
            document.body.style.overflow = '';
        };

        modalClose.addEventListener('click', closePlayer);
        
        // Close modal when clicking outside content (on backdrop)
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closePlayer();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closePlayer();
            }
        });
    }
});
