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

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
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
