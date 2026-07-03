// --- Page Transitions Navigation Interceptor ---
document.addEventListener('DOMContentLoaded', () => {
    // Handle Enter Animation
    const direction = sessionStorage.getItem('navDirection') || 'forward';
    document.body.classList.remove('page-enter'); // Remove default if any
    document.body.classList.add(`page-enter-${direction}`);

    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    
    navLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            if (!link.classList.contains('active')) {
                e.preventDefault();
                const targetUrl = link.getAttribute('href');
                
                const currentIndex = navLinks.findIndex(l => l.classList.contains('active'));
                const targetIndex = index;
                
                const newDirection = targetIndex > currentIndex ? 'forward' : 'backward';
                sessionStorage.setItem('navDirection', newDirection);
                
                document.body.classList.remove(`page-enter-forward`, `page-enter-backward`);
                document.body.classList.add(`page-exit-${newDirection}`);
                
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 400);
            }
        });
    });

    initScrollAnimations();
    
    // Only run Experience specific logic if we are on the Experience page
    if(document.getElementById('modules-container')) {
        renderModules();
    }
});


// --- Yield IT Tabs ---
function openTab(tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}


// --- Advanced Dynamic Experience Modules ---

// Initial Mock Data utilizing the new array structures
let experienceData = [
    {
        title: "Bachelor's Degree in Computer Science",
        company: "University of Northwestern",
        skills: ["HTML5", "Vanilla JS", "CSS", "SQL", "MongoDB", "Python", "Java", "C/C++"],
        texts: ["Achieved my degree in Computer Science at the Univeristy of Northwestern St. Paul"],
        images: [],
        videos: []
    },
    {
        title: "Systems Analyst",
        company: "Yield Systems Analysis and Design",
        skills: ["HTML5", "Vanilla JS", "CSS"],
        texts: ["Translated business needs to software architecture plans", "Built custom client analytics software to fit hyper-specific business needs", "Custom Software saves an estimated 32 hours of work per quarter"],
        images: ["/analytics.png"],
        videos: []
    },
];

// Function to render experience modules dynamically based on arrays
function renderModules() {
    const container = document.getElementById('modules-container');
    if (!container) return; // Prevent errors on other pages

    container.innerHTML = ''; 

    experienceData.forEach((module, index) => {
        const skillsHTML = module.skills.map(skill => `<span class="skill-tag">${skill.trim()}</span>`).join('');
        
        // Construct Text blocks
        const textsHTML = module.texts.map(text => `<div class="module-text-block"><p>${text}</p></div>`).join('');
        
        // Construct Media (Images + Videos) Grid
        let mediaHTML = '';
        module.images.forEach(imgUrl => {
            mediaHTML += `<img src="${imgUrl}" alt="Project Image" class="module-media">`;
        });
        module.videos.forEach(vidUrl => {
            // If it's a direct mp4
            if(vidUrl.endsWith('.mp4')) {
                mediaHTML += `<video src="${vidUrl}" controls class="module-media"></video>`;
            } else {
                // Assume iframe embed (like youtube)
                mediaHTML += `<iframe src="${vidUrl}" frameborder="0" allowfullscreen class="module-media" style="min-height: 200px;"></iframe>`;
            }
        });

        // Assemble Final Module
        const moduleHTML = `
            <div class="module-card">
                <div class="module-header">
                    <h3 class="module-title">${module.title}</h3>
                    <span class="module-company">${module.company}</span>
                </div>
                <div class="module-skills">${skillsHTML}</div>
                
                ${textsHTML}

                ${mediaHTML ? `<div class="module-content-grid">${mediaHTML}</div>` : ''}
            </div>
        `;
        container.insertAdjacentHTML('beforeend', moduleHTML);
    });

    observeCards();
}

// --- Scroll Animations & Parallax ---
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            entry.target.classList.add('visible'); 
        }
    });
}, observerOptions);

function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));
}

function observeCards() {
    const cards = document.querySelectorAll('.module-card');
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

// Parallax effect
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.background-shape');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 20;
        const xOffset = (window.innerWidth / 2 - e.clientX) / speed;
        const yOffset = (window.innerHeight / 2 - e.clientY) / speed;
        shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
});
