import React, { useState, useEffect, useRef } from 'react';
import { tokens } from '../tokens';
import { TrashIcon } from './Icons';

interface ConfirmDeleteModalProps {
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

type Phase = 'confirm' | 'loading' | 'done';

const Spinner = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ animation: 'rte-spin 0.8s linear infinite' }}>
    <circle cx="10" cy="10" r="8" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" />
    <path d="M10 2a8 8 0 018 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="10" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="1.5" />
    <path d="M6.5 11l3 3 6-6" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ title, description, onConfirm, onCancel }) => {
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<Phase>('confirm');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase === 'confirm') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancel, phase]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleDelete = () => {
    if (input !== '확인') return;
    setPhase('loading');
    timerRef.current = setTimeout(() => {
      setPhase('done');
      timerRef.current = setTimeout(() => {
        onConfirm();
      }, 1200);
    }, 700);
  };

  const confirmed = input === '확인';
  const busy = phase !== 'confirm';

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onMouseDown={e => { if (e.target === e.currentTarget && !busy) onCancel(); }}
    >
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes rte-spin { to { transform: rotate(360deg); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.7); } to { opacity:1; transform:scale(1); } }
      `}</style>
      <div style={{
        background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16, padding: '28px 28px 24px', width: '100%', maxWidth: 400,
        animation: 'fadeUp 0.2s ease both',
      }}>
        {phase === 'done' ? (
          /* ── Success state ── */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '8px 0 4px' }}>
            <div style={{ animation: 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}>
              <CheckIcon />
            </div>
            <p style={{ fontSize: tokens.fontSizes.md, fontWeight: 700, color: '#fff', margin: 0, textAlign: 'center' }}>
              삭제가 완료되었습니다
            </p>
          </div>
        ) : phase === 'loading' ? (
          /* ── Loading state ── */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '8px 0 4px' }}>
            <Spinner />
            <p style={{ fontSize: tokens.fontSizes.sm, color: '#a1a1aa', margin: 0 }}>삭제 중...</p>
          </div>
        ) : (
          /* ── Confirm state ── */
          <>
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
                onKeyDown={e => { if (e.key === 'Enter' && confirmed) handleDelete(); }}
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
                onClick={handleDelete}
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
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
