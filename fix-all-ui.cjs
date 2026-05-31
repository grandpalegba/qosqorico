const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? 
            walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('src/components/ui', function(filePath) {
    if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find all double quoted strings
        let newContent = content.replace(/"([^"\\]|\\.)*"/gs, match => {
            if (match.includes('http')) {
                return match.replace(/\n/g, '');
            } else {
                return match.replace(/\n/g, ' ');
            }
        });
        
        if (content !== newContent) {
            console.log("Fixed", filePath);
            fs.writeFileSync(filePath, newContent);
        }
    }
});
