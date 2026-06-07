import React, { useRef, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';

const STYLES = `
.empl-rte-wrap { position: relative; }
.empl-rte .ProseMirror {
  outline: none; color: #d4d4d8; font-size: 15px; line-height: 1.8;
  padding: 18px 20px; font-family: 'Inter', -apple-system, sans-serif;
  min-height: var(--rte-min-h, 320px);
}
.empl-rte .ProseMirror > * + * { margin-top: 0.75em; }
.empl-rte .ProseMirror > p { margin: 0 0 0.85em; }
.empl-rte .ProseMirror h1 { font-size: 2em; font-weight: 800; color: #fff; letter-spacing: -0.5px; line-height: 1.2; margin: 0 0 0.5em; }
.empl-rte .ProseMirror h2 { font-size: 1.5em; font-weight: 700; color: #f4f4f5; line-height: 1.3; margin: 0 0 0.4em; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.07); }
.empl-rte .ProseMirror h3 { font-size: 1.2em; font-weight: 700; color: #e4e4e7; line-height: 1.35; margin: 0 0 0.35em; }
.empl-rte .ProseMirror strong { color: #fff; font-weight: 700; }
.empl-rte .ProseMirror em { font-style: italic; }
.empl-rte .ProseMirror u { text-decoration: underline; }
.empl-rte .ProseMirror s { text-decoration: line-through; color: #71717a; }
.empl-rte .ProseMirror code:not(pre code) {
  background: rgba(249,115,22,0.1); color: #f97316; padding: 2px 6px;
  border-radius: 4px; font-size: 0.87em; font-family: 'Fira Code', 'Consolas', monospace;
}
.empl-rte .ProseMirror pre {
  background: #111; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px;
  padding: 16px 20px; margin: 1em 0; overflow-x: auto;
}
.empl-rte .ProseMirror pre code {
  background: none; color: #e2e8f0; padding: 0; font-size: 13px; line-height: 1.65;
  font-family: 'Fira Code', 'Consolas', monospace;
}
.empl-rte .ProseMirror blockquote {
  border-left: 3px solid #0070f3; background: rgba(0,112,243,0.06);
  margin: 1em 0; padding: 10px 16px; border-radius: 0 8px 8px 0;
}
.empl-rte .ProseMirror ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0 1em; }
.empl-rte .ProseMirror ol { list-style: decimal; padding-left: 1.5em; margin: 0.5em 0 1em; }
.empl-rte .ProseMirror li { color: #d4d4d8; line-height: 1.75; margin-bottom: 4px; }
.empl-rte .ProseMirror img { max-width: 100%; border-radius: 10px; margin: 0.8em 0; display: block; border: 1px solid rgba(255,255,255,0.08); cursor: default; }
.empl-rte .ProseMirror a { color: #3D7BFF; text-decoration: underline; cursor: pointer; }
.empl-rte .ProseMirror hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 2em 0; }
.empl-rte .ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder); color: #52525b; pointer-events: none; float: left; height: 0;
}
.empl-rte .ProseMirror.ProseMirror-focused { outline: none; }
`;

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

const Divider = () => (
  <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', margin: '0 4px', flexShrink: 0 }} />
);

const Btn: React.FC<{
  active?: boolean;
  title?: string;
  disabled?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ active, title, disabled, onMouseDown, children, style }) => (
  <button
    type="button"
    title={title}
    disabled={disabled}
    onMouseDown={e => { e.preventDefault(); if (!disabled) onMouseDown(e); }}
    style={{
      background: active ? 'rgba(255,255,255,0.14)' : 'none',
      border: 'none', borderRadius: 5, padding: '4px 6px',
      cursor: disabled ? 'default' : 'pointer',
      color: active ? '#fff' : disabled ? '#3f3f46' : '#71717a',
      fontSize: 12, fontWeight: active ? 700 : 500, fontFamily: 'inherit',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 26, height: 26, transition: 'all 0.12s', flexShrink: 0,
      lineHeight: 1, ...style,
    }}
    onMouseEnter={e => { if (!active && !disabled) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#d4d4d8'; } }}
    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = active ? 'rgba(255,255,255,0.14)' : 'none'; e.currentTarget.style.color = active ? '#fff' : '#71717a'; } }}
  >
    {children}
  </button>
);

/* ─── icon SVGs ─── */
const AlignL = () => <svg width="13" height="11" viewBox="0 0 13 11" fill="currentColor"><rect y="0" width="13" height="1.8" rx="0.9"/><rect y="4.5" width="9" height="1.8" rx="0.9"/><rect y="9" width="11" height="1.8" rx="0.9"/></svg>;
const AlignC = () => <svg width="13" height="11" viewBox="0 0 13 11" fill="currentColor"><rect y="0" width="13" height="1.8" rx="0.9"/><rect x="2" y="4.5" width="9" height="1.8" rx="0.9"/><rect x="1" y="9" width="11" height="1.8" rx="0.9"/></svg>;
const AlignR = () => <svg width="13" height="11" viewBox="0 0 13 11" fill="currentColor"><rect y="0" width="13" height="1.8" rx="0.9"/><rect x="4" y="4.5" width="9" height="1.8" rx="0.9"/><rect x="2" y="9" width="11" height="1.8" rx="0.9"/></svg>;
const BulletListIcon = () => <svg width="13" height="11" viewBox="0 0 13 11" fill="currentColor"><circle cx="1.2" cy="1.4" r="1.2"/><rect x="3.5" y="0.5" width="9.5" height="1.8" rx="0.9"/><circle cx="1.2" cy="5.6" r="1.2"/><rect x="3.5" y="4.7" width="9.5" height="1.8" rx="0.9"/><circle cx="1.2" cy="9.8" r="1.2"/><rect x="3.5" y="8.9" width="9.5" height="1.8" rx="0.9"/></svg>;
const OrderedListIcon = () => <svg width="13" height="11" viewBox="0 0 13 11" fill="currentColor"><text x="0" y="3" fontSize="3.5" fontWeight="700" fontFamily="monospace">1.</text><rect x="3.5" y="0.5" width="9.5" height="1.8" rx="0.9"/><text x="0" y="7.2" fontSize="3.5" fontWeight="700" fontFamily="monospace">2.</text><rect x="3.5" y="4.7" width="9.5" height="1.8" rx="0.9"/><text x="0" y="11.4" fontSize="3.5" fontWeight="700" fontFamily="monospace">3.</text><rect x="3.5" y="8.9" width="9.5" height="1.8" rx="0.9"/></svg>;
const ImageIcon = () => <svg width="14" height="12" viewBox="0 0 14 12" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="0.6" y="0.6" width="12.8" height="10.8" rx="1.5"/><circle cx="4.5" cy="4" r="1.2"/><path d="M0.6 8.5l3-3 2.5 2.5 2-2 3.5 4" strokeLinejoin="round"/></svg>;
const LinkIcon = () => <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M5.5 5a3 3 0 004 0l1.5-1.5A3 3 0 006.8 1L5.5 2.3"/><path d="M8.5 5a3 3 0 00-4 0L3 6.5A3 3 0 007.2 9L8.5 7.7"/></svg>;

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content, onChange, placeholder = '내용을 입력하세요...', minHeight = 320,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: { HTMLAttributes: { class: 'empl-code-block' } } }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ allowBase64: true, inline: false }),
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: '_blank', rel: 'noopener' } }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML() && (content === '' || content === '<p></p>')) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const insertImage = useCallback(async (file: File) => {
    if (!editor) return;
    const reader = new FileReader();
    reader.onload = e => {
      const src = e.target?.result as string;
      if (src) editor.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('링크 URL을 입력하세요', prev ?? 'https://');
    if (url === null) return;
    if (url === '') { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  const h = editor.isActive('heading', { level: 1 }) ? 1 : editor.isActive('heading', { level: 2 }) ? 2 : editor.isActive('heading', { level: 3 }) ? 3 : 0;

  return (
    <>
      <style>{STYLES}</style>
      <div className="empl-rte-wrap" style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, background: '#0a0a0a', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2,
          padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: '#0f0f0f', rowGap: 4,
        }}>
          {/* Heading / Normal */}
          <Btn active={h === 0 && !editor.isActive('codeBlock')} title="본문" onMouseDown={() => editor.chain().focus().setParagraph().run()} style={{ fontSize: 11 }}>¶</Btn>
          <Btn active={h === 1} title="제목 1" onMouseDown={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} style={{ fontSize: 13, fontWeight: 800 }}>H1</Btn>
          <Btn active={h === 2} title="제목 2" onMouseDown={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={{ fontSize: 12, fontWeight: 700 }}>H2</Btn>
          <Btn active={h === 3} title="제목 3" onMouseDown={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={{ fontSize: 11, fontWeight: 700 }}>H3</Btn>

          <Divider />

          {/* Inline formatting */}
          <Btn active={editor.isActive('bold')} title="굵게 (Ctrl+B)" onMouseDown={() => editor.chain().focus().toggleBold().run()} style={{ fontWeight: 900, fontSize: 14 }}>B</Btn>
          <Btn active={editor.isActive('italic')} title="기울임 (Ctrl+I)" onMouseDown={() => editor.chain().focus().toggleItalic().run()} style={{ fontStyle: 'italic', fontSize: 14 }}>I</Btn>
          <Btn active={editor.isActive('underline')} title="밑줄 (Ctrl+U)" onMouseDown={() => editor.chain().focus().toggleUnderline().run()} style={{ textDecoration: 'underline', fontSize: 13 }}>U</Btn>
          <Btn active={editor.isActive('strike')} title="취소선" onMouseDown={() => editor.chain().focus().toggleStrike().run()} style={{ textDecoration: 'line-through', fontSize: 13 }}>S</Btn>

          <Divider />

          {/* Code */}
          <Btn active={editor.isActive('code')} title="인라인 코드" onMouseDown={() => editor.chain().focus().toggleCode().run()} style={{ fontFamily: 'monospace', fontSize: 12 }}>{`<>`}</Btn>
          <Btn active={editor.isActive('codeBlock')} title="코드 블록" onMouseDown={() => editor.chain().focus().toggleCodeBlock().run()} style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '-1px' }}>{`{ }`}</Btn>

          <Divider />

          {/* Align */}
          <Btn active={editor.isActive({ textAlign: 'left' }) || !editor.isActive({ textAlign: 'center' }) && !editor.isActive({ textAlign: 'right' })} title="왼쪽 정렬" onMouseDown={() => editor.chain().focus().setTextAlign('left').run()}><AlignL /></Btn>
          <Btn active={editor.isActive({ textAlign: 'center' })} title="가운데 정렬" onMouseDown={() => editor.chain().focus().setTextAlign('center').run()}><AlignC /></Btn>
          <Btn active={editor.isActive({ textAlign: 'right' })} title="오른쪽 정렬" onMouseDown={() => editor.chain().focus().setTextAlign('right').run()}><AlignR /></Btn>

          <Divider />

          {/* Lists + quote */}
          <Btn active={editor.isActive('bulletList')} title="글머리 기호 목록" onMouseDown={() => editor.chain().focus().toggleBulletList().run()}><BulletListIcon /></Btn>
          <Btn active={editor.isActive('orderedList')} title="번호 목록" onMouseDown={() => editor.chain().focus().toggleOrderedList().run()}><OrderedListIcon /></Btn>
          <Btn active={editor.isActive('blockquote')} title="인용문" onMouseDown={() => editor.chain().focus().toggleBlockquote().run()} style={{ fontSize: 16, lineHeight: 1 }}>"</Btn>
          <Btn active={false} title="구분선" onMouseDown={() => editor.chain().focus().setHorizontalRule().run()} style={{ fontSize: 11, letterSpacing: '-1px' }}>—</Btn>

          <Divider />

          {/* Image */}
          <Btn active={false} title="이미지 삽입" onMouseDown={() => imageInputRef.current?.click()}><ImageIcon /></Btn>
          <Btn active={editor.isActive('link')} title="링크" onMouseDown={setLink}><LinkIcon /></Btn>

          <Divider />

          {/* Color */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Btn active={false} title="글자 색상" onMouseDown={() => colorInputRef.current?.click()} style={{ gap: 3 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: editor.getAttributes('textStyle').color || '#d4d4d8' }}>A</span>
              <div style={{ width: 13, height: 3, borderRadius: 2, background: editor.getAttributes('textStyle').color || '#d4d4d8' }} />
            </Btn>
            <input
              ref={colorInputRef}
              type="color"
              defaultValue="#ffffff"
              onChange={e => editor.chain().focus().setColor(e.target.value).run()}
              style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
            />
          </div>
          <Btn active={false} title="색상 초기화" onMouseDown={() => editor.chain().focus().unsetColor().run()} style={{ fontSize: 10, color: '#52525b' }}>✕</Btn>
        </div>

        {/* Editor area */}
        <div
          className="empl-rte"
          style={{ '--rte-min-h': `${minHeight}px` } as React.CSSProperties}
          onClick={() => editor.commands.focus()}
        >
          <EditorContent editor={editor} />
        </div>

        {/* Hidden inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) { insertImage(f); e.target.value = ''; } }}
        />
      </div>
    </>
  );
};

export default RichTextEditor;
