const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!['node_modules', '.git', '.next'].includes(file)) {
        processDir(fullPath);
      }
    } else if (/\.(jsx?|css)$/.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Backgrounds
      content = content.replace(/#061e14/g, '#0a0a0a');
      content = content.replace(/#09261a/g, '#111111');
      
      // Neutralize text and backgrounds that were tinted green
      content = content.replace(/text-emerald-50/g, 'text-slate-50');
      content = content.replace(/text-emerald-100/g, 'text-slate-100');
      content = content.replace(/text-emerald-200/g, 'text-slate-200');
      content = content.replace(/text-emerald-300/g, 'text-slate-300');
      content = content.replace(/text-emerald-400\/60/g, 'text-slate-400/60');
      content = content.replace(/text-emerald-300\/70/g, 'text-slate-400');
      
      content = content.replace(/bg-emerald-950/g, 'bg-slate-900');
      content = content.replace(/bg-emerald-900/g, 'bg-slate-800');
      content = content.replace(/bg-emerald-800/g, 'bg-slate-800');
      content = content.replace(/border-emerald-900/g, 'border-slate-800');
      content = content.replace(/border-emerald-800/g, 'border-slate-800');
      
      // The rest of the emeralds become orange for accents
      content = content.replace(/emerald/g, 'orange');

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('/Users/shaikalthaf/Desktop/Cartly/app');
processDir('/Users/shaikalthaf/Desktop/Cartly/components');
processDir('/Users/shaikalthaf/Desktop/Cartly/lib');
console.log('Done replacement');
