const fs = require('fs');

const html = fs.readFileSync('/Users/nirvaankatyal/uplink/index.html', 'utf8');

function getLineAndCol(pos) {
  const lines = html.substring(0, pos).split('\n');
  return { line: lines.length, col: lines[lines.length - 1].length + 1 };
}

let pos = 0;
const stack = [];
const selfClosing = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

while (pos < html.length) {
  const nextTag = html.indexOf('<', pos);
  if (nextTag === -1) break;
  
  if (html.substring(nextTag, nextTag + 4) === '<!--') {
    const endComment = html.indexOf('-->', nextTag);
    if (endComment === -1) break;
    pos = endComment + 3;
    continue;
  }
  
  const endTag = html.indexOf('>', nextTag);
  if (endTag === -1) break;
  
  const tagContent = html.substring(nextTag + 1, endTag).trim();
  pos = endTag + 1;
  
  if (tagContent.startsWith('/') || tagContent.endsWith('/')) {
    if (tagContent.startsWith('/')) {
      const tagName = tagContent.substring(1).split(/\s+/)[0].toLowerCase();
      if (stack.length === 0) {
        console.log(`Error: Closing tag </${tagName}> found with empty stack at pos ${nextTag}`);
      } else {
        const last = stack.pop();
        if (last.name !== tagName) {
          const locCur = getLineAndCol(nextTag);
          const locLast = getLineAndCol(last.pos);
          console.log(`Error: Mismatched tag. Expected </${last.name}> (opened at line ${locLast.line}:${locLast.col}), but found </${tagName}> at line ${locCur.line}:${locCur.col}`);
        }
      }
    }
    continue;
  }
  
  const tagName = tagContent.split(/\s+/)[0].toLowerCase();
  if (!tagName || tagName.startsWith('!') || selfClosing.has(tagName)) {
    continue;
  }
  
  stack.push({ name: tagName, pos: nextTag });
}

console.log("Remaining stack size:", stack.length);
if (stack.length > 0) {
  console.log("Unclosed tags stack:");
  stack.forEach(t => {
    const loc = getLineAndCol(t.pos);
    const snippet = html.substring(t.pos, html.indexOf('>', t.pos) + 1);
    console.log(`Tag ${snippet} opened at line ${loc.line}:${loc.col}`);
  });
}
