// SportsEngine API Integration for USABL Teams
// This script fetches actual team names from USABL website

class SportsEngineAPI {
    constructor() {
        this.baseURL = 'https://www.usabl.com';
        this.leagueId = '9111896'; // USABL league ID
        this.subseasonId = '948382'; // Summer 2025 subseason
    }

    // Scrape teams from the standings page
    async scrapeTeamsFromStandings() {
        try {
            const standingsURL = `${this.baseURL}/standings/show/${this.leagueId}?subseason=${this.subseasonId}`;
            console.log('Scraping from:', standingsURL);
            
            const response = await fetch(standingsURL, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();
            
            // Extract team names using regex patterns
            const teams = this.extractTeamsFromHTML(html);
            console.log('Extracted teams:', teams);
            
            return teams;

        } catch (error) {
            console.error('Error scraping standings:', error);
            return [];
        }
    }

    // Extract team names from HTML using multiple patterns
    extractTeamsFromHTML(html) {
        const teams = [];
        
        // Pattern 1: Look for team names in href attributes
        const hrefPattern = /href="[^"]*page\/show\/[^"]*" class='[^']*'[^>]*title='([^']*)'/g;
        let match;
        while ((match = hrefPattern.exec(html)) !== null) {
            const teamName = match[1].trim();
            if (teamName && teamName.length > 2 && !teamName.includes('Summer 2025')) {
                teams.push(teamName);
            }
        }

        // Pattern 2: Look for team names in h4 elements
        const h4Pattern = /<h4[^>]*class="teamName"[^>]*>.*?<a[^>]*>([^<]+)<\/a>/g;
        while ((match = h4Pattern.exec(html)) !== null) {
            const teamName = match[1].trim();
            if (teamName && teamName.length > 2 && !teamName.includes('Summer 2025')) {
                teams.push(teamName);
            }
        }

        // Pattern 3: Look for team names in table cells
        const tablePattern = /<td[^>]*class="[^"]*name[^"]*"[^>]*>([^<]+)<\/td>/g;
        while ((match = tablePattern.exec(html)) !== null) {
            const teamName = match[1].trim();
            if (teamName && teamName.length > 2 && !teamName.includes('Team') && !teamName.includes('Summer 2025')) {
                teams.push(teamName);
            }
        }

        // Remove duplicates and filter out non-team names
        const uniqueTeams = [...new Set(teams)].filter(team => {
            const lowerTeam = team.toLowerCase();
            return !lowerTeam.includes('summer 2025') && 
                   !lowerTeam.includes('regular season') &&
                   !lowerTeam.includes('standings') &&
                   team.length > 2;
        });

        return uniqueTeams;
    }

    // Organize teams by age group
    organizeTeamsByAge(teams) {
        const organizedTeams = {
            '8U': [],
            '9U': [],
            '10U': [],
            '11U': [],
            '12U': [],
            '13U': [],
            '14U': []
        };

        teams.forEach(teamName => {
            // Try to determine age group from team name
            const ageMatch = teamName.match(/(\d+U)/i);
            if (ageMatch) {
                const ageGroup = ageMatch[1].toUpperCase();
                if (organizedTeams[ageGroup]) {
                    const cleanTeamName = teamName.replace(/\d+U/i, '').trim();
                    organizedTeams[ageGroup].push(`USABL ${ageGroup} ${cleanTeamName}`);
                }
            } else {
                // If no age group found, try to guess based on common patterns
                // For now, we'll add to 12U as default since that's what we know exists
                organizedTeams['12U'].push(`USABL 12U ${teamName}`);
            }
        });

        return organizedTeams;
    }

    // Fetch all teams for all age divisions
    async fetchAllTeams() {
        try {
            console.log('Fetching teams from USABL website...');
            
            const teams = await this.scrapeTeamsFromStandings();
            const organizedTeams = this.organizeTeamsByAge(teams);
            
            console.log('Organized teams:', organizedTeams);
            return organizedTeams;
            
        } catch (error) {
            console.error('Error fetching teams:', error);
            return null;
        }
    }
}

// Function to update the USABL teams in the main application
async function updateUSABLTeamsFromSportsEngine() {
    const api = new SportsEngineAPI();
    
    try {
        console.log('Fetching teams from USABL website...');
        
        const teams = await api.fetchAllTeams();
        
        if (teams && Object.values(teams).some(teamList => teamList.length > 0)) {
            // Update the global usablTeams object
            if (typeof window !== 'undefined' && window.usablTeams) {
                // Merge with existing teams, keeping custom teams
                for (const ageGroup in teams) {
                    if (window.usablTeams[ageGroup]) {
                        // Add new teams to the beginning of the list
                        window.usablTeams[ageGroup] = [...teams[ageGroup], ...window.usablTeams[ageGroup]];
                        // Remove duplicates
                        window.usablTeams[ageGroup] = [...new Set(window.usablTeams[ageGroup])];
                    } else {
                        window.usablTeams[ageGroup] = teams[ageGroup];
                    }
                }
                
                // Save to localStorage
                localStorage.setItem('usablTeams', JSON.stringify(window.usablTeams));
                
                // Update the dropdown if it's currently visible
                if (typeof updateTeamOptions === 'function') {
                    updateTeamOptions();
                }
                
                console.log('USABL teams updated successfully:', window.usablTeams);
                return window.usablTeams;
            }
            
            return teams;
        } else {
            console.log('No teams found from website, using fallback teams');
            return null;
        }
        
    } catch (error) {
        console.error('Error updating USABL teams:', error);
        return null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SportsEngineAPI, updateUSABLTeamsFromSportsEngine };
}

// Auto-update teams when script loads (if in browser)
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateUSABLTeamsFromSportsEngine);
    } else {
        updateUSABLTeamsFromSportsEngine();
    }
} 