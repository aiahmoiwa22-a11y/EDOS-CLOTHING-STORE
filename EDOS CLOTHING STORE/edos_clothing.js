// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuIcon = document.getElementById('menuIcon');
const closeIcon = document.getElementById('closeIcon');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
});

// Smooth Scroll Function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });

        // Close mobile menu if open
        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    }
}

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    // Log form data (in a real application, this would be sent to a server)
    console.log('Form submitted:', formData);

    // Show success message
    alert('Thank you for reaching out! We\'ll get back to you soon.');

    // Reset form
    contactForm.reset();
});

// Set Current Year in Footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Header Background on Scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});

// Collection Data (Mapping collections to image arrays)
const collectionData = {
    // 'spring': [
    //     'images/6028564015799274336_121.jpg',
    //     'images/3.jpg',
    //     'images/africina.jpg'
    // ],
    // 'urban': [
    //     'images/3.jpg',
    //     'images/Elevate your style with these stunning matching….jpg',
    //     'images/This African men dashiki (2 piece set) is suitable….jpg'
    // ],
    'mens': [
        'images/MEN COLLECTIONS/3.jpg',
        'images/MEN COLLECTIONS/6028564015799274336_121.jpg',
        'images/MEN COLLECTIONS/africina.jpg',
        'images/MEN COLLECTIONS/Al-Fārooq Confidence Wears on Instagram_ _Your….jpg',
        'images/MEN COLLECTIONS/Men Inspired Fashion Volume 3 - EsBtv Custom Made….jpg',
        'images/MEN COLLECTIONS/Vêtements pour hommes africains, Dashiki….jpg',
        'images/MEN COLLECTIONS/This African men dashiki (2 piece set) is suitable….jpg'
    ],
    'womens': [
        'images/WOMENS COLLECTIIONS/women outfit.jpg',
        'images/WOMENS COLLECTIIONS/women.jpg'
    ],
    'kids': [],
    // 'modern': [
    //     "images/It's party dress season!  Treat yourself with….jpg",
    //     'images/edos.jpg',
    //     'images/background2.jpg'
    // ]
};

// Gallery Modal Handling
const viewGalleryBtns = document.querySelectorAll('.view-collection-btn');
const galleryModal = document.getElementById('galleryModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalGallery = document.getElementById('modalGallery');
const modalTitle = document.getElementById('modalTitle');

if (viewGalleryBtns && galleryModal && modalGallery) {
    viewGalleryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const collectionId = btn.getAttribute('data-collection');
            const collectionImages = collectionData[collectionId];

            // Clear previous images
            modalGallery.innerHTML = '';

            // Add new images
            if (collectionImages && collectionImages.length > 0) {
                collectionImages.forEach(imgSrc => {
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = 'Gallery Image';
                    img.style.width = '100%';
                    img.style.height = 'auto';
                    img.style.objectFit = 'cover';
                    img.style.borderRadius = '8px';
                    img.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    modalGallery.appendChild(img);
                });
            } else {
                const emptyMsg = document.createElement('p');
                emptyMsg.textContent = 'We are curating new looks for this collection. Check back soon!';
                emptyMsg.style.textAlign = 'center';
                emptyMsg.style.gridColumn = '1 / -1';
                emptyMsg.style.padding = '2rem';
                emptyMsg.style.color = '#555';
                modalGallery.appendChild(emptyMsg);
            }

            // Set Title dynamically based on button's sibling properties
            const parentCard = btn.closest('.collection-card');
            if (parentCard) {
                const titleNode = parentCard.querySelector('.collection-title');
                if (titleNode) {
                    modalTitle.textContent = titleNode.textContent + ' Gallery';
                }
            }

            // Show Modal and disable body scrolling
            galleryModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    });

    closeModalBtn.addEventListener('click', () => {
        galleryModal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Restore scrolling
    });

    // Close modal when clicking outside content
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
            galleryModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });
}

// Scroll Animation Observer (Fade Up)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once it's visible
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
});


