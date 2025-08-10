// Navigation JavaScript for Interactive Menu
document.addEventListener('DOMContentLoaded', function() {
    
    // Get DOM elements
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Create scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    // Variables for scroll behavior
    let isScrolling = false;
    let scrollPosition = 0;
    
    // Scroll event handler with throttling
    function handleScroll() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                scrollPosition = window.pageYOffset;
                
                // Add scrolled class when scrolled down
                if (scrollPosition > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                // Update scroll progress bar
                updateScrollProgress();
                
                // Update active navigation link
                updateActiveLink();
                
                isScrolling = false;
            });
        }
        isScrolling = true;
    }
    
    // Update scroll progress bar
    function updateScrollProgress() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollPosition / scrollHeight) * 100;
        progressBar.style.width = Math.min(progress, 100) + '%';
    }
    
    // Update active navigation link based on scroll position
    function updateActiveLink() {
        const sections = document.querySelectorAll('.section');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Remove active class from all links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    function smoothScroll(target) {
        const targetElement = document.querySelector(target);
        if (targetElement) {
            const targetPosition = targetElement.offsetTop - 80;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // Handle navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links (starting with #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                smoothScroll(href);
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
        
        // Add hover effect with sound (optional)
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Mobile hamburger menu toggle
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Handle dropdown menus
    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        // Desktop hover behavior
        dropdown.addEventListener('mouseenter', function() {
            dropdownMenu.style.opacity = '1';
            dropdownMenu.style.visibility = 'visible';
            dropdownMenu.style.transform = 'translateY(0)';
        });
        
        dropdown.addEventListener('mouseleave', function() {
            dropdownMenu.style.opacity = '0';
            dropdownMenu.style.visibility = 'hidden';
            dropdownMenu.style.transform = 'translateY(-10px)';
        });
        
        // Mobile touch behavior
        dropdownToggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const isOpen = dropdownMenu.classList.contains('mobile-open');
                
                // Close all other dropdowns
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.classList.remove('mobile-open');
                });
                
                if (!isOpen) {
                    dropdownMenu.classList.add('mobile-open');
                }
            }
        });
    });
    
    // Navbar color change on specific scroll positions
    function updateNavbarTheme() {
        const sections = document.querySelectorAll('.section');
        let currentSection = null;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = index;
            }
        });
        
        // Change navbar theme based on section
        if (currentSection !== null) {
            if (currentSection % 2 === 0) {
                navbar.style.setProperty('--primary-color', '#3498db');
                navbar.style.setProperty('--hover-color', '#2980b9');
            } else {
                navbar.style.setProperty('--primary-color', '#e74c3c');
                navbar.style.setProperty('--hover-color', '#c0392b');
            }
        }
    }
    
    // Enhanced scroll handler
    function enhancedScrollHandler() {
        handleScroll();
        updateNavbarTheme();
    }
    
    // Add scroll event listener with throttling
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(enhancedScrollHandler, 10);
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Close mobile menu on resize
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        
        // Update scroll progress
        updateScrollProgress();
    });
    
    // Intersection Observer for smoother active link updates
    const observerOptions = {
        root: null,
        rootMargin: '-50px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
    
    // Add loading animation
    function addLoadingAnimation() {
        navbar.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            navbar.style.transition = 'transform 0.5s ease';
            navbar.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Initialize
    addLoadingAnimation();
    updateScrollProgress();
    
    // Add CSS custom properties for dynamic theming
    document.documentElement.style.setProperty('--primary-color', '#3498db');
    document.documentElement.style.setProperty('--hover-color', '#2980b9');
    
    console.log('Interactive Navigation Menu initialized successfully!');
});

// Additional utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for external use if needed
window.NavigationMenu = {
    updateScrollProgress: updateScrollProgress,
    smoothScroll: smoothScroll,
    debounce: debounce,
    throttle: throttle
};