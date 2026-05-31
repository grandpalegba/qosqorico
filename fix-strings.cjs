const fs = require('fs');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find all double quoted strings
    content = content.replace(/"([^"\\]|\\.)*"/gs, match => {
        // If it looks like a URL, remove newline entirely
        if (match.includes('http')) {
            return match.replace(/\n/g, '');
        } else {
            // Otherwise replace newline with space
            return match.replace(/\n/g, ' ');
        }
    });

    fs.writeFileSync(filePath, content);
}

fixFile('src/lib/data.js');
fixFile('src/lib/providers.js');
fixFile('src/lib/menuData.js');
