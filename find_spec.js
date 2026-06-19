const fs = require('fs');
const filePath = 'C:/Users/UTFPR - FB/Downloads/ebook/Guia_Pratico_Auxilio_Estudantil_UTFPR_EDITADO.html';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('.allGrid .printPageWrapper .sheet')) {
        console.log((idx+1) + ': ' + line);
    }
});
