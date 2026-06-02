import React from 'react';
import { tokens } from '../tokens';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let keyCounter = 0;

  while (i < lines.length) {
    const line = lines[i];
    const key = keyCounter++;

    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={key} style={{ fontSize: tokens.fontSizes.xxl, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: '0 0 16px', lineHeight: 1.3 }}>
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key} style={{ fontSize: tokens.fontSizes.lg, fontWeight: tokens.fontWeights.semibold, color: tokens.colors.textPrimary, margin: '24px 0 8px', lineHeight: 1.4 }}>
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('```')) {
      const lang = line.slice(3);
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={key} style={{ margin: '12px 0' }}>
          {lang && <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{lang}</div>}
          <pre style={{
            background: tokens.colors.navy,
            borderRadius: tokens.borderRadius.lg,
            padding: '16px',
            overflowX: 'auto',
            margin: 0,
            fontSize: tokens.fontSizes.sm,
            lineHeight: 1.6,
            color: '#e2e8f0',
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          }}>
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key} style={{ margin: '8px 0', paddingLeft: 20 }}>
          {listItems.map((item, idx) => (
            <li key={idx} style={{ fontSize: tokens.fontSizes.md, color: tokens.colors.textSecondary, marginBottom: 6, lineHeight: 1.65 }}>{item}</li>
          ))}
        </ul>
      );
      continue;
    } else if (line.trim() === '') {
      elements.push(<div key={key} style={{ height: 8 }} />);
    } else {
      elements.push(
        <p key={key} style={{ fontSize: tokens.fontSizes.md, color: tokens.colors.textSecondary, margin: '8px 0', lineHeight: 1.75 }}>
          {line}
        </p>
      );
    }
    i++;
  }

  return <div>{elements}</div>;
};

export default MarkdownRenderer;
