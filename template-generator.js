#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read configuration
function loadConfig(configPath) {
    try {
        const configData = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(configData);
    } catch (error) {
        console.error('Error loading config file:', error.message);
        process.exit(1);
    }
}

// Generate HTML template
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
            <button class="md:hidden text-xl" onclick="document.querySelector('.mobile-menu').classList.toggle('hidden')">
                <i class="fas fa-bars"></i>
            </button>
        </div>
        <!-- Mobile Menu -->
        <div class="mobile-menu hidden md:hidden bg-${secondaryColor}-800 absolute w-full left-0 p-4">
            <div class="flex flex-col space-y-4">
                <a href="#about" class="hover:text-${primaryColor}-300 transition-colors">About</a>
                <a href="#highlights" class="hover:text-${primaryColor}-300 transition-colors">Highlights</a>
                <a href="#contact" class="hover:text-${primaryColor}-300 transition-colors">Contact</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="min-h-screen pt-24 md:pt-20 pb-8 bg-gradient-to-r from-${secondaryColor}-800 to-${secondaryColor}-900 text-white relative overflow-hidden">
        <div class="absolute inset-0 bg-cover bg-center opacity-20" style="background-image: url('${heroImageUrl}')"></div>
        <div class="container mx-auto px-4 relative z-10">
            <div class="flex flex-col items-center text-center py-12 md:py-20">
                <h1 class="text-5xl md:text-7xl font-bold mb-4 md:mb-6 tracking-tight">
                    <span class="block text-${accentColor}">${player.firstName}</span>
                    <span class="block">${player.lastName}</span>
                </h1>
                <div class="max-w-2xl mx-auto px-4">
                    <p class="text-lg md:text-2xl mb-6 md:mb-8 leading-relaxed">
                        ${content.tagline.replace(/\n/g, '<br class="hidden md:block">')}
                    </p>
                    <div class="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
                        <a href="#contact" class="bg-${primaryColor}-600 text-white px-8 py-3 rounded-full hover:bg-${primaryColor}-700 transition text-base md:text-lg font-semibold">Contact Me</a>
                        <a href="#highlights" class="border-2 border-white px-8 py-3 rounded-full hover:bg-white hover:text-${secondaryColor}-800 transition text-base md:text-lg font-semibold">Watch Highlights</a>
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
                    <p class="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
                        ${content.about.paragraph2}
                    </p>
                    <p class="text-base md:text-lg text-gray-700 mb-4 md:mb-6 leading-relaxed">
                        ${content.about.paragraph3}
                    </p>
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

    <!-- Highlights Section -->
    <section id="highlights" class="py-12 md:py-16 bg-${secondaryColor}-50">
        <div class="container mx-auto px-4 md:px-6">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-${secondaryColor}-800">Game Highlights</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                ${videos.map(video => `
                <div class="bg-white rounded-lg overflow-hidden shadow-xl">
                    <div class="relative aspect-video">
                        <video 
                            class="w-full h-full object-cover"
                            controls
                            preload="metadata"
                            onerror="console.log('Video error:', this.error)">
                            <source src="${video.filename}" type="video/quicktime">
                            <source src="${video.filename}" type="video/mp4">
                        </video>
                    </div>
                    <div class="p-4">
                        <h3 class="font-semibold text-lg mb-2">${video.title}</h3>
                        <p class="text-gray-600">${video.description}</p>
                    </div>
                </div>
                `).join('')}
                
                <!-- Placeholder for additional videos -->
                <div class="bg-white rounded-lg overflow-hidden shadow-xl">
                    <div class="relative aspect-video">
                        <div class="absolute inset-0 flex items-center justify-center bg-${secondaryColor}-100">
                            <p class="text-${secondaryColor}-600 text-center px-4">
                                Add your next highlight video here
                            </p>
                        </div>
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
                        <p class="flex items-center">
                            <i class="fas fa-phone text-${primaryColor}-600 mr-3"></i>
                            <a href="tel:${contact.phone}" class="text-${primaryColor}-700 hover:text-${primaryColor}-900">${contact.phone}</a>
                        </p>
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
                
                <form class="space-y-4 md:space-y-6">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input type="text" id="name" name="name" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500">
                    </div>
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" id="email" name="email" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500">
                    </div>
                    <div>
                        <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                        <textarea id="message" name="message" rows="4" class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-${primaryColor}-500 focus:border-${primaryColor}-500"></textarea>
                    </div>
                    <div>
                        <button type="submit" class="w-full bg-${primaryColor}-600 text-white px-6 py-3 rounded-lg hover:bg-${primaryColor}-700 transition font-semibold text-base md:text-lg">Send Message</button>
                    </div>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-${secondaryColor}-800 text-white py-6 md:py-8">
        <div class="container mx-auto px-4 text-center">
            <p class="text-${secondaryColor}-300">&copy; 2024 ${player.firstName} ${player.lastName}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
}

// Main function
function main() {
    const args = process.argv.slice(2);
    const configPath = args[0] || 'config.json';
    const outputPath = args[1] || 'index.html';
    
    console.log('🚀 Generating player profile...');
    console.log(`📁 Config file: ${configPath}`);
    console.log(`📄 Output file: ${outputPath}`);
    
    // Load configuration
    const config = loadConfig(configPath);
    
    // Generate HTML
    const html = generateHTML(config);
    
    // Write output file
    try {
        fs.writeFileSync(outputPath, html, 'utf8');
        console.log('✅ Profile generated successfully!');
        console.log(`📂 Open ${outputPath} in your browser to view the profile.`);
    } catch (error) {
        console.error('❌ Error writing output file:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { generateHTML, loadConfig }; 