#!/usr/bin/env python3
"""
USABL Team Scraper
This script scrapes actual team names from the USABL website
"""

import requests
import re
import json
from urllib.parse import urljoin

def scrape_usabl_teams():
    """Scrape team names from USABL standings page"""
    
    # USABL standings URL
    url = "https://www.usabl.com/standings/show/9111896?subseason=948382"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
    
    try:
        print(f"Fetching teams from: {url}")
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        html = response.text
        print(f"Received {len(html)} characters of HTML")
        
        # Extract team names using multiple patterns
        teams = extract_teams_from_html(html)
        
        # Organize teams by age group
        organized_teams = organize_teams_by_age(teams)
        
        return organized_teams
        
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

def extract_teams_from_html(html):
    """Extract team names from HTML using regex patterns"""
    teams = []
    
    # Pattern 1: Look for team names in href attributes with title
    href_pattern = r'href="[^"]*page/show/[^"]*" class=\'[^\']*\'[^>]*title=\'([^\']*)\''
    matches = re.findall(href_pattern, html)
    for match in matches:
        team_name = match.strip()
        if team_name and len(team_name) > 2 and 'Summer 2025' not in team_name:
            teams.append(team_name)
    
    # Pattern 2: Look for team names in h4 elements with teamName class
    h4_pattern = r'<h4[^>]*class="teamName"[^>]*>.*?<a[^>]*>([^<]+)</a>'
    matches = re.findall(h4_pattern, html)
    for match in matches:
        team_name = match.strip()
        if team_name and len(team_name) > 2 and 'Summer 2025' not in team_name:
            teams.append(team_name)
    
    # Pattern 3: Look for team names in table cells with name class
    table_pattern = r'<td[^>]*class="[^"]*name[^"]*"[^>]*>([^<]+)</td>'
    matches = re.findall(table_pattern, html)
    for match in matches:
        team_name = match.strip()
        if team_name and len(team_name) > 2 and 'Team' not in team_name and 'Summer 2025' not in team_name:
            teams.append(team_name)
    
    # Pattern 4: Look for team names in standings table rows
    standings_pattern = r'<tr[^>]*data-team-id="[^"]*"[^>]*>.*?<td[^>]*>([^<]+)</td>'
    matches = re.findall(standings_pattern, html)
    for match in matches:
        team_name = match.strip()
        if team_name and len(team_name) > 2 and 'Team' not in team_name:
            teams.append(team_name)
    
    # Remove duplicates and filter out non-team names
    unique_teams = list(set(teams))
    filtered_teams = []
    
    for team in unique_teams:
        lower_team = team.lower()
        if (not lower_team.startswith('summer 2025') and 
            not lower_team.startswith('regular season') and
            not lower_team.startswith('standings') and
            len(team) > 2):
            filtered_teams.append(team)
    
    return filtered_teams

def organize_teams_by_age(teams):
    """Organize teams by age group"""
    organized_teams = {
        '8U': [],
        '9U': [],
        '10U': [],
        '11U': [],
        '12U': [],
        '13U': [],
        '14U': []
    }
    
    for team_name in teams:
        # Try to determine age group from team name
        age_match = re.search(r'(\d+U)', team_name, re.IGNORECASE)
        if age_match:
            age_group = age_match.group(1).upper()
            if age_group in organized_teams:
                clean_team_name = re.sub(r'\d+U', '', team_name, flags=re.IGNORECASE).strip()
                organized_teams[age_group].append(f"USABL {age_group} {clean_team_name}")
        else:
            # If no age group found, add to 12U as default
            organized_teams['12U'].append(f"USABL 12U {team_name}")
    
    return organized_teams

def save_teams_to_file(teams, filename='usabl_teams.json'):
    """Save teams to a JSON file"""
    try:
        with open(filename, 'w') as f:
            json.dump(teams, f, indent=2)
        print(f"Teams saved to {filename}")
    except Exception as e:
        print(f"Error saving teams: {e}")

def main():
    """Main function"""
    print("USABL Team Scraper")
    print("=" * 50)
    
    teams = scrape_usabl_teams()
    
    if teams:
        print("\nFound teams:")
        for age_group, team_list in teams.items():
            if team_list:
                print(f"\n{age_group}:")
                for team in team_list:
                    print(f"  - {team}")
        
        # Save to file
        save_teams_to_file(teams)
        
        # Also save as JavaScript object
        js_content = f"""// Auto-generated USABL teams
const usablTeams = {json.dumps(teams, indent=2)};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = {{ usablTeams }};
}}

// Make available globally in browser
if (typeof window !== 'undefined') {{
    window.usablTeams = usablTeams;
}}
"""
        
        with open('usabl_teams.js', 'w') as f:
            f.write(js_content)
        print("Teams also saved as usabl_teams.js")
        
    else:
        print("No teams found or error occurred")

if __name__ == "__main__":
    main() 