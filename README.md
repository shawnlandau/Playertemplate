# Player Profile Template System

A beautiful, customizable template system for creating professional player profiles for young athletes. Perfect for parents, coaches, and teams to showcase their players' talents and achievements.

## 🚀 Quick Start

1. **Download the template files**
2. **Customize the configuration** (see below)
3. **Run the generator** to create your profile
4. **Add your media files** (photos and videos)
5. **Deploy to the web**

## 📁 File Structure

```
player-profile-template/
├── config.json              # Main configuration file
├── template-generator.js    # Template generator script
├── index.html              # Generated profile (your current profile)
├── images/                 # Player photos
│   └── player.jpg
├── videos/                 # Highlight videos
│   ├── IMG_0704.mov
│   └── IMG_3539.MOV
└── README.md              # This file
```

## ⚙️ Configuration Guide

### Basic Player Information

Edit the `config.json` file to customize your player's profile:

```json
{
  "player": {
    "firstName": "Jared",
    "lastName": "Landau", 
    "initials": "JL",
    "age": 12,
    "sport": "Baseball",
    "currentTeam": "The Daily Nine 12U",
    "positions": ["Shortstop", "Center Field", "Second Base"],
    "startedPlaying": 5,
    "heroImage": "images/player.jpg"
  }
}
```

### Content Customization

```json
{
  "content": {
    "tagline": "A rising star with unmatched passion...",
    "about": {
      "paragraph1": "I'm a passionate baseball player...",
      "paragraph2": "What sets me apart is my exceptional baseball IQ...",
      "paragraph3": "I bring grit and determination to every practice..."
    },
    "coreValues": [
      "Respect for the game and its traditions",
      "Commitment to continuous improvement",
      "Strong work ethic and dedication", 
      "Team-first mentality"
    ]
  }
}
```

### Video Highlights

```json
{
  "videos": [
    {
      "filename": "videos/IMG_3539.MOV",
      "title": "Game Highlights 1",
      "description": "Fielding and batting highlights"
    },
    {
      "filename": "videos/IMG_0704.mov",
      "title": "Game Highlights 2", 
      "description": "Pitching and base running"
    }
  ]
}
```

### Contact Information

```json
{
  "contact": {
    "email": "jared.landau@example.com",
    "phone": "(555) 123-4567",
    "socialMedia": {
      "instagram": "@jaredlandau_baseball",
      "twitter": "@jaredlandau_bb"
    }
  }
}
```

## 🛠️ How to Use

### Step 1: Install Node.js
Make sure you have Node.js installed on your computer. Download it from [nodejs.org](https://nodejs.org/)

### Step 2: Customize Configuration
Edit the `config.json` file with your player's information (see examples above).

### Step 3: Add Media Files
- **Player Photo**: Replace `images/player.jpg` with your player's photo
- **Videos**: Add highlight videos to the `videos/` folder and update the config

### Step 4: Generate Profile
Run the template generator:

```bash
node template-generator.js
```

This will create a new `index.html` file with your customized profile.

### Step 5: Preview and Deploy
- Open `index.html` in your web browser to preview
- Upload the files to any web hosting service (GitHub Pages, Netlify, etc.)

## 🎨 Customization Options

### Different Sports
The template works for any sport! Just update the sport name and positions:

**Soccer Example:**
```json
{
  "player": {
    "sport": "Soccer",
    "positions": ["Forward", "Midfielder", "Defender"]
  }
}
```

**Basketball Example:**
```json
{
  "player": {
    "sport": "Basketball", 
    "positions": ["Point Guard", "Shooting Guard", "Small Forward"]
  }
}
```

### Color Schemes
You can customize colors by editing the CSS classes in the generated HTML or modifying the template generator.

### Adding More Sections
The template is modular - you can easily add new sections like:
- Statistics
- Awards & Achievements  
- Coach Recommendations
- Academic Information

## 📱 Mobile Responsive

The template is fully responsive and looks great on:
- Desktop computers
- Tablets
- Mobile phones

## 🌐 Deployment Options

### Free Hosting Services
1. **GitHub Pages**: Upload to a GitHub repository
2. **Netlify**: Drag and drop your files
3. **Vercel**: Connect your GitHub repository
4. **Firebase Hosting**: Google's hosting service

### Custom Domain
You can use your own domain name with any hosting service.

## 🔧 Advanced Customization

### Multiple Profiles
Create multiple config files for different players:

```bash
# Generate profile for Player 1
node template-generator.js player1-config.json player1.html

# Generate profile for Player 2  
node template-generator.js player2-config.json player2.html
```

### Custom Styling
Edit the `styling` section in config.json:

```json
{
  "styling": {
    "primaryColor": "blue",
    "secondaryColor": "slate", 
    "accentColor": "blue-400"
  }
}
```

## 📞 Support

If you need help customizing your player profile:

1. Check this README for common questions
2. Review the example configuration
3. Test with a simple config first
4. Make sure all file paths are correct

## 🎯 Tips for Great Profiles

1. **High-Quality Photos**: Use clear, well-lit photos of your player
2. **Best Highlights**: Choose videos that show skill and sportsmanship
3. **Personal Touch**: Write authentic, personal content about your player
4. **Regular Updates**: Keep the profile current with new achievements
5. **Professional Contact**: Use a professional email for inquiries

## 📄 License

This template is free to use for personal and educational purposes. Please credit the original template if you share or modify it.

---

**Happy profiling! 🏆** 