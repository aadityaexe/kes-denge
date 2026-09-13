import * as fs from 'fs';
import * as path from 'path';

function walkDir(dir: string, callback: (path: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const dirPath = 'd:\\self project\\kes-denge\\app\\(site)';

walkDir(dirPath, (filePath) => {
  if (!filePath.endsWith('page.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // Replace "| MARK Technologies" or "— MARK Technologies" at the end of string in `title`
  const regex = /title:\s*(`|")(.*?)(?:\s*[\|—]\s*MARK Technologies)?(`|")/g;
  
  const newContent = content.replace(regex, (match, p1, p2, p3) => {
    // We only want to modify if the original matched the MARK Technologies part
    // But regex already makes it optional. We need to actively remove it.
    let titleStr = p2.trim();
    if (titleStr.endsWith('| MARK Technologies')) {
      titleStr = titleStr.replace(/\s*\|\s*MARK Technologies$/, '');
    } else if (titleStr.endsWith('— MARK Technologies')) {
      titleStr = titleStr.replace(/\s*—\s*MARK Technologies$/, '');
    }
    
    // special case for dynamic strings like `${title} | MARK Technologies`
    if (titleStr.endsWith('| MARK Technologies`')) {
      // not covered by simple regex if p2 was parsed weirdly
    }
    
    return `title: ${p1}${titleStr}${p3}`;
  });
  
  // also handle dynamic metadata cases manually
  const regexDynamic = /(const title = .*?)(?:\s*[\|—]\s*MARK Technologies)(`|";|";\s*$)/gm;
  const newContent2 = newContent.replace(regexDynamic, '$1$2');
  
  if (newContent2 !== content) {
    fs.writeFileSync(filePath, newContent2, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
});
