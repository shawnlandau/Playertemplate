#!/usr/bin/env node

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function createNewProfile() {
    console.log('🏆 Player Profile Setup Wizard');
    console.log('==============================\n');
    
    console.log('Let\'s create a new player profile! Please answer the following questions:\n');
    
    // Basic player information
    const firstName = await question('Player\'s first name: ');
    const lastName = await question('Player\'s last name: ');
    const age = await question('Player\'s age: ');
    const sport = await question('Sport (e.g., Baseball, Soccer, Basketball): ');
    const currentTeam = await question('Current team name: ');
    const startedPlaying = await question('Age when they started playing: ');
    
    // Positions
    console.log('\nEnter player positions (press Enter after each, type "done" when finished):');
    const positions = [];
    while (true) {
        const position = await question(`Position ${positions.length + 1}: `);
        if (position.toLowerCase() === 'done') break;
        positions.push(position);
    }
    
    // Content
    console.log('\nNow let\'s write some content about the player:');
    const tagline = await question('Tagline (brief description of the player): ');
    const paragraph1 = await question('About paragraph 1: ');
    const paragraph2 = await question('About paragraph 2: ');
    const paragraph3 = await question('About paragraph 3: ');
    
    // Core values
    console.log('\nEnter core values (press Enter after each, type "done" when finished):');
    const coreValues = [];
    while (true) {
        const value = await question(`Core value ${coreValues.length + 1}: `);
        if (value.toLowerCase() === 'done') break;
        coreValues.push(value);
    }
    
    // Contact information
    console.log('\nContact information:');
    const email = await question('Email address: ');
    const phone = await question('Phone number: ');
    const instagram = await question('Instagram handle (optional, press Enter to skip): ');
    const twitter = await question('Twitter handle (optional, press Enter to skip): ');
    
    // Create config object
    const config = {
        player: {
            firstName,
            lastName,
            initials: `${firstName[0]}${lastName[0]}`,
            age: parseInt(age),
            sport,
            currentTeam,
            positions,
            startedPlaying: parseInt(startedPlaying),
            heroImage: "images/player.jpg"
        },
        content: {
            tagline,
            about: {
                paragraph1,
                paragraph2,
                paragraph3
            },
            coreValues
        },
        videos: [
            {
                filename: "videos/highlight1.mp4",
                title: "Game Highlights 1",
                description: "Add your first highlight video here"
            },
            {
                filename: "videos/highlight2.mp4",
                title: "Game Highlights 2", 
                description: "Add your second highlight video here"
            }
        ],
        contact: {
            email,
            phone,
            socialMedia: {
                instagram: instagram || null,
                twitter: twitter || null
            }
        },
        styling: {
            primaryColor: "blue",
            secondaryColor: "slate",
            accentColor: "blue-400"
        }
    };
    
    // Generate config file
    const configPath = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-config.json`;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    console.log(`\n✅ Configuration saved to: ${configPath}`);
    console.log('\n📁 Next steps:');
    console.log('1. Add a player photo to images/player.jpg');
    console.log('2. Add highlight videos to the videos/ folder');
    console.log('3. Update the video filenames in the config if needed');
    console.log(`4. Run: node template-generator.js ${configPath}`);
    console.log('5. Open the generated index.html in your browser');
    
    rl.close();
}

// Run the setup
createNewProfile().catch(console.error); 