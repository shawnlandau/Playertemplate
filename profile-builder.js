// Profile Builder JavaScript
let currentStep = 1;
let totalSteps = 5;
let profileData = {};

// Sport-specific positions
const sportPositions = {
    'Baseball': ['Pitcher', 'Catcher', 'First Base', 'Second Base', 'Third Base', 'Shortstop', 'Left Field', 'Center Field', 'Right Field', 'Designated Hitter'],
    'Basketball': ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'],
    'Soccer': ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Winger'],
    'Football': ['Quarterback', 'Running Back', 'Wide Receiver', 'Tight End', 'Offensive Line', 'Defensive Line', 'Linebacker', 'Cornerback', 'Safety', 'Kicker', 'Punter'],
    'Tennis': ['Singles', 'Doubles'],
    'Swimming': ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'Individual Medley', 'Relay'],
    'Track & Field': ['Sprints', 'Distance', 'Hurdles', 'Jumps', 'Throws', 'Relay'],
    'Volleyball': ['Setter', 'Outside Hitter', 'Middle Blocker', 'Opposite Hitter', 'Libero', 'Defensive Specialist'],
    'Hockey': ['Goalie', 'Defenseman', 'Forward', 'Center', 'Winger'],
    'Lacrosse': ['Attack', 'Midfielder', 'Defense', 'Goalie', 'Face-off Specialist', 'Long-stick Midfielder'],
    'Other': []
};

// Initialize the builder
document.addEventListener('DOMContentLoaded', function() {
    initializeBuilder();
    setupEventListeners();
});

function initializeBuilder() {
    // Set up sport change listener
    const sportSelect = document.getElementById('sport');
    if (sportSelect) {
        sportSelect.addEventListener('change', function() {
            updatePositions(this.value);
        });
    }

    // Set up file upload listeners
    setupFileUploads();
}

function setupEventListeners() {
    // Profile photo upload
    const photoUploadArea = document.getElementById('photo-upload-area');
    const profilePhotoInput = document.getElementById('profile-photo');
    
    if (photoUploadArea && profilePhotoInput) {
        photoUploadArea.addEventListener('click', () => profilePhotoInput.click());
        profilePhotoInput.addEventListener('change', handlePhotoUpload);
    }

    // Video uploads
    setupVideoUploads();
}

function setupFileUploads() {
    // Profile photo
    const photoUploadArea = document.getElementById('photo-upload-area');
    const profilePhotoInput = document.getElementById('profile-photo');
    
    if (photoUploadArea && profilePhotoInput) {
        photoUploadArea.addEventListener('click', () => profilePhotoInput.click());
        profilePhotoInput.addEventListener('change', handlePhotoUpload);
    }
}

function setupVideoUploads() {
    const videoUploadAreas = document.querySelectorAll('.video-upload-area');
    videoUploadAreas.forEach((area, index) => {
        const videoInput = document.getElementById(`video-${index + 1}`);
        if (videoInput) {
            area.addEventListener('click', () => videoInput.click());
            videoInput.addEventListener('change', (e) => handleVideoUpload(e, index + 1));
        }
    });
}

function updatePositions(sport) {
    const positionsContainer = document.getElementById('positions-container');
    if (!positionsContainer) return;

    positionsContainer.innerHTML = '';
    
    const positions = sportPositions[sport] || [];
    positions.forEach(position => {
        const div = document.createElement('div');
        div.className = 'flex items-center';
        div.innerHTML = `
            <input type="checkbox" id="pos-${position.replace(/\s+/g, '-').toLowerCase()}" 
                   name="positions" value="${position}" class="mr-3">
            <label for="pos-${position.replace(/\s+/g, '-').toLowerCase()}" 
                   class="text-sm text-gray-700">${position}</label>
        `;
        positionsContainer.appendChild(div);
    });
}

function addCustomValue() {
    const customValueInput = document.getElementById('custom-value');
    const value = customValueInput.value.trim();
    
    if (value) {
        const valuesContainer = document.querySelector('input[name="values"]').parentElement.parentElement.parentElement;
        const newValueDiv = document.createElement('div');
        newValueDiv.className = 'flex items-center';
        newValueDiv.innerHTML = `
            <input type="checkbox" name="values" value="${value}" class="mr-3" checked>
            <label class="text-sm text-gray-700">${value}</label>
        `;
        valuesContainer.appendChild(newValueDiv);
        customValueInput.value = '';
    }
}

function addVideoUpload() {
    const videosContainer = document.getElementById('videos-container');
    const videoCount = videosContainer.children.length + 1;
    
    const videoDiv = document.createElement('div');
    videoDiv.className = 'border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors';
    videoDiv.innerHTML = `
        <input type="file" id="video-${videoCount}" accept="video/*" class="hidden">
        <div class="video-upload-area cursor-pointer">
            <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-3"></i>
            <p class="text-gray-600 mb-2">Click to upload a highlight video</p>
            <p class="text-sm text-gray-500">Supported formats: MP4, MOV, AVI</p>
        </div>
    `;
    
    videosContainer.appendChild(videoDiv);
    
    // Set up event listener for new upload area
    const newVideoInput = document.getElementById(`video-${videoCount}`);
    const newUploadArea = videoDiv.querySelector('.video-upload-area');
    
    newUploadArea.addEventListener('click', () => newVideoInput.click());
    newVideoInput.addEventListener('change', (e) => handleVideoUpload(e, videoCount));
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('preview-img').src = e.target.result;
            document.getElementById('photo-upload-area').classList.add('hidden');
            document.getElementById('photo-preview').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

function handleVideoUpload(event, videoIndex) {
    const file = event.target.files[0];
    if (file) {
        const uploadArea = event.target.parentElement.querySelector('.video-upload-area');
        uploadArea.innerHTML = `
            <i class="fas fa-check-circle text-3xl text-green-500 mb-3"></i>
            <p class="text-green-600 mb-2">Video uploaded successfully!</p>
            <p class="text-sm text-gray-500">${file.name}</p>
        `;
    }
}

function removePhoto() {
    document.getElementById('profile-photo').value = '';
    document.getElementById('photo-upload-area').classList.remove('hidden');
    document.getElementById('photo-preview').classList.add('hidden');
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepDisplay();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

function updateStepDisplay() {
    // Hide all step contents
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Show current step content
    const currentStepContent = document.getElementById(`step-${currentStep}-content`);
    if (currentStepContent) {
        currentStepContent.classList.remove('hidden');
        currentStepContent.classList.add('slide-in');
    }
    
    // Update progress bar
    const progressPercentage = (currentStep / totalSteps) * 100;
    document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
    
    // Update step indicators
    updateStepIndicators();
    
    // If we're on the review step, populate the review content
    if (currentStep === 5) {
        populateReviewContent();
    }
}

function updateStepIndicators() {
    for (let i = 1; i <= totalSteps; i++) {
        const stepElement = document.getElementById(`step-${i}`);
        stepElement.className = 'flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300';
        
        if (i < currentStep) {
            stepElement.classList.add('step-completed');
        } else if (i === currentStep) {
            stepElement.classList.add('step-active');
        } else {
            stepElement.classList.add('step-pending');
        }
    }
}

function validateCurrentStep() {
    const requiredFields = document.querySelectorAll(`#step-${currentStep}-content [required]`);
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('border-red-500');
            isValid = false;
        } else {
            field.classList.remove('border-red-500');
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields before proceeding.');
    }
    
    return isValid;
}

function populateReviewContent() {
    const reviewContent = document.getElementById('review-content');
    
    // Collect all form data
    const formData = collectFormData();
    
    reviewContent.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-gray-50 p-6 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                    <i class="fas fa-user mr-2"></i>Basic Information
                </h3>
                <div class="space-y-2 text-sm">
                    <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
                    <p><strong>Age:</strong> ${formData.age}</p>
                    <p><strong>Sport:</strong> ${formData.sport}</p>
                    <p><strong>Team:</strong> ${formData.currentTeam || 'Not specified'}</p>
                    <p><strong>Started Playing:</strong> Age ${formData.startedPlaying || 'Not specified'}</p>
                    <p><strong>Positions:</strong> ${formData.positions.join(', ') || 'None selected'}</p>
                </div>
            </div>
            
            <div class="bg-gray-50 p-6 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                    <i class="fas fa-address-book mr-2"></i>Contact Information
                </h3>
                <div class="space-y-2 text-sm">
                    <p><strong>Email:</strong> ${formData.contactEmail}</p>
                    <p><strong>Phone:</strong> ${formData.contactPhone || 'Not provided'}</p>
                    <p><strong>Instagram:</strong> ${formData.instagram || 'Not provided'}</p>
                    <p><strong>Twitter:</strong> ${formData.twitter || 'Not provided'}</p>
                </div>
            </div>
        </div>
        
        <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
                <i class="fas fa-file-alt mr-2"></i>About Section
            </h3>
            <div class="space-y-3 text-sm">
                <div>
                    <strong>Tagline:</strong>
                    <p class="text-gray-700 mt-1">${formData.tagline}</p>
                </div>
                <div>
                    <strong>About Paragraph 1:</strong>
                    <p class="text-gray-700 mt-1">${formData.about1}</p>
                </div>
                ${formData.about2 ? `
                <div>
                    <strong>About Paragraph 2:</strong>
                    <p class="text-gray-700 mt-1">${formData.about2}</p>
                </div>
                ` : ''}
                ${formData.about3 ? `
                <div>
                    <strong>About Paragraph 3:</strong>
                    <p class="text-gray-700 mt-1">${formData.about3}</p>
                </div>
                ` : ''}
                <div>
                    <strong>Core Values:</strong>
                    <p class="text-gray-700 mt-1">${formData.values.join(', ')}</p>
                </div>
            </div>
        </div>
        
        <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
                <i class="fas fa-palette mr-2"></i>Styling
            </h3>
            <div class="space-y-2 text-sm">
                <p><strong>Primary Color:</strong> ${formData.primaryColor}</p>
                <p><strong>Secondary Color:</strong> ${formData.secondaryColor}</p>
                <p><strong>Accent Color:</strong> ${formData.accentColor}</p>
            </div>
        </div>
    `;
}

function collectFormData() {
    const data = {};
    
    // Basic information
    data.firstName = document.getElementById('firstName').value;
    data.lastName = document.getElementById('lastName').value;
    data.age = document.getElementById('age').value;
    data.sport = document.getElementById('sport').value;
    data.currentTeam = document.getElementById('currentTeam').value;
    data.startedPlaying = document.getElementById('startedPlaying').value;
    
    // Positions
    const positionCheckboxes = document.querySelectorAll('input[name="positions"]:checked');
    data.positions = Array.from(positionCheckboxes).map(cb => cb.value);
    
    // About content
    data.tagline = document.getElementById('tagline').value;
    data.about1 = document.getElementById('about1').value;
    data.about2 = document.getElementById('about2').value;
    data.about3 = document.getElementById('about3').value;
    
    // Values
    const valueCheckboxes = document.querySelectorAll('input[name="values"]:checked');
    data.values = Array.from(valueCheckboxes).map(cb => cb.value);
    
    // Contact information
    data.contactEmail = document.getElementById('contactEmail').value;
    data.contactPhone = document.getElementById('contactPhone').value;
    data.instagram = document.getElementById('instagram').value;
    data.twitter = document.getElementById('twitter').value;
    
    // Styling
    data.primaryColor = document.getElementById('primaryColor').value;
    data.secondaryColor = document.getElementById('secondaryColor').value;
    data.accentColor = document.getElementById('accentColor').value;
    
    return data;
}

function generateProfile() {
    const formData = collectFormData();
    
    // Create config object
    const config = {
        player: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            initials: (formData.firstName.charAt(0) + formData.lastName.charAt(0)).toUpperCase(),
            age: parseInt(formData.age),
            sport: formData.sport,
            currentTeam: formData.currentTeam,
            positions: formData.positions,
            startedPlaying: parseInt(formData.startedPlaying),
            heroImage: "images/player.jpg"
        },
        content: {
            tagline: formData.tagline,
            about: {
                paragraph1: formData.about1,
                paragraph2: formData.about2,
                paragraph3: formData.about3
            },
            coreValues: formData.values
        },
        videos: [
            {
                filename: "videos/IMG_3539.MOV",
                title: "Game Highlights 1",
                description: "Fielding and batting highlights"
            },
            {
                filename: "videos/IMG_0704.mov",
                title: "Game Highlights 2", 
                description: "Pitching and base running"
            }
        ],
        contact: {
            email: formData.contactEmail,
            phone: formData.contactPhone,
            socialMedia: {
                instagram: formData.instagram,
                twitter: formData.twitter
            }
        },
        styling: {
            primaryColor: formData.primaryColor,
            secondaryColor: formData.secondaryColor,
            accentColor: formData.accentColor
        }
    };
    
    // Store config for download
    profileData = config;
    
    // Show success modal
    document.getElementById('success-modal').classList.remove('hidden');
}

function downloadProfile() {
    // Create config.json
    const configBlob = new Blob([JSON.stringify(profileData, null, 2)], { type: 'application/json' });
    const configUrl = URL.createObjectURL(configBlob);
    
    // Create download link for config
    const configLink = document.createElement('a');
    configLink.href = configUrl;
    configLink.download = 'config.json';
    configLink.click();
    
    // Create a zip file with all necessary files
    // For now, we'll just download the config and provide instructions
    alert('Config file downloaded! To complete your profile:\n\n1. Save the config.json file in your project folder\n2. Run: node template-generator.js\n3. Your profile will be generated as index.html');
}

function previewProfile() {
    // Generate the HTML and show in a new window
    const html = generateHTML(profileData);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    window.open(url, '_blank');
}

function closeModal() {
    document.getElementById('success-modal').classList.add('hidden');
}

// HTML generation function (simplified version)
function generateHTML(config) {
    const { player, content, videos, contact, styling } = config;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${player.firstName} ${player.lastName} - ${player.sport} Player Profile</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-slate-800 text-white p-4 fixed w-full z-50 shadow-lg">
        <div class="container mx-auto flex justify-between items-center">
            <a href="#" class="text-xl font-bold">${player.initials}</a>
            <div class="hidden md:flex space-x-6">
                <a href="#about" class="hover:text-blue-300 transition-colors">About</a>
                <a href="#highlights" class="hover:text-blue-300 transition-colors">Highlights</a>
                <a href="#contact" class="hover:text-blue-300 transition-colors">Contact</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="min-h-screen pt-24 md:pt-20 pb-8 bg-gradient-to-r from-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div class="absolute inset-0 bg-[url('${player.heroImage}')] bg-cover bg-center opacity-20"></div>
        <div class="container mx-auto px-4 relative z-10">
            <div class="flex flex-col items-center text-center py-12 md:py-20">
                <h1 class="text-5xl md:text-7xl font-bold mb-4 md:mb-6 tracking-tight">
                    <span class="block text-blue-400">${player.firstName}</span>
                    <span class="block">${player.lastName}</span>
                </h1>
                <div class="max-w-2xl mx-auto px-4">
                    <p class="text-lg md:text-2xl mb-6 md:mb-8 leading-relaxed">
                        ${content.tagline}
                    </p>
                    <div class="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
                        <a href="#contact" class="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition text-base md:text-lg font-semibold">Contact Me</a>
                        <a href="#highlights" class="border-2 border-white px-8 py-3 rounded-full hover:bg-white hover:text-slate-800 transition text-base md:text-lg font-semibold">Watch Highlights</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-12 md:py-16 bg-white">
        <div class="container mx-auto px-4 md:px-6">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-slate-800">About Me</h2>
            <div class="grid md:grid-cols-2 gap-8 md:gap-12">
                <div>
                    <p class="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
                        ${content.about.paragraph1}
                    </p>
                    ${content.about.paragraph2 ? `
                    <p class="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
                        ${content.about.paragraph2}
                    </p>
                    ` : ''}
                    ${content.about.paragraph3 ? `
                    <p class="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
                        ${content.about.paragraph3}
                    </p>
                    ` : ''}
                    <div class="bg-blue-50 p-4 md:p-6 rounded-lg border border-blue-100">
                        <h3 class="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-blue-800">Current Team</h3>
                        <p class="text-blue-700 font-medium">${player.currentTeam}</p>
                    </div>
                </div>
                <div>
                    <h3 class="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-slate-800">Positions</h3>
                    <div class="grid grid-cols-2 gap-4 mb-6 md:mb-8">
                        ${player.positions.map(position => `
                        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <i class="fas fa-baseball-ball text-blue-600 mb-2 text-xl"></i>
                            <p class="font-semibold text-blue-800">${position}</p>
                        </div>
                        `).join('')}
                    </div>
                    <div class="bg-blue-50 p-4 md:p-6 rounded-lg border border-blue-100">
                        <h3 class="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-blue-800">Core Values</h3>
                        <ul class="space-y-3 md:space-y-4 text-blue-700">
                            ${content.coreValues.map(value => `
                            <li class="flex items-center">
                                <i class="fas fa-check-circle text-green-500 mr-3 text-xl"></i>
                                <span class="font-medium">${value}</span>
                            </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-12 md:py-16 bg-white">
        <div class="container mx-auto px-4 md:px-6">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-slate-800">Get in Touch</h2>
            <div class="max-w-2xl mx-auto">
                <div class="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-8">
                    <h3 class="text-xl font-semibold mb-4 text-blue-800">Contact Information</h3>
                    <div class="space-y-3">
                        <p class="flex items-center">
                            <i class="fas fa-envelope text-blue-600 mr-3"></i>
                            <a href="mailto:${contact.email}" class="text-blue-700 hover:text-blue-900">${contact.email}</a>
                        </p>
                        ${contact.phone ? `
                        <p class="flex items-center">
                            <i class="fas fa-phone text-blue-600 mr-3"></i>
                            <a href="tel:${contact.phone}" class="text-blue-700 hover:text-blue-900">${contact.phone}</a>
                        </p>
                        ` : ''}
                        ${contact.socialMedia.instagram ? `
                        <p class="flex items-center">
                            <i class="fab fa-instagram text-blue-600 mr-3"></i>
                            <a href="https://instagram.com/${contact.socialMedia.instagram.replace('@', '')}" class="text-blue-700 hover:text-blue-900">${contact.socialMedia.instagram}</a>
                        </p>
                        ` : ''}
                        ${contact.socialMedia.twitter ? `
                        <p class="flex items-center">
                            <i class="fab fa-twitter text-blue-600 mr-3"></i>
                            <a href="https://twitter.com/${contact.socialMedia.twitter.replace('@', '')}" class="text-blue-700 hover:text-blue-900">${contact.socialMedia.twitter}</a>
                        </p>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    </section>
</body>
</html>`;
} 