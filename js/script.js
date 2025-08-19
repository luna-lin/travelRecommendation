const searchBox = document.querySelector('.search-box');
const searchBtn = document.querySelector('.search-btn');
const clearBtn = document.querySelector('.clear-btn');

if (searchBtn !== null) {
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchBox.value.trim();
        if (!searchTerm) return;

        showLoading();

        fetch('https://luna-lin.github.io/travelRecommendation/data/travel_recommendation_api.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok " + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const results = searchData(data, searchTerm);
                displayRecommendations(results, searchTerm);
            })
            .catch(error => {
                console.error("There was a problem with the fetch operation:", error);
                showError();
            });
    });
}

if (clearBtn !== null) {
    clearBtn.addEventListener('click', function() {
        searchBox.value = '';
        searchBox.focus();
        closeRecommendations();
    });
}

if (searchBox !== null) {
    searchBox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
}

function searchData(data, searchTerm) {
    const term = searchTerm.toLowerCase();
    if (term.includes('beach')) {
        return data["beaches"]
    }
    if (term.includes('temple')) {
        return data["temples"]
    }
    if (term.includes('australia')) {
        return data["countries"][0]["cities"]
    }
    if (term.includes('japan')) {
        return data["countries"][1]["cities"]
    }
    if (term.includes('brazil')) {
        return data["countries"][2]["cities"]
    }
}

async function displayRecommendations(results, searchTerm) {
    const container = document.getElementById('recommendationsContainer');
    const content = document.getElementById('recommendationsContent');
    
    let html = '';

    // Check if search term is a location for time display
    const locationResult = results.find(item => 
        item.name.toLowerCase().split(',')[1].includes(searchTerm.toLowerCase())
    );

    if (locationResult) {
        let timezone;
        if (locationResult.name.includes('Australia')) timezone = 'Australia/Sydney';
        else if (locationResult.name.includes('Japan')) timezone = 'Asia/Tokyo';
        else if (locationResult.name.includes('Brazil')) timezone = 'America/Sao_Paulo';

        const timeData = await getCurrentTime(timezone, locationResult.name);
        if (timeData) {
            html += `
                <div class="time-display">
                    <div class="location">Current time in ${timeData.location}</div>
                    <div class="current-time">${timeData.time}</div>
                </div>
            `;
        }
    }

    results.forEach((item, index) => {
        html += `
            <div class="recommendation-card" data-index="${index}">
                <img src="${item.imageUrl}" alt="${item.name}" class="card-image">
                <div class="card-content">
                    <div class="card-title">${item.name}</div>
                    <div class="card-description">${item.description}</div>
                    <button class="card-button" onclick="visitRecommendation(${item.id})">Visit</button>
                </div>
            </div>
        `;
    });

    if (results.length === 0) {
        html += '<div style="text-align: center; padding: 40px; color: #666;">No recommendations found for your search.</div>';
    }

    content.innerHTML = html;
    
    container.classList.add('show');
    
    setTimeout(() => {
        const cards = document.querySelectorAll('.recommendation-card');
        cards.forEach(card => {
            card.classList.add('animate');
        });
    }, 100);
}

async function getCurrentTime(timezone, location) {
    try {
        const now = new Date();
        const timeString = now.toLocaleString('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        
        return {
            time: timeString,
            location: location
        };
    } catch (error) {
        console.error('Error getting time:', error);
        return null;
    }
}

function showLoading() {
    const container = document.getElementById('recommendationsContainer');
    const content = document.getElementById('recommendationsContent');
    
    content.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            Searching for recommendations...
        </div>
    `;
    
    container.classList.add('show');
}

function showError() {
    const content = document.getElementById('recommendationsContent');
    content.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #e74c3c;">
            <div style="font-size: 18px; margin-bottom: 10px;">Oops! Something went wrong</div>
            <div>Please try your search again.</div>
        </div>
    `;
}

function closeRecommendations() {
    const container = document.getElementById('recommendationsContainer');
    container.classList.remove('show');
}

function visitRecommendation(id) {
    console.log('Visiting recommendation with ID:', id);
    window.location.href = '/contact.html';
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeRecommendations();
    }
});

document.addEventListener('click', function(e) {
    const container = document.getElementById('recommendationsContainer');
    const searchContainer = document.querySelector('.search-container');
    if (container === null) return;
    
    if (!container.contains(e.target) && !searchContainer.contains(e.target) && container.classList.contains('show')) {
        closeRecommendations();
    }
});

const bookNowBtn = document.querySelector('.book-now-btn');
if (bookNowBtn !== null) {
    bookNowBtn.addEventListener('click', function() {
        window.location.href = '/contact.html';
    });
}

// Navigation functionality
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        this.classList.add('active');
        
        // Handle navigation (you would implement actual page routing here)
        const href = this.getAttribute('href');
        if (href === '#home') {
            alert('Navigate to Home page');
        } else if (href === '#about') {
            alert('Navigate to About page');
        }
    });
});

// Add interactive hover effects to floating elements
const floatingElements = document.querySelectorAll('.floating-element');
floatingElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2)';
        this.style.background = 'rgba(0, 188, 212, 0.3)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.background = 'rgba(255, 255, 255, 0.1)';
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-element');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add typing effect to hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect after page load
window.addEventListener('load', function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle === null) return;
    const originalText = heroTitle.textContent;
    
    // Uncomment the line below if you want the typing effect
    // typeWriter(heroTitle, originalText, 150);
});

// Form submission handling
const contactForm = document.getElementById('contactForm');
const messageDiv = document.getElementById('message');

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.add('show');
    
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 5000);
}

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Basic validation
    if (!name.trim() || !email.trim() || !message.trim()) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }

    // Simulate form submission
    const submitBtn = this.querySelector('.submit-btn');
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    setTimeout(() => {
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
        submitBtn.textContent = 'Submit';
        submitBtn.disabled = false;
    }, 2000);
});

// Form field animations
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
    });
});

// Add typing animation to form labels
const labels = document.querySelectorAll('.form-group label');
labels.forEach((label, index) => {
    setTimeout(() => {
        label.style.opacity = '1';
        label.style.transform = 'translateX(0)';
    }, 1000 + (index * 200));
});

// Initialize label animations
labels.forEach(label => {
    label.style.opacity = '0';
    label.style.transform = 'translateX(-20px)';
    label.style.transition = 'all 0.3s ease';
});

// Team card hover effects
const teamCards = document.querySelectorAll('.team-card');
teamCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click animation to team avatars
const teamAvatars = document.querySelectorAll('.team-avatar');
teamAvatars.forEach(avatar => {
    avatar.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

// Smooth reveal animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe team cards for scroll animations
teamCards.forEach(card => {
    observer.observe(card);
});
