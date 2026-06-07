import React, { useState } from 'react';
import { tokens } from '../tokens';
import type { Post } from '../data/defaultData';
import { ArrowLeftIcon, PlusIcon, CloseIcon, CheckIcon } from '../components/Icons';
import RichTextEditor from '../components/RichTextEditor';

interface PostEditorProps {
  post: Post | null;
  onSave: (post: Post) => void;
  onCancel: () => void;
}

const D = {
  bg: '#000', card: '#0f0f0f', input: '#111',
  border: 'rgba(255,255,255,0.08)', inputBorder: 'rgba(255,255,255,0.10)',
  borderFocus: 'rgba(255,255,255,0.28)', heading: '#fff', body: '#a1a1aa',
  muted: '#52525b', accent: '#0070f3', tag: 'rgba(255,255,255,0.06)', tagText: '#a1a1aa',
};

const inputBase: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: `1px solid ${D.inputBorder}`,
  borderRadius: 8, fontSize: tokens.fontSizes.sm, color: D.heading,
  outline: 'none', boxSizing: 'border-box', background: D.input,
  fontFamily: 'inherit', transition: `border-color ${tokens.transitions.fast}`,
};

const today = () => new Date().toISOString().split('T')[0];

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const estimateReadingTime = (html: string) =>
  Math.max(1, Math.round(stripHtml(html).split(/\s+/).filter(Boolean).length / 200));

const isEmptyContent = (html: string) =>
  !html || html === '<p></p>' || stripHtml(html).length === 0;

const PostEditor: React.FC<PostEditorProps> = ({ post, onSave, onCancel }) => {
  const [title, setTitle] = useState(post?.title ?? '');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [saved, setSaved] = useState(false);

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = D.borderFocus);
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = D.inputBorder);

  const addTag = () => {
    const v = tagInput.trim();
    if (v && !tags.includes(v)) setTags(t => [...t, v]);
    setTagInput('');
  };

  const canSave = title.trim().length > 0 && !isEmptyContent(content);

  const handleSave = () => {
    if (!canSave) return;
    const autoExcerpt = excerpt.trim() || stripHtml(content).slice(0, 200).trim();
    const result: Post = {
      id: post?.id ?? 'post-' + Date.now(),
      title: title.trim(),
      excerpt: autoExcerpt,
      content: content,
      date: post?.date ?? today(),
      tags,
      likes: post?.likes ?? 0,
      views: post?.views ?? 0,
      readingTime: estimateReadingTime(content),
    };
    setSaved(true);
    setTimeout(() => onSave(result), 600);
  };

  const isNew = !post;

  return (
    <div style={{ background: D.bg, minHeight: '100vh', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <button onClick={onCancel} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: D.body, fontSize: tokens.fontSizes.sm, cursor: 'pointer', padding: '0 0 24px' }}>
          <ArrowLeftIcon size={15} color={D.body} /> 돌아가기
        </button>

        <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: D.heading, margin: '0 0 28px', letterSpacing: '-0.8px' }}>
          {isNew ? '새 포스트 작성' : '포스트 수정'}
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Title */}
          <div>
            <label style={{ fontSize: tokens.fontSizes.xs, fontWeight: 600, color: D.body, display: 'block', marginBottom: 6 }}>제목</label>
            <input
              style={{ ...inputBase, fontSize: '18px', fontWeight: 600 }}
              placeholder="포스트 제목을 입력하세요"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onFocus={focus}
              onBlur={blur}
            />
          </div>

          {/* Tags */}
          <div>
            <label style={{ fontSize: tokens.fontSizes.xs, fontWeight: 600, color: D.body, display: 'block', marginBottom: 6 }}>태그</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                style={{ ...inputBase, flex: 1 }}
                placeholder="태그 입력 후 Enter"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                onFocus={focus}
                onBlur={blur}
              />
              <button onClick={addTag} style={{ flexShrink: 0, padding: '0 14px', borderRadius: 8, border: 'none', background: '#fff', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                <PlusIcon size={16} color="#000" />
              </button>
            </div>
            {tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                {tags.map(t => (
                  <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: D.tag, color: D.tagText, padding: '4px 6px 4px 10px', borderRadius: 999, fontSize: tokens.fontSizes.xs, fontWeight: 500, border: `1px solid ${D.border}` }}>
                    {t}
                    <button onClick={() => setTags(prev => prev.filter(x => x !== t))} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}>
                      <CloseIcon size={12} color={D.tagText} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label style={{ fontSize: tokens.fontSizes.xs, fontWeight: 600, color: D.body, display: 'block', marginBottom: 6 }}>
              요약 <span style={{ color: D.muted, fontWeight: 400 }}>(비워두면 본문에서 자동 추출)</span>
            </label>
            <textarea
              style={{ ...inputBase, resize: 'vertical', lineHeight: 1.6, minHeight: 70 }}
              placeholder="포스트 요약을 입력하세요"
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              onFocus={focus}
              onBlur={blur}
            />
          </div>

          {/* Content - Rich Text Editor */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: tokens.fontSizes.xs, fontWeight: 600, color: D.body }}>본문</label>
              {!isEmptyContent(content) && (
                <span style={{ fontSize: tokens.fontSizes.xs, color: D.muted }}>
                  약 {estimateReadingTime(content)}분 읽기
                </span>
              )}
            </div>
            <RichTextEditor
              key={post?.id ?? 'new'}
              content={content}
              onChange={setContent}
              placeholder="포스트 내용을 입력하세요. 이미지, 코드 블록, 헤딩 등 다양한 서식을 지원합니다."
              minHeight={420}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button
              onClick={onCancel}
              style={{ flex: 1, padding: '12px', borderRadius: 9, border: `1px solid ${D.border}`, background: 'none', color: D.body, fontSize: tokens.fontSizes.sm, fontWeight: 600, cursor: 'pointer' }}
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              style={{
                flex: 3, padding: '12px', borderRadius: 9, border: 'none',
                background: saved ? '#10b981' : (!canSave ? 'rgba(255,255,255,0.1)' : '#fff'),
                color: saved ? '#fff' : (!canSave ? D.muted : '#000'),
                fontSize: tokens.fontSizes.md, fontWeight: 700, cursor: !canSave ? 'not-allowed' : 'pointer',
                transition: `background ${tokens.transitions.normal}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              }}
            >
              <CheckIcon size={16} color={saved ? '#fff' : (!canSave ? D.muted : '#000')} />
              {saved ? '저장 완료!' : isNew ? '게시하기' : '수정 완료'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
