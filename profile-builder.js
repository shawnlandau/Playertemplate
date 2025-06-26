// Profile Builder JavaScript
let currentStep = 1;
let totalSteps = 5;
let profileData = {};
let uploadedImageData = null; // Store uploaded image data
let uploadedVideos = []; // Store uploaded video data

// USABL Teams by Age Group
const usablTeams = {
    '9U': [
        '9U Red Sox',
        '9U Yankees',
        '9U Dodgers',
        '9U Giants',
        '9U Braves',
        '9U Cardinals',
        '9U Cubs',
        '9U Mets',
        '9U Phillies',
        '9U Nationals',
        '9U Marlins',
        '9U Pirates',
        '9U Rockies',
        '9U Diamondbacks',
        '9U Padres',
        '9U Brewers',
        '9U Reds',
        '9U Astros',
        '9U Rangers',
        '9U Angels',
        '9U Athletics',
        '9U Mariners',
        '9U Royals',
        '9U Twins',
        '9U White Sox',
        '9U Tigers',
        '9U Indians',
        '9U Rays',
        '9U Blue Jays',
        '9U Orioles'
    ],
    '10U': [
        '10U Red Sox',
        '10U Yankees',
        '10U Dodgers',
        '10U Giants',
        '10U Braves',
        '10U Cardinals',
        '10U Cubs',
        '10U Mets',
        '10U Phillies',
        '10U Nationals',
        '10U Marlins',
        '10U Pirates',
        '10U Rockies',
        '10U Diamondbacks',
        '10U Padres',
        '10U Brewers',
        '10U Reds',
        '10U Astros',
        '10U Rangers',
        '10U Angels',
        '10U Athletics',
        '10U Mariners',
        '10U Royals',
        '10U Twins',
        '10U White Sox',
        '10U Tigers',
        '10U Indians',
        '10U Rays',
        '10U Blue Jays',
        '10U Orioles'
    ],
    '11U': [
        '11U Red Sox',
        '11U Yankees',
        '11U Dodgers',
        '11U Giants',
        '11U Braves',
        '11U Cardinals',
        '11U Cubs',
        '11U Mets',
        '11U Phillies',
        '11U Nationals',
        '11U Marlins',
        '11U Pirates',
        '11U Rockies',
        '11U Diamondbacks',
        '11U Padres',
        '11U Brewers',
        '11U Reds',
        '11U Astros',
        '11U Rangers',
        '11U Angels',
        '11U Athletics',
        '11U Mariners',
        '11U Royals',
        '11U Twins',
        '11U White Sox',
        '11U Tigers',
        '11U Indians',
        '11U Rays',
        '11U Blue Jays',
        '11U Orioles'
    ],
    '12U': [
        '12U Red Sox',
        '12U Yankees',
        '12U Dodgers',
        '12U Giants',
        '12U Braves',
        '12U Cardinals',
        '12U Cubs',
        '12U Mets',
        '12U Phillies',
        '12U Nationals',
        '12U Marlins',
        '12U Pirates',
        '12U Rockies',
        '12U Diamondbacks',
        '12U Padres',
        '12U Brewers',
        '12U Reds',
        '12U Astros',
        '12U Rangers',
        '12U Angels',
        '12U Athletics',
        '12U Mariners',
        '12U Royals',
        '12U Twins',
        '12U White Sox',
        '12U Tigers',
        '12U Indians',
        '12U Rays',
        '12U Blue Jays',
        '12U Orioles'
    ]
};

// Supported video formats
const supportedVideoFormats = [
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm',
    'video/ogg',
    'video/mov',
    'video/avi',
    'video/wmv',
    'video/flv',
    'video/m4v'
];

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
    'Lacrosse': [
        'Attack', 
        'Midfielder', 
        'Defense', 
        'Goalie', 
        'Face-off Specialist', 
        'Long-stick Midfielder (LSM)',
        'Short-stick Defensive Midfielder (SSDM)',
        'Wing Midfielder',
        'Defensive Midfielder',
        'Offensive Midfielder',
        'Box Lacrosse - Forward',
        'Box Lacrosse - Transition',
        'Box Lacrosse - Defense',
        'Box Lacrosse - Goalie'
    ],
    'Other': []
};

// Initialize the builder
document.addEventListener('DOMContentLoaded', function() {
    initializeBuilder();
    setupEventListeners();
    checkForTeamInvite();
});

function initializeBuilder() {
    // Set up sport change listener
    const sportSelect = document.getElementById('sport');
    console.log('sportSelect element:', sportSelect);
    if (sportSelect) {
        sportSelect.addEventListener('change', function() {
            console.log('Sport changed to:', this.value);
            updatePositions(this.value);
        });
    } else {
        console.log('sportSelect element not found');
    }

    // Set up birthdate change listener for team options
    const birthdateInput = document.getElementById('birthdate');
    if (birthdateInput) {
        birthdateInput.addEventListener('input', function() {
            updateTeamOptions();
        });
    }

    // Set up color selection listeners
    setupColorListeners();
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

function setupColorListeners() {
    // Add event listeners for color selection dropdowns
    const primaryColorSelect = document.getElementById('primaryColor');
    const secondaryColorSelect = document.getElementById('secondaryColor');
    const accentColorSelect = document.getElementById('accentColor');
    
    if (primaryColorSelect) {
        primaryColorSelect.addEventListener('change', function() {
            console.log('Primary color changed to:', this.value);
            updateColorPreview();
        });
    }
    
    if (secondaryColorSelect) {
        secondaryColorSelect.addEventListener('change', function() {
            console.log('Secondary color changed to:', this.value);
            updateColorPreview();
        });
    }
    
    if (accentColorSelect) {
        accentColorSelect.addEventListener('change', function() {
            console.log('Accent color changed to:', this.value);
            updateColorPreview();
        });
    }
    
    // Background opacity slider
    const backgroundOpacitySlider = document.getElementById('backgroundOpacity');
    const opacityValueDisplay = document.getElementById('opacityValue');
    
    if (backgroundOpacitySlider && opacityValueDisplay) {
        backgroundOpacitySlider.addEventListener('input', function() {
            opacityValueDisplay.textContent = this.value + '%';
        });
    }
}

function updateColorPreview() {
    // This function can be used to show a live preview of color changes
    // For now, we'll just log the changes
    const primaryColor = document.getElementById('primaryColor')?.value || 'blue';
    const secondaryColor = document.getElementById('secondaryColor')?.value || 'slate';
    const accentColor = document.getElementById('accentColor')?.value || 'blue-400';
    
    console.log('Current color scheme:', { primaryColor, secondaryColor, accentColor });
}

function updatePositions(sport) {
    console.log('updatePositions called with sport:', sport);
    const positionsContainer = document.getElementById('positions-container');
    if (!positionsContainer) {
        console.log('positions-container not found');
        return;
    }

    positionsContainer.innerHTML = '';
    
    const positions = sportPositions[sport] || [];
    console.log('positions for', sport, ':', positions);
    
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

function calculateUSABLDivision(birthdate) {
    if (!birthdate) return null;
    const now = new Date();
    const cutoff = new Date(now.getFullYear(), 3, 30); // April 30th of current year
    const birth = new Date(birthdate);
    let age = cutoff.getFullYear() - birth.getFullYear();
    const monthDiff = cutoff.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && cutoff.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

function updateTeamOptions() {
    const birthdateInput = document.getElementById('birthdate');
    const currentTeamInput = document.getElementById('currentTeam');
    const teamDropdown = document.getElementById('team-dropdown');
    if (!birthdateInput || !currentTeamInput || !teamDropdown) return;
    const usablAge = calculateUSABLDivision(birthdateInput.value);
    if (usablAge === null) return;
    let ageGroup = '';
    if (usablAge >= 9 && usablAge <= 12) {
        ageGroup = usablAge + 'U';
    } else {
        teamDropdown.innerHTML = '<option value="">Select a USABL team (if applicable)</option>';
        const teamSelectionContainer = document.getElementById('team-selection-container');
        if (teamSelectionContainer) teamSelectionContainer.classList.add('hidden');
        return;
    }
    const teams = usablTeams[ageGroup] || [];
    teamDropdown.innerHTML = '<option value="">Select a USABL team (if applicable)</option>';
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team;
        option.textContent = team;
        teamDropdown.appendChild(option);
    });
    const teamSelectionContainer = document.getElementById('team-selection-container');
    if (teamSelectionContainer) {
        teamSelectionContainer.classList.remove('hidden');
    }
}

function selectTeamFromDropdown() {
    const teamDropdown = document.getElementById('team-dropdown');
    const currentTeamInput = document.getElementById('currentTeam');
    
    if (teamDropdown && currentTeamInput) {
        currentTeamInput.value = teamDropdown.value;
    }
}

function clearTeamSelection() {
    const currentTeamInput = document.getElementById('currentTeam');
    const teamDropdown = document.getElementById('team-dropdown');
    
    if (currentTeamInput) {
        currentTeamInput.value = '';
    }
    if (teamDropdown) {
        teamDropdown.value = '';
    }
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
            <p class="text-sm text-gray-500">Supported formats: MP4, MOV, AVI, WebM, WMV, FLV, M4V</p>
        </div>
        <div class="video-preview hidden mt-4">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="fas fa-video text-green-600 mr-3"></i>
                        <div>
                            <p class="font-medium text-green-800 video-filename"></p>
                            <p class="text-sm text-green-600 video-size"></p>
                        </div>
                    </div>
                    <button type="button" class="text-red-600 hover:text-red-800" onclick="removeVideo(${videoCount})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
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
            // Store the image data for use in profile generation
            uploadedImageData = e.target.result;
            
            // Show preview
            document.getElementById('preview-img').src = e.target.result;
            document.getElementById('photo-upload-area').classList.add('hidden');
            document.getElementById('photo-preview').classList.remove('hidden');
            
            console.log('Image uploaded and stored for profile generation');
        };
        reader.readAsDataURL(file);
    }
}

function handleVideoUpload(event, videoIndex) {
    const file = event.target.files[0];
    if (file) {
        // Check if file is a supported video format
        if (!supportedVideoFormats.includes(file.type) && !file.name.match(/\.(mp4|mov|avi|webm|wmv|flv|m4v)$/i)) {
            alert('Please select a supported video format: MP4, MOV, AVI, WebM, WMV, FLV, or M4V');
            event.target.value = '';
            return;
        }
        
        // Check file size (limit to 100MB)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            alert('Video file is too large. Please select a file smaller than 100MB.');
            event.target.value = '';
            return;
        }
        
        const uploadArea = event.target.parentElement.querySelector('.video-upload-area');
        const previewArea = event.target.parentElement.querySelector('.video-preview');
        const filenameElement = previewArea.querySelector('.video-filename');
        const sizeElement = previewArea.querySelector('.video-size');
        
        // Store video data
        const videoData = {
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            index: videoIndex
        };
        
        // Update or add to uploadedVideos array
        const existingIndex = uploadedVideos.findIndex(v => v.index === videoIndex);
        if (existingIndex >= 0) {
            uploadedVideos[existingIndex] = videoData;
        } else {
            uploadedVideos.push(videoData);
        }
        
        // Show preview
        filenameElement.textContent = file.name;
        sizeElement.textContent = formatFileSize(file.size);
        
        uploadArea.classList.add('hidden');
        previewArea.classList.remove('hidden');
        
        console.log(`Video ${videoIndex} uploaded:`, file.name, formatFileSize(file.size));
    }
}

function removeVideo(videoIndex) {
    // Remove from uploadedVideos array
    uploadedVideos = uploadedVideos.filter(v => v.index !== videoIndex);
    
    // Reset the upload area
    const videoDiv = document.getElementById(`video-${videoIndex}`).parentElement;
    const uploadArea = videoDiv.querySelector('.video-upload-area');
    const previewArea = videoDiv.querySelector('.video-preview');
    const fileInput = document.getElementById(`video-${videoIndex}`);
    
    fileInput.value = '';
    uploadArea.classList.remove('hidden');
    previewArea.classList.add('hidden');
    
    console.log(`Video ${videoIndex} removed`);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                    <p><strong>Birth Date:</strong> ${formData.birthdate ? new Date(formData.birthdate).toLocaleDateString() : 'Not specified'}</p>
                    <p><strong>USABL Age (as of April 30):</strong> ${formData.age || 'Not specified'}</p>
                    <p><strong>Sport:</strong> ${formData.sport}</p>
                    <p><strong>Team:</strong> ${formData.currentTeam || 'Not specified'}</p>
                    ${formData.age >= 9 && formData.age <= 12 ? `
                    <p><strong>USABL Age Group:</strong> ${formData.age}U</p>
                    ` : ''}
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
                <p><strong>Background Opacity:</strong> ${formData.backgroundOpacity}%</p>
            </div>
        </div>
        
        <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
                <i class="fas fa-photo-video mr-2"></i>Media
            </h3>
            <div class="space-y-3 text-sm">
                <div>
                    <strong>Profile Photo:</strong>
                    <p class="text-gray-700 mt-1">${uploadedImageData ? 'Uploaded ✓' : 'Using default image'}</p>
                </div>
                <div>
                    <strong>Highlight Videos:</strong>
                    ${uploadedVideos.length > 0 ? 
                        uploadedVideos.map((video, index) => `
                            <p class="text-gray-700 mt-1">• ${video.name} (${formatFileSize(video.size)})</p>
                        `).join('') : 
                        '<p class="text-gray-700 mt-1">No videos uploaded</p>'
                    }
                </div>
            </div>
        </div>
    `;
}

function collectFormData() {
    const birthdate = document.getElementById('birthdate').value;
    const calculatedAge = calculateUSABLDivision(birthdate);
    
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        birthdate: birthdate,
        age: calculatedAge,
        sport: document.getElementById('sport').value,
        currentTeam: document.getElementById('currentTeam').value,
        positions: Array.from(document.querySelectorAll('input[name="positions"]:checked')).map(cb => cb.value),
        tagline: document.getElementById('tagline').value,
        about1: document.getElementById('about1').value,
        about2: document.getElementById('about2').value,
        about3: document.getElementById('about3').value,
        values: Array.from(document.querySelectorAll('input[name="values"]:checked')).map(cb => cb.value),
        contactEmail: document.getElementById('contactEmail').value,
        contactPhone: document.getElementById('contactPhone').value,
        instagram: document.getElementById('instagram').value,
        twitter: document.getElementById('twitter').value,
        primaryColor: document.getElementById('primaryColor').value,
        secondaryColor: document.getElementById('secondaryColor').value,
        accentColor: document.getElementById('accentColor').value,
        backgroundOpacity: document.getElementById('backgroundOpacity').value
    };
    
    return formData;
}

function generateProfile() {
    const formData = collectFormData();
    
    // Create player initials
    const initials = (formData.firstName.charAt(0) + formData.lastName.charAt(0)).toUpperCase();
    
    // Use uploaded image or default
    const heroImage = uploadedImageData || 'images/player.jpg';
    
    const config = {
        player: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            birthdate: formData.birthdate,
            age: formData.age,
            sport: formData.sport,
            currentTeam: formData.currentTeam,
            positions: formData.positions,
            initials: initials,
            heroImage: heroImage
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
        videos: uploadedVideos.map((video, index) => ({
            filename: video.name,
            title: `Highlight Video ${index + 1}`,
            description: `${video.name} (${formatFileSize(video.size)})`,
            file: video.file,
            type: video.type
        })),
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
            accentColor: formData.accentColor,
            backgroundOpacity: formData.backgroundOpacity
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
    
    // Color mapping for Tailwind classes
    const colorMap = {
        'blue': { primary: 'blue', secondary: 'slate', accent: 'blue-400' },
        'green': { primary: 'green', secondary: 'slate', accent: 'green-400' },
        'red': { primary: 'red', secondary: 'slate', accent: 'red-400' },
        'purple': { primary: 'purple', secondary: 'slate', accent: 'purple-400' },
        'orange': { primary: 'orange', secondary: 'slate', accent: 'orange-400' },
        'teal': { primary: 'teal', secondary: 'slate', accent: 'teal-400' }
    };
    
    // Get selected colors or default to blue
    const selectedColors = colorMap[styling.primaryColor] || colorMap.blue;
    const primaryColor = selectedColors.primary;
    const secondaryColor = styling.secondaryColor || 'slate';
    const accentColor = styling.accentColor || selectedColors.accent;
    const backgroundOpacity = styling.backgroundOpacity || '40';
    
    // Determine if hero image is a data URL (uploaded) or file path
    const isDataUrl = player.heroImage && player.heroImage.startsWith('data:');
    const heroImageUrl = isDataUrl ? player.heroImage : `images/player.jpg`;
    
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
    <nav class="bg-${secondaryColor}-800 text-white p-4 fixed w-full z-50 shadow-lg">
        <div class="container mx-auto flex justify-between items-center">
            <a href="#" class="text-xl font-bold">${player.initials}</a>
            <div class="hidden md:flex space-x-6">
                <a href="#about" class="hover:text-${primaryColor}-300 transition-colors">About</a>
                <a href="#highlights" class="hover:text-${primaryColor}-300 transition-colors">Highlights</a>
                <a href="#contact" class="hover:text-${primaryColor}-300 transition-colors">Contact</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="min-h-screen pt-24 md:pt-20 pb-8 bg-gradient-to-r from-${secondaryColor}-800 to-${secondaryColor}-900 text-white relative overflow-hidden">
        <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('${heroImageUrl}'); background-position: center 20%; opacity: ${backgroundOpacity}%;"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-${secondaryColor}-800/80 to-${secondaryColor}-900/80"></div>
        <div class="container mx-auto px-4 relative z-10">
            <div class="flex flex-col items-center text-center py-12 md:py-20">
                <h1 class="text-5xl md:text-7xl font-bold mb-4 md:mb-6 tracking-tight drop-shadow-lg">
                    <span class="block text-${accentColor}">${player.firstName}</span>
                    <span class="block">${player.lastName}</span>
                </h1>
                <div class="max-w-2xl mx-auto px-4">
                    <p class="text-lg md:text-2xl mb-6 md:mb-8 leading-relaxed drop-shadow-md">
                        ${content.tagline}
                    </p>
                    <div class="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
                        <a href="#contact" class="bg-${primaryColor}-600 text-white px-8 py-3 rounded-full hover:bg-${primaryColor}-700 transition text-base md:text-lg font-semibold shadow-lg">Contact Me</a>
                        <a href="#highlights" class="border-2 border-white px-8 py-3 rounded-full hover:bg-white hover:text-${secondaryColor}-800 transition text-base md:text-lg font-semibold shadow-lg">Watch Highlights</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-12 md:py-16 bg-white">
        <div class="container mx-auto px-4 md:px-6">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-${secondaryColor}-800">About Me</h2>
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
                    <div class="bg-${primaryColor}-50 p-4 md:p-6 rounded-lg border border-${primaryColor}-100">
                        <h3 class="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-${primaryColor}-800">Current Team</h3>
                        <p class="text-${primaryColor}-700 font-medium">${player.currentTeam}</p>
                    </div>
                </div>
                <div>
                    <h3 class="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-${secondaryColor}-800">Positions</h3>
                    <div class="grid grid-cols-2 gap-4 mb-6 md:mb-8">
                        ${player.positions.map(position => {
                            // Choose appropriate icon based on sport
                            let iconClass = 'fas fa-baseball-ball'; // default
                            if (player.sport === 'Basketball') {
                                iconClass = 'fas fa-basketball-ball';
                            } else if (player.sport === 'Soccer') {
                                iconClass = 'fas fa-futbol';
                            } else if (player.sport === 'Football') {
                                iconClass = 'fas fa-football-ball';
                            } else if (player.sport === 'Tennis') {
                                iconClass = 'fas fa-table-tennis';
                            } else if (player.sport === 'Swimming') {
                                iconClass = 'fas fa-swimming-pool';
                            } else if (player.sport === 'Track & Field') {
                                iconClass = 'fas fa-running';
                            } else if (player.sport === 'Volleyball') {
                                iconClass = 'fas fa-volleyball-ball';
                            } else if (player.sport === 'Hockey') {
                                iconClass = 'fas fa-hockey-puck';
                            } else if (player.sport === 'Lacrosse') {
                                iconClass = 'fas fa-hockey-stick';
                            }
                            
                            return `
                            <div class="bg-${primaryColor}-50 p-4 rounded-lg border border-${primaryColor}-100">
                                <i class="${iconClass} text-${primaryColor}-600 mb-2 text-xl"></i>
                                <p class="font-semibold text-${primaryColor}-800">${position}</p>
                            </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="bg-${primaryColor}-50 p-4 md:p-6 rounded-lg border border-${primaryColor}-100">
                        <h3 class="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-${primaryColor}-800">Core Values</h3>
                        <ul class="space-y-3 md:space-y-4 text-${primaryColor}-700">
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
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-${secondaryColor}-800">Get in Touch</h2>
            <div class="max-w-2xl mx-auto">
                <div class="bg-${primaryColor}-50 p-6 rounded-lg border border-${primaryColor}-100 mb-8">
                    <h3 class="text-xl font-semibold mb-4 text-${primaryColor}-800">Contact Information</h3>
                    <div class="space-y-3">
                        <p class="flex items-center">
                            <i class="fas fa-envelope text-${primaryColor}-600 mr-3"></i>
                            <a href="mailto:${contact.email}" class="text-${primaryColor}-700 hover:text-${primaryColor}-900">${contact.email}</a>
                        </p>
                        ${contact.phone ? `
                        <p class="flex items-center">
                            <i class="fas fa-phone text-${primaryColor}-600 mr-3"></i>
                            <a href="tel:${contact.phone}" class="text-${primaryColor}-700 hover:text-${primaryColor}-900">${contact.phone}</a>
                        </p>
                        ` : ''}
                        ${contact.socialMedia.instagram ? `
                        <p class="flex items-center">
                            <i class="fab fa-instagram text-${primaryColor}-600 mr-3"></i>
                            <a href="https://instagram.com/${contact.socialMedia.instagram.replace('@', '')}" class="text-${primaryColor}-700 hover:text-${primaryColor}-900">${contact.socialMedia.instagram}</a>
                        </p>
                        ` : ''}
                        ${contact.socialMedia.twitter ? `
                        <p class="flex items-center">
                            <i class="fab fa-twitter text-${primaryColor}-600 mr-3"></i>
                            <a href="https://twitter.com/${contact.socialMedia.twitter.replace('@', '')}" class="text-${primaryColor}-700 hover:text-${primaryColor}-900">${contact.socialMedia.twitter}</a>
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

// Function to check for team invite when profile builder loads
function checkForTeamInvite() {
    const urlParams = new URLSearchParams(window.location.search);
    const teamCode = urlParams.get('team');
    
    if (teamCode) {
        // Load teams from localStorage
        const savedTeams = localStorage.getItem('teams');
        if (savedTeams) {
            const teams = JSON.parse(savedTeams);
            const team = teams.find(t => t.inviteCode === teamCode);
            
            if (team) {
                // Pre-fill the current team field in the profile builder
                const currentTeamField = document.getElementById('currentTeam');
                if (currentTeamField) {
                    currentTeamField.value = team.name;
                    currentTeamField.readOnly = true;
                    
                    // Show a message that they're creating a profile for this team
                    showTeamInviteMessage(team);
                }
            }
        }
    }
}

function showTeamInviteMessage(team) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6';
    messageDiv.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-users text-blue-600 mr-3 text-xl"></i>
            <div>
                <h3 class="font-semibold text-blue-800">Creating Profile for ${team.name}</h3>
                <p class="text-blue-700 text-sm">You're creating a player profile for ${team.sport} team ${team.name} (${team.ageGroup}, ${team.level})</p>
            </div>
        </div>
    `;
    
    // Insert at the top of the first step content
    const firstStepContent = document.getElementById('step-1-content');
    if (firstStepContent) {
        const stepContent = firstStepContent.querySelector('.step-content') || firstStepContent;
        stepContent.insertBefore(messageDiv, stepContent.firstChild);
    }
} 