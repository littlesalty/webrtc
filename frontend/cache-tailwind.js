const cmd = require('child_process')
const fs = require('fs')
const twExists = fs.existsSync('src/generated_tailwind.css')

if (!twExists) {
    console.log('⏰ Generating tailwind...');
    cmd.execSync('npx tailwindcss -o src/generated_tailwind.css')
}
console.log('✅ Tailwind generated ');