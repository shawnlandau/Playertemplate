// Team Manager JavaScript
let teams = [];
let currentTeam = null;

// Initialize the team manager
document.addEventListener('DOMContentLoaded', function() {
    loadTeams();
    setupEventListeners();
});

function setupEventListeners() {
    // Team creation form
    const teamForm = document.getElementById('team-form');
    if (teamForm) {
        teamForm.addEventListener('submit', handleTeamCreation);
    }
}

function handleTeamCreation(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const teamData = {
        id: generateTeamId(),
        name: formData.get('teamName'),
        sport: formData.get('teamSport'),
        ageGroup: formData.get('teamAge'),
        level: formData.get('teamLevel'),
        description: formData.get('teamDescription'),
        coachName: formData.get('coachName'),
        coachEmail: formData.get('coachEmail'),
        createdAt: new Date().toISOString(),
        players: [],
        inviteCode: generateInviteCode()
    };
    
    // Add team to storage
    teams.push(teamData);
    saveTeams();
    
    // Reset form
    event.target.reset();
    
    // Refresh teams list
    loadTeams();
    
    // Show success message
    showSuccessMessage(`Team "${teamData.name}" created successfully!`);
}

function generateTeamId() {
    return 'team_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateInviteCode() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}

function loadTeams() {
    const teamsList = document.getElementById('teams-list');
    if (!teamsList) return;
    
    // Load teams from localStorage
    const savedTeams = localStorage.getItem('teams');
    if (savedTeams) {
        teams = JSON.parse(savedTeams);
    }
    
    if (teams.length === 0) {
        teamsList.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                <i class="fas fa-users text-4xl mb-4"></i>
                <p>No teams created yet. Create your first team above!</p>
            </div>
        `;
        return;
    }
    
    teamsList.innerHTML = teams.map(team => `
        <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">${team.name}</h3>
                    <div class="flex items-center space-x-4 text-sm text-gray-600">
                        <span><i class="fas fa-running mr-1"></i>${team.sport}</span>
                        <span><i class="fas fa-users mr-1"></i>${team.ageGroup}</span>
                        <span><i class="fas fa-star mr-1"></i>${team.level}</span>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="invitePlayers('${team.id}')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        <i class="fas fa-user-plus mr-1"></i>Invite Players
                    </button>
                    <button onclick="viewTeam('${team.id}')" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                        <i class="fas fa-eye mr-1"></i>View Team
                    </button>
                    <button onclick="deleteTeam('${team.id}')" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
                        <i class="fas fa-trash mr-1"></i>Delete
                    </button>
                </div>
            </div>
            
            ${team.description ? `<p class="text-gray-700 mb-4">${team.description}</p>` : ''}
            
            <div class="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                    <span class="font-medium text-gray-700">Coach:</span>
                    <span class="text-gray-600">${team.coachName || 'Not specified'}</span>
                </div>
                <div>
                    <span class="font-medium text-gray-700">Players:</span>
                    <span class="text-gray-600">${team.players.length} joined</span>
                </div>
                <div>
                    <span class="font-medium text-gray-700">Created:</span>
                    <span class="text-gray-600">${formatDate(team.createdAt)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function invitePlayers(teamId) {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    
    currentTeam = team;
    
    // Generate invite link
    const inviteLink = `${window.location.origin}/profile-builder.html?team=${team.inviteCode}`;
    
    // Populate modal
    document.getElementById('modal-team-name').textContent = team.name;
    document.getElementById('invite-link').value = inviteLink;
    
    // Populate team info
    document.getElementById('team-info').innerHTML = `
        <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
                <span class="font-medium text-gray-700">Sport:</span>
                <span class="text-gray-600">${team.sport}</span>
            </div>
            <div>
                <span class="font-medium text-gray-700">Age Group:</span>
                <span class="text-gray-600">${team.ageGroup}</span>
            </div>
            <div>
                <span class="font-medium text-gray-700">Level:</span>
                <span class="text-gray-600">${team.level}</span>
            </div>
            <div>
                <span class="font-medium text-gray-700">Coach:</span>
                <span class="text-gray-600">${team.coachName || 'Not specified'}</span>
            </div>
        </div>
        ${team.description ? `<p class="text-gray-600 mt-2">${team.description}</p>` : ''}
    `;
    
    // Show modal
    document.getElementById('invite-modal').classList.remove('hidden');
}

function closeInviteModal() {
    document.getElementById('invite-modal').classList.add('hidden');
    currentTeam = null;
}

function copyInviteLink() {
    const inviteLink = document.getElementById('invite-link');
    inviteLink.select();
    inviteLink.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        showSuccessMessage('Invite link copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy: ', err);
        showErrorMessage('Failed to copy invite link');
    }
}

function shareInviteLink() {
    const inviteLink = document.getElementById('invite-link').value;
    
    if (navigator.share) {
        navigator.share({
            title: `Join ${currentTeam.name}`,
            text: `You've been invited to join ${currentTeam.name}! Click the link to create your player profile.`,
            url: inviteLink
        });
    } else {
        // Fallback to copying
        copyInviteLink();
    }
}

function viewTeam(teamId) {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    
    // For now, just show team details in an alert
    // In a full implementation, this would open a detailed team view
    alert(`Team: ${team.name}\nSport: ${team.sport}\nAge Group: ${team.ageGroup}\nLevel: ${team.level}\nPlayers: ${team.players.length}\nCoach: ${team.coachName || 'Not specified'}`);
}

function deleteTeam(teamId) {
    if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) {
        return;
    }
    
    teams = teams.filter(t => t.id !== teamId);
    saveTeams();
    loadTeams();
    showSuccessMessage('Team deleted successfully!');
}

function saveTeams() {
    localStorage.setItem('teams', JSON.stringify(teams));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function showSuccessMessage(message) {
    // Create a temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle mr-2"></i>${message}
    `;
    document.body.appendChild(successDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        document.body.removeChild(successDiv);
    }, 3000);
}

function showErrorMessage(message) {
    // Create a temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle mr-2"></i>${message}
    `;
    document.body.appendChild(errorDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        document.body.removeChild(errorDiv);
    }, 3000);
}

// Function to check for team invite when profile builder loads
function checkForTeamInvite() {
    const urlParams = new URLSearchParams(window.location.search);
    const teamCode = urlParams.get('team');
    
    if (teamCode) {
        // Find team by invite code
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
    
    // Insert at the top of the form
    const form = document.querySelector('.step-content');
    if (form) {
        form.insertBefore(messageDiv, form.firstChild);
    }
}

// Export functions for use in other files
window.teamManager = {
    checkForTeamInvite,
    showTeamInviteMessage
}; 