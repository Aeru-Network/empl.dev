import React, { useState, useEffect } from 'react';
import { tokens } from '../tokens';
import { TrashIcon } from './Icons';

interface ConfirmDeleteModalProps {
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ title, description, onConfirm, onCancel }) => {
  const [input, setInput] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancel]);

  const confirmed = input === '확인';

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onMouseDown={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{
        background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16, padding: '28px 28px 24px', width: '100%', maxWidth: 400,
        animation: 'fadeUp 0.2s ease both',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
        }}>
          <TrashIcon size={20} color="#ef4444" />
        </div>

        <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: 700, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.3px' }}>
          {title}
        </h2>
        {description && (
          <p style={{ fontSize: tokens.fontSizes.sm, color: '#a1a1aa', margin: '0 0 20px', lineHeight: 1.6 }}>
            {description}
          </p>
        )}

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: tokens.fontSizes.xs, color: '#a1a1aa', display: 'block', marginBottom: 8, fontWeight: 500 }}>
            계속하려면 <strong style={{ color: '#fff' }}>확인</strong>을 입력해주세요
          </label>
          <input
            autoFocus
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && confirmed) onConfirm(); }}
            placeholder="확인"
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '10px 12px', borderRadius: 8,
              border: `1px solid ${input.length > 0 && !confirmed ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
              background: '#111', color: '#fff', fontSize: tokens.fontSizes.sm,
              fontFamily: 'inherit', outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '11px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
              border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
              color: '#a1a1aa', fontSize: tokens.fontSizes.sm, fontWeight: 500,
            }}
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={!confirmed}
            style={{
              flex: 1, padding: '11px', borderRadius: 8, cursor: confirmed ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
              border: 'none', background: confirmed ? '#ef4444' : 'rgba(239,68,68,0.2)',
              color: confirmed ? '#fff' : 'rgba(239,68,68,0.5)',
              fontSize: tokens.fontSizes.sm, fontWeight: 700,
              transition: 'all 0.15s ease',
            }}
          >
            삭제
          </button>
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
};

export default ConfirmDeleteModal;
