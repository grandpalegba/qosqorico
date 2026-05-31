const { execSync } = require('child_process');
const fs = require('fs');

function run() {
    let loop = true;
    let count = 0;
    while (loop && count < 50) {
        count++;
        try {
            console.log("Running build...");
            execSync('npm run build', { stdio: 'pipe' });
            console.log("Build passed!");
            loop = false;
        } catch (error) {
            const output = error.stdout?.toString() || '' + error.stderr?.toString() || '';
            
            // Look for: /Users/romeononvide/Downloads/Qosqorico/src/pages/VideoPlayer.jsx:130:77: ERROR: Unterminated string literal
            // or: /Users/romeononvide/Downloads/Qosqorico/src/pages/Home.jsx:164:0: ERROR: Unexpected end of file
            // or: Expected ";" but found "only"
            
            const matchString = output.match(/(.*?):(\d+):\d+: ERROR: Unterminated string literal/);
            const matchEOF = output.match(/(.*?):(\d+):\d+: ERROR: Unexpected end of file/);
            const matchExpected = output.match(/(.*?):(\d+):\d+: ERROR: Expected/);
            const matchUnexpected = output.match(/(.*?):(\d+):\d+: ERROR: Unexpected/);

            let handled = false;

            if (matchString) {
                const file = matchString[1];
                const lineIndex = parseInt(matchString[2], 10) - 1;
                console.log(`Fixing unterminated string in ${file} at line ${lineIndex + 1}`);
                
                let lines = fs.readFileSync(file, 'utf8').split('\n');
                lines[lineIndex] = lines[lineIndex] + lines[lineIndex + 1];
                lines.splice(lineIndex + 1, 1);
                
                fs.writeFileSync(file, lines.join('\n'));
                handled = true;
            } else if (matchEOF) {
                const file = matchEOF[1];
                console.log(`Fixing EOF in ${file}`);
                let content = fs.readFileSync(file, 'utf8');
                fs.writeFileSync(file, content + '\n}\n');
                handled = true;
            } else if (matchExpected || matchUnexpected) {
                const file = (matchExpected || matchUnexpected)[1];
                const lineIndex = parseInt((matchExpected || matchUnexpected)[2], 10) - 1;
                console.log(`Fixing Expected/Unexpected in ${file} at line ${lineIndex + 1}`);
                
                let lines = fs.readFileSync(file, 'utf8').split('\n');
                // Likely a broken comment or JSX. Join with next line.
                lines[lineIndex] = lines[lineIndex] + " " + lines[lineIndex + 1];
                lines.splice(lineIndex + 1, 1);
                
                fs.writeFileSync(file, lines.join('\n'));
                handled = true;
            }

            if (!handled) {
                console.log("Could not parse error automatically:", output);
                break;
            }
        }
    }
}

run();
