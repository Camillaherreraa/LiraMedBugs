document.addEventListener('DOMContentLoaded', function () {
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    
    const slides = document.querySelectorAll('.catalog-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const currentSlideDisplay = document.querySelector('.current-slide');
    const totalSlidesDisplay = document.querySelector('.total-slides');

    let currentSlide = 0;

    if (totalSlidesDisplay) {
        totalSlidesDisplay.textContent = slides.length;
    }

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        currentSlideDisplay.textContent = currentSlide + 1;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });
    }

    
    showSlide(0);

    
    function setupZoomForImages() {
        document.querySelectorAll('.catalog-page').forEach(page => {
            let initialDistance = 0;
            let currentScale = 1;
            let isZooming = false;
            let isPinching = false;
            const img = page.querySelector('img');

            if (!img) return;

            img.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!isPinching) {
                    const currentSlideImages = page.closest('.catalog-slide').querySelectorAll('img');
                    currentSlideImages.forEach(otherImg => {
                        otherImg.style.zIndex = '1';
                    });

                    img.style.zIndex = '10000';
                    img.style.position = 'relative';
                }
            });

            page.addEventListener('touchstart', (e) => {
                if (e.touches.length === 2) {
                    e.preventDefault();
                    isPinching = true;
                    isZooming = true;
                    const touch1 = e.touches[0];
                    const touch2 = e.touches[1];
                    initialDistance = Math.hypot(
                        touch2.clientX - touch1.clientX,
                        touch2.clientY - touch1.clientY
                    );
                }
            }, { passive: false });

            page.addEventListener('touchmove', (e) => {
                if (e.touches.length === 2 && isZooming) {
                    e.preventDefault();
                    const touch1 = e.touches[0];
                    const touch2 = e.touches[1];
                    const currentDistance = Math.hypot(
                        touch2.clientX - touch1.clientX,
                        touch2.clientY - touch1.clientY
                    );

                    const scale = (currentDistance / initialDistance) * currentScale;
                    const clampedScale = Math.min(Math.max(scale, 1), 3);

                    img.style.transform = `scale(${clampedScale})`;
                    img.style.zIndex = '10000';
                    img.style.position = 'relative';
                }
            }, { passive: false });

            page.addEventListener('touchend', (e) => {
                if (isZooming) {
                    const transform = img.style.transform;
                    if (transform) {
                        const scaleMatch = transform.match(/scale\(([^)]+)\)/);
                        if (scaleMatch) {
                            currentScale = parseFloat(scaleMatch[1]);
                        }
                    }

                    if (currentScale <= 1.1) {
                        img.style.transform = 'scale(1)';
                        img.style.zIndex = '1';
                        img.style.position = 'relative';
                        currentScale = 1;
                    }

                    setTimeout(() => {
                        isPinching = false;
                        isZooming = false;
                    }, 100);
                }
            }, { passive: false });
        });
    }

    setupZoomForImages();

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            setTimeout(setupZoomForImages, 100);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            setTimeout(setupZoomForImages, 100);
        });
    }

    
    const catalogDisplay = document.querySelector('.catalog-display');
    let startX = 0;
    let startY = 0;
    let isSwipe = false;
    let isPinching = false;

    if (catalogDisplay) {
        catalogDisplay.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                isPinching = true;
                return;
            }
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwipe = false;
            isPinching = false;
        }, { passive: true });

        catalogDisplay.addEventListener('touchmove', (e) => {
            if (isPinching || e.touches.length === 2) {
                return; 
            }

            if (!startX || !startY) return;

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = Math.abs(currentX - startX);
            const diffY = Math.abs(currentY - startY);

            if (diffX > diffY && diffX > 30) {
                isSwipe = true;
                e.preventDefault();
            }
        }, { passive: false });

        catalogDisplay.addEventListener('touchend', (e) => {
            if (isPinching) {
                isPinching = false;
                return;
            }

            if (!startX || !isSwipe) return;

            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    showSlide(currentSlide + 1);
                } else {
                    showSlide(currentSlide - 1);
                }
            }

            startX = 0;
            startY = 0;
            isSwipe = false;
        }, { passive: true });
    }


    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showSlide(currentSlide - 1);
        } else if (e.key === 'ArrowRight') {
            showSlide(currentSlide + 1);
        }
    });

    function animateOnScroll() {
        const elements = document.querySelectorAll('.about-content, .catalog-viewer, .contact-grid');
        const windowHeight = window.innerHeight;

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const animationPoint = windowHeight / 1.3;

            if (elementPosition < animationPoint) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    function setupAnimations() {
        const animatedElements = document.querySelectorAll('.about-content, .catalog-viewer, .contact-grid');
        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = `all 0.8s ease ${index * 0.2}s`;
        });
    }

    setupAnimations();
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});
