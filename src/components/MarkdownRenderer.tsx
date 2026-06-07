import React from 'react';

const D = {
  h1: '#ffffff',
  h2: '#f4f4f5',
  h3: '#e4e4e7',
  body: '#d4d4d8',
  muted: '#71717a',
  code: '#e2e8f0',
  codeBg: '#111111',
  codeBorder: 'rgba(255,255,255,0.07)',
  blockquoteBorder: '#0070f3',
  blockquoteBg: 'rgba(0,112,243,0.06)',
  inlineCode: '#f97316',
  inlineCodeBg: 'rgba(249,115,22,0.1)',
};

const parseInline = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Inline code: `text`
    const codeMatch = remaining.match(/`([^`]+)`/);

    const boldIdx = boldMatch ? remaining.indexOf(boldMatch[0]) : Infinity;
    const codeIdx = codeMatch ? remaining.indexOf(codeMatch[0]) : Infinity;

    if (boldIdx === Infinity && codeIdx === Infinity) {
      parts.push(remaining);
      break;
    }

    if (boldIdx <= codeIdx && boldMatch) {
      if (boldIdx > 0) parts.push(remaining.slice(0, boldIdx));
      parts.push(<strong key={keyIdx++} style={{ color: '#fff', fontWeight: 700 }}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldIdx + boldMatch[0].length);
    } else if (codeMatch) {
      if (codeIdx > 0) parts.push(remaining.slice(0, codeIdx));
      parts.push(
        <code key={keyIdx++} style={{ background: D.inlineCodeBg, color: D.inlineCode, padding: '2px 6px', borderRadius: 5, fontSize: '0.88em', fontFamily: "'Fira Code', monospace" }}>
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeIdx + codeMatch[0].length);
    } else {
      parts.push(remaining);
      break;
    }
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
};

const HTML_RENDER_STYLES = `
.empl-html-content { font-family: 'Inter', -apple-system, sans-serif; color: #d4d4d8; font-size: 15px; line-height: 1.8; }
.empl-html-content > * + * { margin-top: 0.8em; }
.empl-html-content h1 { font-size: 2em; font-weight: 800; color: #fff; letter-spacing: -0.5px; line-height: 1.2; margin: 1.4em 0 0.5em; }
.empl-html-content h2 { font-size: 1.5em; font-weight: 700; color: #f4f4f5; line-height: 1.3; margin: 1.2em 0 0.4em; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.07); }
.empl-html-content h3 { font-size: 1.2em; font-weight: 700; color: #e4e4e7; line-height: 1.35; margin: 1em 0 0.35em; }
.empl-html-content p { margin: 0 0 1em; }
.empl-html-content strong { color: #fff; font-weight: 700; }
.empl-html-content em { font-style: italic; }
.empl-html-content u { text-decoration: underline; }
.empl-html-content s { text-decoration: line-through; color: #71717a; }
.empl-html-content code:not(pre code) { background: rgba(249,115,22,0.1); color: #f97316; padding: 2px 6px; border-radius: 4px; font-size: 0.87em; font-family: 'Fira Code','Consolas',monospace; }
.empl-html-content pre { background: #111; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 16px 20px; margin: 1.2em 0; overflow-x: auto; }
.empl-html-content pre code { background: none; color: #e2e8f0; padding: 0; font-size: 13px; line-height: 1.65; font-family: 'Fira Code','Consolas',monospace; }
.empl-html-content blockquote { border-left: 3px solid #0070f3; background: rgba(0,112,243,0.06); margin: 1.2em 0; padding: 10px 16px; border-radius: 0 8px 8px 0; }
.empl-html-content ul { list-style: disc; padding-left: 1.5em; margin: 0.6em 0 1em; }
.empl-html-content ol { list-style: decimal; padding-left: 1.5em; margin: 0.6em 0 1em; }
.empl-html-content li { color: #d4d4d8; line-height: 1.75; margin-bottom: 5px; }
.empl-html-content img { max-width: 100%; border-radius: 10px; margin: 1em 0; display: block; border: 1px solid rgba(255,255,255,0.08); }
.empl-html-content a { color: #3D7BFF; text-decoration: underline; }
.empl-html-content hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 2em 0; }
`;

const HTMLRenderer: React.FC<{ html: string }> = ({ html }) => (
  <>
    <style>{HTML_RENDER_STYLES}</style>
    <div className="empl-html-content" dangerouslySetInnerHTML={{ __html: html }} />
  </>
);

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  if (content.trimStart().startsWith('<')) {
    return <HTMLRenderer html={content} />;
  }
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={k++} style={{ margin: '20px 0', borderRadius: 10, border: `1px solid ${D.codeBorder}`, overflow: 'hidden' }}>
          {lang && (
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '7px 14px', borderBottom: `1px solid ${D.codeBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: D.muted, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{lang}</span>
            </div>
          )}
          <pre style={{
            background: D.codeBg, margin: 0, padding: '18px 20px', overflowX: 'auto',
            fontSize: '13px', lineHeight: 1.65, color: D.code,
            fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', 'Consolas', monospace",
          }}>
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <blockquote key={k++} style={{ borderLeft: `3px solid ${D.blockquoteBorder}`, background: D.blockquoteBg, margin: '16px 0', padding: '12px 16px', borderRadius: '0 8px 8px 0' }}>
          {quoteLines.map((l, idx) => (
            <p key={idx} style={{ margin: 0, color: D.body, fontSize: '15px', lineHeight: 1.7 }}>{parseInline(l)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    // Unordered list
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={k++} style={{ margin: '8px 0 16px', paddingLeft: 22 }}>
          {items.map((item, idx) => (
            <li key={idx} style={{ fontSize: '15px', color: D.body, marginBottom: 7, lineHeight: 1.75 }}>{parseInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={k++} style={{ margin: '8px 0 16px', paddingLeft: 22 }}>
          {items.map((item, idx) => (
            <li key={idx} style={{ fontSize: '15px', color: D.body, marginBottom: 7, lineHeight: 1.75 }}>{parseInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      elements.push(<h3 key={k++} style={{ fontSize: '18px', fontWeight: 700, color: D.h3, margin: '28px 0 10px', lineHeight: 1.35 }}>{parseInline(line.slice(4))}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={k++} style={{ fontSize: '22px', fontWeight: 700, color: D.h2, margin: '36px 0 12px', lineHeight: 1.3, paddingBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{parseInline(line.slice(3))}</h2>);
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={k++} style={{ fontSize: '28px', fontWeight: 800, color: D.h1, margin: '0 0 16px', lineHeight: 1.25, letterSpacing: '-0.5px' }}>{parseInline(line.slice(2))}</h1>);
    } else if (line.trim() === '' || line === '---') {
      elements.push(<div key={k++} style={{ height: 12 }} />);
    } else {
      elements.push(
        <p key={k++} style={{ fontSize: '15px', color: D.body, margin: '0 0 16px', lineHeight: 1.85 }}>
          {parseInline(line)}
        </p>
      );
    }

    i++;
  }

  return <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>{elements}</div>;
};

export default MarkdownRenderer;
