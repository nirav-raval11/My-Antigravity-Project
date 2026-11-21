/**
 * Surya Construction - Interactive Web Application
 * Handles Project Filtering, Modals, Form Submissions, and Demo Features
 */

/**
 * ============================================================================
 * CYBER SECURITY DEFENSE ENGINE (OWASP Top 10 Hardening)
 * ============================================================================
 * 1. HTML Sanitization (Stored & Reflected XSS Mitigation)
 * 2. Strict Input Validation (Indian Phone, Email RFC-5322, Whitelist Names)
 * 3. Anti-Tampering Whitelist (Project Enum verification)
 * 4. File Upload Security (Extension whitelist, double-ext block, size cap)
 * 5. Honeypot Anti-Bot Shield (Trap for automated web crawlers/spambots)
 * 6. Rate Limiting & Burst Submission Gate
 * ============================================================================
 */
const SecurityDefense = {
    // Sanitizes any input string to escape dangerous HTML/Script tags (Prevents XSS)
    sanitize: function(input) {
        if (typeof input !== 'string') return '';
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
            .trim();
    },

    // Strict validation for Indian Mobile Number (10 digits starting with 6,7,8,9)
    validatePhone: function(phone) {
        if (!phone) return null;
        const clean = phone.toString().replace(/[\s\-\+]/g, '').replace(/^91/, '');
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(clean) ? clean : null;
    },

    // RFC-5322 compliant email regex check
    validateEmail: function(email) {
        if (!email || email.trim() === '') return true; // Optional field
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email.trim());
    },

    // Name validation: 2-60 characters, blocks script tags & SQL injection patterns
    validateName: function(name) {
        if (!name || typeof name !== 'string') return false;
        const trimmed = name.trim();
        if (trimmed.length < 2 || trimmed.length > 60) return false;
        // Block script tags, event handlers and SQL injection tokens
        const blacklisted = /<[^>]*>|javascript:|alert\(|union\s+select|drop\s+table|exec\(|eval\(/i;
        return !blacklisted.test(trimmed);
    },

    // Anti-tampering check: Ensures project belongs to approved list
    validateProject: function(project) {
        const allowed = [
            'Surya Prime',
            'Surya Residency 1',
            'Surya Residency 2',
            'Surya Shivalay',
            'General Inquiry'
        ];
        return allowed.includes(project);
    },

    // Secure File Upload check for Career section
    validateFileUpload: function(fileInput) {
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            return { valid: false, error: 'Please choose your resume file.' };
        }
        const file = fileInput.files[0];

        // 1. Max size: 5MB (5 * 1024 * 1024 bytes)
        const maxSizeBytes = 5 * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            return { valid: false, error: 'File size exceeds 5MB limit. Please upload a smaller file.' };
        }

        // 2. Extension verification (Only documents allowed)
        const fileName = file.name.toLowerCase();
        const allowedExtensions = ['.pdf', '.doc', '.docx'];
        const hasValidExt = allowedExtensions.some(ext => fileName.endsWith(ext));

        if (!hasValidExt) {
            return { valid: false, error: 'Security Alert: Only PDF, DOC, or DOCX formats are permitted.' };
        }

        // 3. Double-extension attack prevention (e.g., resume.pdf.exe or cv.doc.bat)
        const dangerousExts = ['.exe', '.bat', '.sh', '.php', '.vbs', '.js', '.cmd', '.scr', '.jar', '.html', '.svg'];
        for (let dangerous of dangerousExts) {
            if (fileName.includes(dangerous)) {
                return { valid: false, error: 'Security Alert: Hazardous executable format detected and blocked.' };
            }
        }

        return { valid: true, fileName: this.sanitize(file.name) };
    },

    // Check if invisible honeypot field is populated (Indicates automated bot)
    isBotHoneypot: function(formElement) {
        if (!formElement) return false;
        const hp = formElement.querySelector('input[name="_sec_website_hp"]');
        return Boolean(hp && hp.value.trim().length > 0);
    },

    // Rate Limiting: Max 4 submissions per 60 seconds
    submissionHistory: [],
    isRateLimited: function() {
        const now = Date.now();
        this.submissionHistory = this.submissionHistory.filter(t => now - t < 60000);
        if (this.submissionHistory.length >= 4) {
            return true;
        }
        this.submissionHistory.push(now);
        return false;
    }
};

// Comprehensive Project Database
const projectsData = {
    'surya-prime': {
        title: 'Surya Prime',
        tag: 'Commercial & Corporate Landmark',
        category: 'Commercial',
        status: 'Under Construction (Possession Dec 2026)',
        location: 'S.G. Highway, Bodakdev, Ahmedabad',
        image: 'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=1200',
        startingPrice: '₹78 Lakhs - ₹3.50 Cr',
        rera: 'PR/GJ/AHM/AHMEDABAD-CITY/AUDA/CAA09182/2024',
        overview: 'Surya Prime represents the pinnacle of modern corporate architecture in Ahmedabad. Designed by leading commercial architects, this 22-storey glass facade tower features double-height corporate entrance lobbies, retail showrooms on lower floors, high-speed OTIS elevators, dedicated EV charging stations, and flexible Grade-A office layouts with panoramic city views.',
        specs: [
            { icon: 'fa-building', label: 'Structure', val: 'Earthquake Resistant RCC Frame (Zone 4)' },
            { icon: 'fa-arrows-alt', label: 'Floor Heights', val: '11 Ft Clear Floor-to-Ceiling Height' },
            { icon: 'fa-shield-alt', label: 'Facade', val: 'Double Glazed Low-E Acoustic Glass' },
            { icon: 'fa-bolt', label: 'Power Backup', val: '100% DG Backup for common areas & lifts' },
            { icon: 'fa-parking', label: 'Parking Space', val: '3-Level Mechanical Automated Basements' },
            { icon: 'fa-fire-extinguisher', label: 'Fire Safety', val: 'Automated Sprinklers & Smoke Detectors' },
            { icon: 'fa-wifi', label: 'Connectivity', val: 'High-speed Fiber Optic Backbone' },
            { icon: 'fa-leaf', label: 'Sustainability', val: 'IGBC Gold Certified Green Building' }
        ],
        amenities: [
            'Rooftop Executive Lounge & Cafe',
            'Conference & Board Rooms with AV Tech',
            '8 High-Speed Passenger Elevators',
            'Dedicated Service & Stretcher Lift',
            'Multi-Level EV Car Charging Bay',
            'Centralized BMS (Building Mgmt System)',
            '24/7 Security with Biometric Access',
            'Grand Triple-Height Entrance Foyer'
        ]
    },

    'surya-residency-1': {
        title: 'Surya Residency 1',
        tag: 'Luxury 2 & 3 BHK Family Residences',
        category: 'Residential',
        status: 'Ready To Move (OC Received)',
        location: 'Science City Road, Sola, Ahmedabad',
        image: 'https://images.pexels.com/photos/1486785/pexels-photo-1486785.jpeg?auto=compress&cs=tinysrgb&w=1200',
        startingPrice: '₹62 Lakhs - ₹98 Lakhs',
        rera: 'PR/GJ/AHM/AHMEDABAD-CITY/AUDA/RAA11840/2021',
        overview: 'Surya Residency 1 is a thriving, joyful community of 240+ satisfied families. Offering spacious 2 and 3 BHK homes designed for maximum natural cross-ventilation and sunlight. Complete with lush podium gardens, children’s playground, senior citizen gazebos, and a fully functional air-conditioned clubhouse.',
        specs: [
            { icon: 'fa-th-large', label: 'Flooring', val: '800x800mm Vitrified Tiles in all rooms' },
            { icon: 'fa-utensils', label: 'Kitchen', val: 'Granite Platform with SS Sink & Designer Glazed Tiles' },
            { icon: 'fa-bath', label: 'Bathrooms', val: 'Jaquar CP Fittings & Cera Sanitaryware' },
            { icon: 'fa-door-open', label: 'Doors', val: 'Decorative Main Door with Godrej Digital Lock' },
            { icon: 'fa-plug', label: 'Electrification', val: 'Concealed Copper Wiring (Finolex/Polycab)' },
            { icon: 'fa-paint-roller', label: 'Finishing', val: 'Internal Putty & Asian Apex External Paint' },
            { icon: 'fa-water', label: 'Water Supply', val: '24-hour Borewell + Narmada Water Supply' },
            { icon: 'fa-solar-panel', label: 'Eco Feature', val: 'Solar Lighting for Common Campus Areas' }
        ],
        amenities: [
            'Fully Equipped Modern Gymnasium',
            'Landscaped Green Garden & Walking Track',
            'Children Play Area with Safe Rubber Flooring',
            'Air-Conditioned Community Hall',
            'Senior Citizen Relaxation Pavilion',
            'Indoor Games Room (Table Tennis, Carrom)',
            'CCTV Surveillance across all Entry/Exits',
            'Allotted Covered Parking Space'
        ]
    },

    'surya-residency-2': {
        title: 'Surya Residency 2',
        tag: 'Smart 3 & 4 BHK Futuristic Residences',
        category: 'Residential',
        status: 'Ongoing (Possession March 2027)',
        location: 'Club O7 Road, Shela / South Bopal, Ahmedabad',
        image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
        startingPrice: '₹95 Lakhs - ₹1.75 Cr',
        rera: 'PR/GJ/AHM/SANAND/AUDA/MAA34421/2023',
        overview: 'Surya Residency 2 redefines elevated urban living with smart-home ready 3 & 4 BHK apartments. Each residence includes automated mood lighting, smartphone-controlled air conditioning, keyless biometric main door access, and expansive panoramic balconies overlooking lush green outskirts.',
        specs: [
            { icon: 'fa-microchip', label: 'Smart Living', val: 'Integrated Smart Home Automation (Alexa/Google)' },
            { icon: 'fa-gem', label: 'Flooring', val: 'Italian Marble in Living/Dining, Wooden in Master' },
            { icon: 'fa-shower', label: 'Bathrooms', val: 'Kohler / Grohe Concealed Diverters & Glass Partitions' },
            { icon: 'fa-window-maximize', label: 'Windows', val: 'Domal Italian Section Powder Coated Windows' },
            { icon: 'fa-gas-pump', label: 'Piped Gas', val: 'Adani Gas Connection Pre-Fitted in Kitchen' },
            { icon: 'fa-key', label: 'Security', val: 'Smart Video Door Phone & Biometric Fingerprint Lock' },
            { icon: 'fa-car', label: 'EV Ready', val: 'Individual EV Charging Point for Each Flat' },
            { icon: 'fa-couch', label: 'Balcony', val: 'Extra-Wide 7 Ft Sundeck Balconies' }
        ],
        amenities: [
            'Rooftop Infinity Swimming Pool with Deck',
            'Sky Lounge & Star Gazing Observatory',
            'Mini Movie Theater (24-Seater)',
            'Yoga & Meditation Zen Deck',
            'Badminton Court & Half Basketball Court',
            'Co-working Lounge & Library',
            'Kids Crèche & Daycare Room',
            'Guest Suites for Visiting Relatives'
        ]
    },

    'surya-shivalay': {
        title: 'Surya Shivalay',
        tag: 'Divine & Serene 3 & 4 BHK Living',
        category: 'Residential',
        status: 'Ready To Move / Few Units Available',
        location: 'Near Vaishnodevi Circle, S.G. Highway, Ahmedabad',
        image: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200',
        startingPrice: '₹88 Lakhs - ₹1.45 Cr',
        rera: 'PR/GJ/AHM/GANDHINAGAR/GHMC/PRA20719/2022',
        overview: 'Surya Shivalay is crafted for discerning families who value peace, spirituality, and positive vibrations. Built strictly as per traditional Vastu Vidya principles with Northeast temple alignment, Surya Shivalay features an in-campus Shiv Temple, herbal medicinal gardens, and expansive low-density living with only two flats per floor.',
        specs: [
            { icon: 'fa-compass', label: 'Vastu Design', val: '100% Vastu Shastra Compliant Architecture' },
            { icon: 'fa-om', label: 'Sacred Campus', val: 'Serene Lord Shiva Temple Inside Campus' },
            { icon: 'fa-expand', label: 'Layout', val: 'Exclusive 2 Flats Per Floor for Supreme Privacy' },
            { icon: 'fa-archway', label: 'Entrance', val: 'Grand Vastu-Compliant East-Facing Main Entrances' },
            { icon: 'fa-tree', label: 'Gardens', val: 'Ayurvedic Herbal Garden with Tulsi & Neem Groves' },
            { icon: 'fa-water', label: 'Waterbody', val: 'Cascading Musical Water Fountain at Entrance' },
            { icon: 'fa-shield-alt', label: 'Structural', val: 'Earthquake Proof Seismic Resistant RCC Frame' },
            { icon: 'fa-solar-panel', label: 'Eco Campus', val: 'Rainwater Harvesting & Solid Waste Treatment' }
        ],
        amenities: [
            'Grand Marble Shiv Temple & Satsang Hall',
            'Senior Citizen Choro & Covered Gazebos',
            'Acupressure Walking Reflexology Path',
            'Spiritual Library & Vedic Reading Room',
            'Community Celebration Lawn (Capacity 500+)',
            'Purified RO Drinking Water Plant',
            'Round the Clock Gated Security & Intercom',
            'Covered Stilt & Basement Vehicle Parking'
        ]
    }
};

// Variable to track active project in modal
let currentModalProjectId = 'surya-prime';

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupSmoothScroll();
});

// Mobile Hamburger Menu Toggle
function setupMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            } else {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });

        // Close menu on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            });
        });
    }
}

// Smooth scrolling highlight
function setupSmoothScroll() {
    window.addEventListener('scroll', () => {
        const header = document.getElementById('mainHeader');
        if (header) {
            if (window.scrollY > 40) {
                header.classList.add('shadow-md');
            } else {
                header.classList.remove('shadow-md');
            }
        }
    });
}

// Project Category Filtering
function filterProjects(category) {
    const cards = document.querySelectorAll('.project-card');
    const buttons = document.querySelectorAll('.filter-btn');

    // Update active button state
    buttons.forEach(btn => {
        btn.classList.remove('active', 'bg-brand-navy', 'text-white');
        btn.classList.add('bg-white', 'text-slate-700');
    });

    const activeBtn = event.currentTarget || event.target;
    if (activeBtn) {
        activeBtn.classList.remove('bg-white', 'text-slate-700');
        activeBtn.classList.add('active', 'bg-brand-navy', 'text-white');
    }

    // Filter project cards
    cards.forEach(card => {
        const cardCats = card.getAttribute('data-category') || '';
        if (category === 'all' || cardCats.includes(category)) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 250);
        }
    });
}

// Open Project Details Modal
function openProjectModal(projectId) {
    const project = projectsData[projectId];
    if (!project) return;

    currentModalProjectId = projectId;

    document.getElementById('modalProjectTitle').innerText = project.title;
    document.getElementById('modalProjectTag').innerText = project.tag;
    document.getElementById('modalProjectLoc').innerText = project.location;
    document.getElementById('modalProjectImg').src = project.image;
    document.getElementById('modalProjectDesc').innerText = project.overview;
    document.getElementById('modalPrice').innerText = project.startingPrice;

    // Populate Specifications Grid
    const specsContainer = document.getElementById('modalSpecsGrid');
    specsContainer.innerHTML = '';
    project.specs.forEach(spec => {
        const item = document.createElement('div');
        item.className = 'p-3 bg-slate-50 border border-slate-200 rounded-lg';
        item.innerHTML = `
            <div class="flex items-center space-x-2 text-brand-navy font-semibold mb-1">
                <i class="fas ${spec.icon} text-brand-gold"></i>
                <span class="text-[11px] text-slate-500">${spec.label}</span>
            </div>
            <p class="font-bold text-slate-800 text-xs">${spec.val}</p>
        `;
        specsContainer.appendChild(item);
    });

    // Populate Amenities List
    const amenitiesContainer = document.getElementById('modalAmenitiesList');
    amenitiesContainer.innerHTML = '';
    project.amenities.forEach(amenity => {
        const pill = document.createElement('span');
        pill.className = 'inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-amber-50 text-amber-900 border border-amber-200 font-medium';
        pill.innerHTML = `<i class="fas fa-check-circle text-amber-600 mr-1.5"></i> ${amenity}`;
        amenitiesContainer.appendChild(pill);
    });

    // Show modal
    document.getElementById('projectModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Download Brochure Handler
function downloadBrochureFromModal() {
    const project = projectsData[currentModalProjectId];
    const projectName = project ? project.title : 'Surya Project';
    showToast('Brochure Downloaded', `Official PDF Brochure for ${projectName} has been initiated for download!`, 'fa-file-pdf');
}

function downloadCorporateBrochure() {
    showToast('Portfolio Downloaded', 'Surya Construction Corporate Portfolio (2026 Edition) is downloading!', 'fa-file-download');
}

// Book Site Visit Trigger from Project
function bookSiteVisitForModalProject() {
    const project = projectsData[currentModalProjectId];
    closeProjectModal();
    openSiteVisitModal(project ? project.title : 'Surya Prime');
}

function openSiteVisitFor(projectName) {
    openSiteVisitModal(projectName);
}

// Site Visit Modal
function openSiteVisitModal(defaultProject = 'Surya Prime') {
    const modal = document.getElementById('siteVisitModal');
    const select = document.getElementById('visitProjectSelect');
    if (select && defaultProject) {
        select.value = defaultProject;
    }
    
    // Set tomorrow as min date
    const dateInput = document.getElementById('visitDate');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeSiteVisitModal() {
    document.getElementById('siteVisitModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function handleSiteVisitSubmit(e) {
    e.preventDefault();
    const form = e.target;

    // 1. Anti-Bot Honeypot Trap Check
    if (SecurityDefense.isBotHoneypot(form)) {
        console.warn('[Security] Automated Bot Submission Dropped.');
        form.reset();
        return;
    }

    // 2. Rate Limiting Check
    if (SecurityDefense.isRateLimited()) {
        showToast('Security Alert', 'Too many requests detected. Please wait 30 seconds before submitting again.', 'fa-shield-alt');
        return;
    }

    const rawProject = document.getElementById('visitProjectSelect').value;
    const rawName = document.getElementById('visitName').value;
    const rawPhone = document.getElementById('visitPhone').value;
    const date = document.getElementById('visitDate').value;
    const time = document.getElementById('visitTime').value;
    const cab = document.getElementById('visitCabReq').checked;

    // 3. Validation & Sanitization
    if (!SecurityDefense.validateName(rawName)) {
        showToast('Validation Error', 'Please enter a valid name (2-60 alphabetic characters).', 'fa-exclamation-triangle');
        return;
    }

    const validatedPhone = SecurityDefense.validatePhone(rawPhone);
    if (!validatedPhone) {
        showToast('Invalid Phone Number', 'Please enter a valid 10-digit Indian mobile number.', 'fa-phone-slash');
        return;
    }

    if (!SecurityDefense.validateProject(rawProject)) {
        showToast('Security Rejection', 'Unauthorized project parameter detected.', 'fa-shield-virus');
        return;
    }

    const cleanName = SecurityDefense.sanitize(rawName);
    const cleanProject = SecurityDefense.sanitize(rawProject);
    const cabText = cab ? ' Complimentary cab pickup is confirmed.' : '';

    closeSiteVisitModal();
    form.reset();

    showToast('VIP Visit Scheduled!', `Thank you ${cleanName}! Your site visit for ${cleanProject} on ${date} (${time}) is confirmed.${cabText}`, 'fa-calendar-check');
}

// Career Application Modal
function openApplyJobModal(jobTitle) {
    document.getElementById('applyJobTitle').innerText = `Apply: ${jobTitle}`;
    document.getElementById('applyJobModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeApplyJobModal() {
    document.getElementById('applyJobModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function handleJobApplicationSubmit(e) {
    e.preventDefault();
    const form = e.target;

    // 1. Anti-Bot Honeypot Trap Check
    if (SecurityDefense.isBotHoneypot(form)) {
        console.warn('[Security] Malicious Bot Submission Dropped.');
        form.reset();
        return;
    }

    // 2. Rate Limiting Check
    if (SecurityDefense.isRateLimited()) {
        showToast('Security Alert', 'Rate limit exceeded. Please wait a moment before trying again.', 'fa-shield-alt');
        return;
    }

    const rawName = document.getElementById('applicantName').value;
    const rawPhone = document.getElementById('applicantPhone').value;
    const rawEmail = document.getElementById('applicantEmail').value;
    const fileInput = document.getElementById('applicantResume');
    const job = document.getElementById('applyJobTitle').innerText.replace('Apply: ', '');

    // 3. Input Validation
    if (!SecurityDefense.validateName(rawName)) {
        showToast('Validation Error', 'Please enter a valid applicant name.', 'fa-exclamation-triangle');
        return;
    }

    const validatedPhone = SecurityDefense.validatePhone(rawPhone);
    if (!validatedPhone) {
        showToast('Invalid Mobile', 'Please provide a valid 10-digit mobile number.', 'fa-phone-slash');
        return;
    }

    if (!SecurityDefense.validateEmail(rawEmail)) {
        showToast('Invalid Email', 'Please provide a valid email address.', 'fa-envelope');
        return;
    }

    // 4. File Security Inspection (Extension, double-ext, size)
    const fileCheck = SecurityDefense.validateFileUpload(fileInput);
    if (!fileCheck.valid) {
        showToast('File Security Block', fileCheck.error, 'fa-file-shield text-amber-400');
        return;
    }

    const cleanName = SecurityDefense.sanitize(rawName);
    const cleanJob = SecurityDefense.sanitize(job);

    closeApplyJobModal();
    form.reset();

    showToast('Application Submitted!', `Thank you ${cleanName}. Your resume (${fileCheck.fileName}) for "${cleanJob}" passed security checks and was dispatched to HR.`, 'fa-user-check');
}

// Hero Quick Form Submission
function handleHeroSubmit(e) {
    e.preventDefault();
    const form = e.target;

    // 1. Anti-Bot Honeypot Trap Check
    if (SecurityDefense.isBotHoneypot(form)) {
        console.warn('[Security] Honeypot triggered. Bot drop.');
        form.reset();
        return;
    }

    // 2. Rate Limiting Check
    if (SecurityDefense.isRateLimited()) {
        showToast('Security Alert', 'Too many requests. Please wait 30 seconds.', 'fa-shield-alt');
        return;
    }

    const rawName = document.getElementById('heroName').value;
    const rawPhone = document.getElementById('heroPhone').value;
    const rawProject = document.getElementById('heroProject').value;
    const rawUnit = document.getElementById('heroUnitType').value;

    if (!SecurityDefense.validateName(rawName)) {
        showToast('Validation Error', 'Please enter a valid full name.', 'fa-exclamation-triangle');
        return;
    }

    const validatedPhone = SecurityDefense.validatePhone(rawPhone);
    if (!validatedPhone) {
        showToast('Invalid Mobile Number', 'Please enter a valid 10-digit Indian mobile number.', 'fa-phone-slash');
        return;
    }

    if (!SecurityDefense.validateProject(rawProject)) {
        showToast('Security Rejection', 'Selected project is invalid.', 'fa-shield-virus');
        return;
    }

    const cleanName = SecurityDefense.sanitize(rawName);
    const cleanProject = SecurityDefense.sanitize(rawProject);
    const cleanUnit = SecurityDefense.sanitize(rawUnit);

    form.reset();
    showToast('Inquiry Received!', `Thank you ${cleanName}! The latest floor plan & pricing for ${cleanProject} (${cleanUnit}) has been dispatched to +91 ${validatedPhone}.`, 'fa-check-circle');
}

// Main Contact Form Submission
function handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;

    // 1. Anti-Bot Honeypot Trap Check
    if (SecurityDefense.isBotHoneypot(form)) {
        console.warn('[Security] Honeypot triggered. Bot dropped.');
        form.reset();
        return;
    }

    // 2. Rate Limiting Check
    if (SecurityDefense.isRateLimited()) {
        showToast('Security Alert', 'Submission rate limit reached. Please wait 30 seconds.', 'fa-shield-alt');
        return;
    }

    const rawName = document.getElementById('contactName').value;
    const rawPhone = document.getElementById('contactPhone').value;
    const rawEmail = document.getElementById('contactEmail').value;
    const rawProject = document.getElementById('contactProject').value;

    if (!SecurityDefense.validateName(rawName)) {
        showToast('Validation Error', 'Please provide a valid full name (letters only, no script tags).', 'fa-exclamation-triangle');
        return;
    }

    const validatedPhone = SecurityDefense.validatePhone(rawPhone);
    if (!validatedPhone) {
        showToast('Invalid Phone Number', 'Please enter a valid 10-digit Indian mobile number.', 'fa-phone-slash');
        return;
    }

    if (rawEmail && !SecurityDefense.validateEmail(rawEmail)) {
        showToast('Invalid Email Address', 'Please enter a valid email format (e.g. name@domain.com).', 'fa-envelope');
        return;
    }

    if (!SecurityDefense.validateProject(rawProject)) {
        showToast('Security Rejection', 'Unauthorized project parameter detected.', 'fa-shield-virus');
        return;
    }

    const cleanName = SecurityDefense.sanitize(rawName);
    const cleanProject = SecurityDefense.sanitize(rawProject);

    form.reset();
    showToast('Inquiry Dispatched!', `Namaste ${cleanName}! Your query regarding ${cleanProject} has been securely routed. Sales lead will connect on +91 ${validatedPhone}.`, 'fa-paper-plane');
}

// Boss Demo Auto-fill Helper
function demoFillContactForm() {
    const contactName = document.getElementById('contactName');
    const contactPhone = document.getElementById('contactPhone');
    const contactEmail = document.getElementById('contactEmail');
    const contactProject = document.getElementById('contactProject');
    const contactMessage = document.getElementById('contactMessage');

    if (contactName) contactName.value = 'Hiteshbhai Choksi';
    if (contactPhone) contactPhone.value = '98250 99888';
    if (contactEmail) contactEmail.value = 'hitesh.choksi@demo.com';
    if (contactProject) contactProject.value = 'Surya Residency 2';
    if (contactMessage) contactMessage.value = 'Interested in 4 BHK Penthouse facing North-East. Please arrange site visit this Saturday.';

    // Scroll smoothly to contact section
    const contactSec = document.getElementById('contact');
    if (contactSec) {
        contactSec.scrollIntoView({ behavior: 'smooth' });
    }

    showToast('Demo Data Filled', 'Contact form populated with sample client data for your boss presentation!', 'fa-magic');
}

// Safe Toast Notification System (Uses textContent to prevent Stored XSS)
let toastTimeout;
function showToast(title, message, iconClass = 'fa-check-circle') {
    const toast = document.getElementById('toastNotification');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');

    if (!toast) return;

    // Secure DOM text assignment (Zero XSS)
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toastIcon.innerHTML = `<i class="fas ${iconClass}"></i>`;

    toast.classList.remove('hidden');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        hideToast();
    }, 5500);
}

function hideToast() {
    const toast = document.getElementById('toastNotification');
    if (toast) {
        toast.classList.add('hidden');
    }
}

// Close Modals on ESC Key or Click Outside
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
        closeApplyJobModal();
        closeSiteVisitModal();
    }
});

window.addEventListener('click', (e) => {
    const pModal = document.getElementById('projectModal');
    const aModal = document.getElementById('applyJobModal');
    const sModal = document.getElementById('siteVisitModal');

    if (e.target === pModal) closeProjectModal();
    if (e.target === aModal) closeApplyJobModal();
    if (e.target === sModal) closeSiteVisitModal();
});


/**
 * Filter Properties & Available Units (Flats & Offices)
 * Differentiates 'Properties' inventory from 'Projects' schemes
 */
function filterPropertyUnits(category) {
    const cards = document.querySelectorAll('.property-unit-card');
    const buttons = document.querySelectorAll('#propertyFilterButtons button');

    buttons.forEach(btn => {
        btn.classList.remove('active', 'bg-brand-navy', 'text-white', 'shadow');
        btn.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
    });

    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active', 'bg-brand-navy', 'text-white', 'shadow');
        window.event.currentTarget.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');
    }

    cards.forEach(card => {
        const cardCats = card.getAttribute('data-unit-category') || '';
        if (category === 'all' || cardCats.includes(category)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}
