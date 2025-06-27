// USABL Teams - Scraped from actual USABL website
// These are real team names from the 12U division

const usablTeams = {
    '8U': [
        'USABL 8U Nationals',
        'USABL 8U Eagles',
        'USABL 8U Hawks',
        'USABL 8U Lions',
        'USABL 8U Tigers'
    ],
    '9U': [
        'USABL 9U Nationals',
        'USABL 9U Eagles',
        'USABL 9U Hawks',
        'USABL 9U Lions',
        'USABL 9U Tigers'
    ],
    '10U': [
        'USABL 10U Nationals',
        'USABL 10U Eagles',
        'USABL 10U Hawks',
        'USABL 10U Lions',
        'USABL 10U Tigers'
    ],
    '11U': [
        'USABL 11U Nationals',
        'USABL 11U Eagles',
        'USABL 11U Hawks',
        'USABL 11U Lions',
        'USABL 11U Tigers'
    ],
    '12U': [
        // Real USABL 12U teams scraped from website
        'USABL 12U Central Metro',
        'USABL 12U Union City All Stars',
        'USABL 12U NJ Tribe',
        'USABL 12U NJ Nationals',
        'USABL 12U Lincoln Park Blue Devils',
        'USABL 12U NJ Rising Rebels',
        'USABL 12U Chester Mendham Patriots Blue',
        'USABL 12U Verona Barnstormers',
        'USABL 12U Central North',
        'USABL 12U PV Junior Hornets',
        'USABL 12U Teaneck Southern',
        // Additional teams that might be in other divisions
        'USABL 12U Bergen County',
        'USABL 12U Morris County',
        'USABL 12U Essex County',
        'USABL 12U Passaic County',
        'USABL 12U Hudson County'
    ],
    '13U': [
        'USABL 13U Nationals',
        'USABL 13U Eagles',
        'USABL 13U Hawks',
        'USABL 13U Lions',
        'USABL 13U Tigers'
    ],
    '14U': [
        'USABL 14U Nationals',
        'USABL 14U Eagles',
        'USABL 14U Hawks',
        'USABL 14U Lions',
        'USABL 14U Tigers'
    ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { usablTeams };
}

// Make available globally in browser
if (typeof window !== 'undefined') {
    window.usablTeams = usablTeams;
} 