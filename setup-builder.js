#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

console.log('🎯 Player Profile Builder Setup');
console.log('================================\n');

// Check if required files exist
const requiredFiles = ['profile-builder.html', 'profile-builder.js'];
const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
    console.error('❌ Missing required files:', missingFiles.join(', '));
    console.error('Please make sure all files are in the current directory.');
    process.exit(1);
}

console.log('✅ All required files found!');
console.log('🚀 Starting local server...\n');

// Create a simple HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;
    
    // Default to profile-builder.html
    if (pathname === '/') {
        pathname = '/profile-builder.html';
    }
    
    // Remove leading slash
    const filePath = pathname.substring(1);
    
    // Security: prevent directory traversal
    if (filePath.includes('..')) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    // Determine content type
    let contentType = 'text/html';
    if (filePath.endsWith('.js')) {
        contentType = 'application/javascript';
    } else if (filePath.endsWith('.css')) {
        contentType = 'text/css';
    } else if (filePath.endsWith('.json')) {
        contentType = 'application/json';
    } else if (filePath.endsWith('.png')) {
        contentType = 'image/png';
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
        contentType = 'image/jpeg';
    }
    
    // Read and serve the file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
            return;
        }
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`🌐 Server running at:`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`\n📱 Open this URL in your web browser to start building your player profile!`);
    console.log(`\n💡 Tips:`);
    console.log(`   • Make sure you have photos and videos ready`);
    console.log(`   • You can save your progress and come back later`);
    console.log(`   • The builder will guide you through each step`);
    console.log(`\n🛑 Press Ctrl+C to stop the server`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
}); 