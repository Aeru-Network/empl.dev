import React, { useRef, useState } from 'react';
import { tokens } from '../tokens';
import type { ProfileData, Experience, Project, Post } from '../data/defaultData';
import { SparklesIcon, PlusIcon, CloseIcon, CheckIcon, TrashIcon, PencilIcon } from '../components/Icons';
import LocationInput from '../components/LocationInput';

interface SettingsProps {
  profile: ProfileData | null;
  onSave: (p: ProfileData) => void;
  onReset: () => void;
  onInitialize: () => void;
  onNewPost: () => void;
  onEditPost: (postId: string) => void;
}

const D = {
  bg: '#000', card: '#0f0f0f', input: '#111',
  border: 'rgba(255,255,255,0.08)', inputBorder: 'rgba(255,255,255,0.10)',
  borderFocus: 'rgba(255,255,255,0.28)', heading: '#fff', body: '#a1a1aa',
  muted: '#52525b', accent: '#0070f3', accentDim: 'rgba(0,112,243,0.12)',
  tag: 'rgba(255,255,255,0.06)', tagText: '#a1a1aa',
  error: '#ef4444', errorDim: 'rgba(239,68,68,0.1)', success: '#10b981',
};

const labelStyle: React.CSSProperties = {
  fontSize: tokens.fontSizes.xs, fontWeight: 600,
  color: D.body, display: 'block', marginBottom: 6, letterSpacing: '0.2px',
};

const inputBase: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: `1px solid ${D.inputBorder}`,
  borderRadius: 8, fontSize: tokens.fontSizes.sm, color: D.heading,
  outline: 'none', boxSizing: 'border-box', background: D.input,
  fontFamily: 'inherit', transition: `border-color ${tokens.transitions.fast}`,
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise(res => { const r = new FileReader(); r.onload = e => res(e.target!.result as string); r.readAsDataURL(file); });

const GRADIENT_PRESETS = [
  'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1a56db 100%)',
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)',
];

const Settings: React.FC<SettingsProps> = ({ profile, onSave, onReset, onInitialize, onNewPost, onEditPost }) => {
  if (!profile || !profile.name.trim()) {
    return (
      <div style={{ background: D.bg, minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '80px 20px' }}>
        <div style={{ background: D.card, borderRadius: 14, border: `1px solid ${D.border}`, maxWidth: 440, width: '100%', padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: D.accentDim, border: `1px solid rgba(0,112,243,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <SparklesIcon size={26} color={D.accent} />
          </div>
          <h1 style={{ fontSize: tokens.fontSizes.xl, fontWeight: 800, color: D.heading, margin: '0 0 10px' }}>설정할 프로필이 없어요</h1>
          <p style={{ fontSize: tokens.fontSizes.sm, color: D.body, margin: '0 0 24px', lineHeight: 1.65 }}>먼저 프로필을 만들어 주세요.</p>
          <button onClick={onInitialize} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#fff', color: '#000', border: 'none', borderRadius: 9, fontSize: tokens.fontSizes.md, fontWeight: 700, cursor: 'pointer' }}>
            <SparklesIcon size={17} color="#000" /> 프로필 시작하기
          </button>
        </div>
      </div>
    );
  }

  const [name, setName] = useState(profile.name);
  const [headline, setHeadline] = useState(profile.headline);
  const [role, setRole] = useState(profile.role);
  const [location, setLocation] = useState(profile.location);
  const [years, setYears] = useState(String(profile.yearsOfExp || ''));
  const [bio, setBio] = useState(profile.bio);
  const [skills, setSkills] = useState<string[]>(profile.skills);
  const [skillInput, setSkillInput] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar || '');
  const [bannerUrl, setBannerUrl] = useState(profile.banner || '');
  const [experiences, setExperiences] = useState<Experience[]>(profile.experience);
  const [projects, setProjects] = useState<Project[]>(profile.projects);
  const [saved, setSaved] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUrl(await fileToDataUrl(file));
    e.target.value = '';
  };

  const handleBannerFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerUrl(await fileToDataUrl(file));
    e.target.value = '';
  };

  const addSkill = () => {
    const v = skillInput.trim();
    if (v && !skills.includes(v)) setSkills(s => [...s, v]);
    setSkillInput('');
  };
  const removeSkill = (s: string) => setSkills(prev => prev.filter(x => x !== s));

  const handleSave = () => {
    onSave({
      ...profile,
      name: name.trim() || profile.name,
      headline: headline.trim(),
      role: role.trim(),
      location: location.trim(),
      yearsOfExp: Number(years) || 0,
      bio: bio.trim(),
      skills,
      avatar: avatarUrl,
      banner: bannerUrl || undefined,
      experience: experiences,
      projects,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = D.borderFocus);
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = D.inputBorder);

  return (
    <div style={{ background: D.bg, minHeight: '100vh', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 800, color: D.heading, margin: '0 0 24px', letterSpacing: '-1px' }}>설정</h1>

        {/* Banner */}
        <Card title="커버 배너">
          <div style={{
            height: 96, borderRadius: 10, border: `1px solid ${D.border}`, cursor: 'pointer',
            background: bannerUrl ? `url(${bannerUrl}) center/cover no-repeat` : 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1a56db 100%)',
            position: 'relative', overflow: 'hidden', marginBottom: 8,
          }} onClick={() => bannerInputRef.current?.click()}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)' }}>
              <span style={{ fontSize: tokens.fontSizes.xs, color: 'rgba(255,255,255,0.85)', fontWeight: 600, background: 'rgba(0,0,0,0.4)', padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)' }}>
                {bannerUrl ? '배너 변경' : '+ 배너 업로드'}
              </span>
            </div>
          </div>
          <input ref={bannerInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBannerFile} />
          {bannerUrl && <button onClick={() => setBannerUrl('')} style={{ background: 'none', border: 'none', color: D.muted, fontSize: tokens.fontSizes.xs, cursor: 'pointer', padding: 0 }}>배너 제거</button>}
        </Card>

        {/* Profile info */}
        <Card title="프로필 정보">
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%', border: `2px solid ${D.border}`, objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#1a56db,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 26, fontWeight: 700 }}>
                  {name.trim()[0] ?? '?'}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button onClick={() => avatarInputRef.current?.click()} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${D.border}`, color: D.body, borderRadius: 7, padding: '6px 14px', fontSize: tokens.fontSizes.xs, fontWeight: 600, cursor: 'pointer' }}>
                사진 업로드
              </button>
              {avatarUrl && <button onClick={() => setAvatarUrl('')} style={{ background: 'none', border: 'none', color: D.muted, fontSize: tokens.fontSizes.xs, cursor: 'pointer', padding: 0, textAlign: 'left' }}>사진 제거</button>}
            </div>
            <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarFile} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="이름"><input style={inputBase} value={name} onChange={e => setName(e.target.value)} onFocus={focus} onBlur={blur} /></Field>
            <Field label="한 줄 소개"><input style={inputBase} value={headline} onChange={e => setHeadline(e.target.value)} onFocus={focus} onBlur={blur} /></Field>
            <div style={{ display: 'flex', gap: 12 }}>
              <Field label="직무"><input style={inputBase} value={role} onChange={e => setRole(e.target.value)} onFocus={focus} onBlur={blur} /></Field>
              <div style={{ width: 110 }}>
                <Field label="경력(년)"><input style={inputBase} value={years} onChange={e => setYears(e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" onFocus={focus} onBlur={blur} /></Field>
              </div>
            </div>
            <Field label="위치"><LocationInput value={location} onChange={setLocation} style={inputBase} onFocus={focus} onBlur={blur} /></Field>
            <Field label="소개글"><textarea style={{ ...inputBase, resize: 'vertical', lineHeight: 1.6, minHeight: 90 }} value={bio} onChange={e => setBio(e.target.value)} rows={4} onFocus={focus} onBlur={blur} /></Field>
            <Field label="스킬">
              <div style={{ display: 'flex', gap: 8 }}>
                <input style={{ ...inputBase, flex: 1 }} value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} placeholder="Enter로 추가" onFocus={focus} onBlur={blur} />
                <button onClick={addSkill} style={{ flexShrink: 0, padding: '0 14px', borderRadius: 8, border: 'none', background: '#fff', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                  <PlusIcon size={16} color="#000" />
                </button>
              </div>
              {skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {skills.map(s => (
                    <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: D.tag, color: D.tagText, padding: '4px 6px 4px 10px', borderRadius: 999, fontSize: tokens.fontSizes.xs, fontWeight: 500, border: `1px solid ${D.border}` }}>
                      {s}
                      <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}>
                        <CloseIcon size={12} color={D.tagText} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Field>
          </div>
        </Card>

        {/* Experience */}
        <Card title="경력 · 학력">
          <ExperienceEditor experiences={experiences} onChange={setExperiences} />
        </Card>

        {/* Projects */}
        <Card title="프로젝트">
          <ProjectEditor projects={projects} onChange={setProjects} />
        </Card>

        {/* Posts */}
        <Card title="포스트 관리">
          <PostManager posts={profile.posts} onNew={onNewPost} onEdit={onEditPost} />
        </Card>

        {/* Notifications */}
        <Card title="알림 설정">
          {[
            { label: '새 팔로워', desc: '누군가 나를 팔로우하면 알림 받기' },
            { label: '메시지', desc: '새 메시지 수신 시 알림 받기' },
            { label: '채용 추천', desc: '맞춤 채용 공고 추천 받기' },
          ].map((item, i) => <NotifRow key={i} label={item.label} desc={item.desc} />)}
        </Card>

        {/* Account */}
        <Card title="계정">
          <Field label="이메일">
            <input defaultValue="arriha96@gmail.com" readOnly style={{ ...inputBase, color: D.muted, background: '#0a0a0a', cursor: 'not-allowed' }} />
          </Field>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <button onClick={onReset} style={{ padding: '8px 16px', background: 'none', border: `1px solid ${D.border}`, borderRadius: 8, fontSize: tokens.fontSizes.sm, color: D.body, cursor: 'pointer', fontWeight: 500 }}>
              프로필 초기화
            </button>
            <button style={{ padding: '8px 16px', background: D.errorDim, border: `1px solid rgba(239,68,68,0.25)`, borderRadius: 8, fontSize: tokens.fontSizes.sm, color: D.error, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrashIcon size={14} color={D.error} /> 계정 탈퇴
            </button>
          </div>
        </Card>

        <button
          onClick={handleSave}
          style={{
            width: '100%', padding: '13px', background: saved ? '#10b981' : '#fff',
            color: saved ? '#fff' : '#000', border: 'none', borderRadius: 9,
            fontSize: tokens.fontSizes.md, fontWeight: 700, cursor: 'pointer',
            transition: `background ${tokens.transitions.normal}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          }}
        >
          <CheckIcon size={17} color={saved ? '#fff' : '#000'} /> {saved ? '저장 완료 — 프로필로 이동 중' : '변경사항 저장'}
        </button>
      </div>
    </div>
  );
};

/* ── Experience Editor ── */

const emptyExp = (): Omit<Experience, 'id'> => ({ type: 'work', title: '', organization: '', period: '', description: '' });

const ExperienceEditor: React.FC<{ experiences: Experience[]; onChange: (exps: Experience[]) => void }> = ({ experiences, onChange }) => {
  const [editId, setEditId] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState<Omit<Experience, 'id'>>(emptyExp());

  const startNew = () => { setDraft(emptyExp()); setEditId('new'); };
  const startEdit = (exp: Experience) => { setDraft({ type: exp.type, title: exp.title, organization: exp.organization, period: exp.period, description: exp.description }); setEditId(exp.id); };
  const cancel = () => setEditId(null);

  const save = () => {
    if (!draft.title.trim()) return;
    if (editId === 'new') {
      onChange([...experiences, { ...draft, id: 'exp-' + Date.now() }]);
    } else if (editId) {
      onChange(experiences.map(e => e.id === editId ? { ...e, ...draft } : e));
    }
    setEditId(null);
  };

  const remove = (id: string) => onChange(experiences.filter(e => e.id !== id));

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = D.borderFocus);
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = D.inputBorder);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {experiences.map(exp => (
        editId === exp.id ? (
          <ExpForm key={exp.id} draft={draft} onChange={setDraft} onSave={save} onCancel={cancel} focus={focus} blur={blur} />
        ) : (
          <div key={exp.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', borderRadius: 8, border: `1px solid ${D.border}`, background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading }}>{exp.title}</div>
              <div style={{ fontSize: tokens.fontSizes.xs, color: D.body, marginTop: 2 }}>{exp.organization} · {exp.period}</div>
              <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, marginTop: 4, lineHeight: 1.5 }}>{exp.description}</div>
            </div>
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <button onClick={() => startEdit(exp)} style={{ background: 'none', border: `1px solid ${D.border}`, borderRadius: 6, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <PencilIcon size={12} color={D.muted} />
              </button>
              <button onClick={() => remove(exp.id)} style={{ background: 'none', border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 6, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <TrashIcon size={12} color="#ef4444" />
              </button>
            </div>
          </div>
        )
      ))}
      {editId === 'new' && (
        <ExpForm draft={draft} onChange={setDraft} onSave={save} onCancel={cancel} focus={focus} blur={blur} />
      )}
      {editId === null && (
        <button onClick={startNew} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 8, border: `1px dashed ${D.border}`, background: 'none', color: D.muted, fontSize: tokens.fontSizes.sm, cursor: 'pointer', marginTop: 2 }}>
          <PlusIcon size={14} color={D.muted} /> 경력 · 학력 추가
        </button>
      )}
    </div>
  );
};

const NOW = new Date();
const CUR_YEAR = NOW.getFullYear();
const CUR_MONTH = NOW.getMonth() + 1;
const YEARS = Array.from({ length: CUR_YEAR - 1979 }, (_, i) => String(CUR_YEAR - i));
const MONTHS = ['01','02','03','04','05','06','07','08','09','10','11','12'];

const availableMonths = (year: string) =>
  MONTHS.filter(m => !year || String(year) !== String(CUR_YEAR) || Number(m) <= CUR_MONTH);

function parsePeriod(period: string) {
  const parts = period.split(/\s*[–\-]\s*/);
  const [start = '', end = ''] = parts;
  const [sy = '', sm = ''] = start.split('.');
  const isCurrent = end.trim() === '현재';
  const [ey = '', em = ''] = isCurrent ? ['', ''] : end.split('.');
  return { sy, sm: sm.padStart(2, '0'), isCurrent, ey, em: em.padStart(2, '0') };
}

function buildPeriod(sy: string, sm: string, isCurrent: boolean, ey: string, em: string) {
  const s = sy ? (sm ? `${sy}.${sm}` : sy) : '';
  const e = isCurrent ? '현재' : (ey ? (em ? `${ey}.${em}` : ey) : '');
  if (!s && !e) return '';
  if (!e) return s;
  if (!s) return e;
  return `${s} – ${e}`;
}

const selectStyle: React.CSSProperties = {
  ...inputBase, flex: 1, padding: '10px 8px', cursor: 'pointer', appearance: 'none' as const,
};

const ExpForm: React.FC<{
  draft: Omit<Experience, 'id'>;
  onChange: (d: Omit<Experience, 'id'>) => void;
  onSave: () => void;
  onCancel: () => void;
  focus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  blur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}> = ({ draft, onChange, onSave, onCancel, focus, blur }) => {
  const parsed = parsePeriod(draft.period);
  const [sy, setSy] = useState(parsed.sy);
  const [sm, setSm] = useState(parsed.sm);
  const [isCurrent, setIsCurrent] = useState(parsed.isCurrent);
  const [ey, setEy] = useState(parsed.ey);
  const [em, setEm] = useState(parsed.em);

  const updatePeriod = (nSy = sy, nSm = sm, nCurrent = isCurrent, nEy = ey, nEm = em) => {
    onChange({ ...draft, period: buildPeriod(nSy, nSm, nCurrent, nEy, nEm) });
  };

  const toggleCurrent = () => {
    const next = !isCurrent;
    setIsCurrent(next);
    if (next) { setEy(''); setEm(''); }
    updatePeriod(sy, sm, next, next ? '' : ey, next ? '' : em);
  };

  const focusSel = (e: React.FocusEvent<HTMLSelectElement>) => (e.target.style.borderColor = D.borderFocus);
  const blurSel = (e: React.FocusEvent<HTMLSelectElement>) => (e.target.style.borderColor = D.inputBorder);

  return (
    <div style={{ border: `1px solid ${D.borderFocus}`, borderRadius: 8, padding: '14px', display: 'flex', flexDirection: 'column', gap: 10, background: 'rgba(255,255,255,0.02)' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {(['work', 'education'] as const).map(type => (
          <button key={type} onClick={() => onChange({ ...draft, type })} style={{ flex: 1, padding: '7px', borderRadius: 7, border: `1px solid ${draft.type === type ? D.accent : D.border}`, background: draft.type === type ? D.accentDim : 'none', color: draft.type === type ? D.accent : D.muted, fontSize: tokens.fontSizes.xs, fontWeight: 600, cursor: 'pointer' }}>
            {type === 'work' ? '직장' : '학력'}
          </button>
        ))}
      </div>
      <input style={{ ...inputBase }} placeholder={draft.type === 'work' ? '직책 (예: Senior Engineer)' : '전공 / 학위'} value={draft.title} onChange={e => onChange({ ...draft, title: e.target.value })} onFocus={focus} onBlur={blur} />
      <input style={{ ...inputBase }} placeholder={draft.type === 'work' ? '회사명' : '학교명'} value={draft.organization} onChange={e => onChange({ ...draft, organization: e.target.value })} onFocus={focus} onBlur={blur} />

      {/* Period picker */}
      <div>
        <div style={{ ...labelStyle, marginBottom: 8 }}>기간</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: tokens.fontSizes.xs, color: D.muted, width: 28, flexShrink: 0 }}>시작</span>
            <select value={sy} onChange={e => {
              const ny = e.target.value;
              const clampedSm = ny === String(CUR_YEAR) && Number(sm) > CUR_MONTH ? '' : sm;
              setSy(ny); setSm(clampedSm); updatePeriod(ny, clampedSm, isCurrent, ey, em);
            }} style={selectStyle} onFocus={focusSel} onBlur={blurSel}>
              <option value="">연도</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={sm} onChange={e => { setSm(e.target.value); updatePeriod(sy, e.target.value, isCurrent, ey, em); }} style={selectStyle} onFocus={focusSel} onBlur={blurSel}>
              <option value="">월</option>
              {availableMonths(sy).map(m => <option key={m} value={m}>{m}월</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: tokens.fontSizes.xs, color: D.muted, width: 28, flexShrink: 0 }}>종료</span>
            {isCurrent ? (
              <div style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: `1px solid ${D.accent}`, background: D.accentDim, fontSize: tokens.fontSizes.sm, color: D.accent, fontWeight: 600 }}>
                {draft.type === 'work' ? '현재 재직 중' : '현재 재학 중'}
              </div>
            ) : (
              <>
                <select value={ey} onChange={e => {
                  const ny = e.target.value;
                  const clampedEm = ny === String(CUR_YEAR) && Number(em) > CUR_MONTH ? '' : em;
                  setEy(ny); setEm(clampedEm); updatePeriod(sy, sm, isCurrent, ny, clampedEm);
                }} style={selectStyle} onFocus={focusSel} onBlur={blurSel}>
                  <option value="">연도</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select value={em} onChange={e => { setEm(e.target.value); updatePeriod(sy, sm, isCurrent, ey, e.target.value); }} style={selectStyle} onFocus={focusSel} onBlur={blurSel}>
                  <option value="">월</option>
                  {availableMonths(ey).map(m => <option key={m} value={m}>{m}월</option>)}
                </select>
              </>
            )}
            <button
              type="button"
              onClick={toggleCurrent}
              style={{ flexShrink: 0, padding: '8px 10px', borderRadius: 7, border: `1px solid ${isCurrent ? D.accent : D.border}`, background: isCurrent ? D.accentDim : 'none', color: isCurrent ? D.accent : D.muted, fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              {isCurrent ? '종료일 입력' : (draft.type === 'work' ? '재직 중' : '재학 중')}
            </button>
          </div>
        </div>
      </div>

      <textarea style={{ ...inputBase, resize: 'vertical', lineHeight: 1.6, minHeight: 70 }} placeholder="설명 (주요 업무, 성과 등)" value={draft.description} onChange={e => onChange({ ...draft, description: e.target.value })} onFocus={focus} onBlur={blur} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onCancel} style={{ flex: 1, padding: '8px', borderRadius: 7, border: `1px solid ${D.border}`, background: 'none', color: D.muted, fontSize: tokens.fontSizes.sm, cursor: 'pointer', fontWeight: 500 }}>취소</button>
        <button onClick={onSave} style={{ flex: 2, padding: '8px', borderRadius: 7, border: 'none', background: '#fff', color: '#000', fontSize: tokens.fontSizes.sm, cursor: 'pointer', fontWeight: 700 }}>저장</button>
      </div>
    </div>
  );
};

/* ── Project Editor ── */

const emptyProj = (): Omit<Project, 'id'> => ({
  title: '', description: '', longDescription: '', techStack: [],
  githubUrl: '', demoUrl: '', stars: undefined, imageGradient: GRADIENT_PRESETS[0],
});

const ProjectEditor: React.FC<{ projects: Project[]; onChange: (projs: Project[]) => void }> = ({ projects, onChange }) => {
  const [editId, setEditId] = useState<string | 'new' | null>(null);
  const [draft, setDraft] = useState<Omit<Project, 'id'>>(emptyProj());

  const startNew = () => { setDraft(emptyProj()); setEditId('new'); };
  const startEdit = (p: Project) => {
    setDraft({ title: p.title, description: p.description, longDescription: p.longDescription, techStack: [...p.techStack], githubUrl: p.githubUrl ?? '', demoUrl: p.demoUrl ?? '', stars: p.stars, imageGradient: p.imageGradient });
    setEditId(p.id);
  };
  const cancel = () => setEditId(null);

  const save = () => {
    if (!draft.title.trim()) return;
    if (editId === 'new') {
      onChange([...projects, { ...draft, id: 'proj-' + Date.now() }]);
    } else if (editId) {
      onChange(projects.map(p => p.id === editId ? { ...p, ...draft } : p));
    }
    setEditId(null);
  };

  const remove = (id: string) => onChange(projects.filter(p => p.id !== id));

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = D.borderFocus);
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = D.inputBorder);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {projects.map(proj => (
        editId === proj.id ? (
          <ProjForm key={proj.id} draft={draft} onChange={setDraft} onSave={save} onCancel={cancel} focus={focus} blur={blur} />
        ) : (
          <div key={proj.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', borderRadius: 8, border: `1px solid ${D.border}`, background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: proj.imageGradient, flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading }}>{proj.title}</div>
              <div style={{ fontSize: tokens.fontSizes.xs, color: D.body, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{proj.description}</div>
              <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, marginTop: 4 }}>{proj.techStack.slice(0, 4).join(' · ')}</div>
            </div>
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <button onClick={() => startEdit(proj)} style={{ background: 'none', border: `1px solid ${D.border}`, borderRadius: 6, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <PencilIcon size={12} color={D.muted} />
              </button>
              <button onClick={() => remove(proj.id)} style={{ background: 'none', border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 6, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <TrashIcon size={12} color="#ef4444" />
              </button>
            </div>
          </div>
        )
      ))}
      {editId === 'new' && (
        <ProjForm draft={draft} onChange={setDraft} onSave={save} onCancel={cancel} focus={focus} blur={blur} />
      )}
      {editId === null && (
        <button onClick={startNew} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 8, border: `1px dashed ${D.border}`, background: 'none', color: D.muted, fontSize: tokens.fontSizes.sm, cursor: 'pointer', marginTop: 2 }}>
          <PlusIcon size={14} color={D.muted} /> 프로젝트 추가
        </button>
      )}
    </div>
  );
};

const ProjForm: React.FC<{
  draft: Omit<Project, 'id'>;
  onChange: (d: Omit<Project, 'id'>) => void;
  onSave: () => void;
  onCancel: () => void;
  focus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  blur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}> = ({ draft, onChange, onSave, onCancel, focus, blur }) => {
  const [techInput, setTechInput] = useState('');

  const addTech = () => {
    const v = techInput.trim();
    if (v && !draft.techStack.includes(v)) onChange({ ...draft, techStack: [...draft.techStack, v] });
    setTechInput('');
  };

  return (
    <div style={{ border: `1px solid ${D.borderFocus}`, borderRadius: 8, padding: '14px', display: 'flex', flexDirection: 'column', gap: 10, background: 'rgba(255,255,255,0.02)' }}>
      <input style={{ ...inputBase }} placeholder="프로젝트명" value={draft.title} onChange={e => onChange({ ...draft, title: e.target.value })} onFocus={focus} onBlur={blur} />
      <textarea style={{ ...inputBase, resize: 'vertical', lineHeight: 1.6, minHeight: 60 }} placeholder="짧은 설명 (카드에 표시)" value={draft.description} onChange={e => onChange({ ...draft, description: e.target.value })} onFocus={focus} onBlur={blur} />
      <textarea style={{ ...inputBase, resize: 'vertical', lineHeight: 1.6, minHeight: 90 }} placeholder="상세 설명 (마크다운 지원)" value={draft.longDescription} onChange={e => onChange({ ...draft, longDescription: e.target.value })} onFocus={focus} onBlur={blur} />
      <div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input style={{ ...inputBase, flex: 1 }} placeholder="기술 스택 (Enter로 추가)" value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }} onFocus={focus} onBlur={blur} />
          <button onClick={addTech} style={{ flexShrink: 0, padding: '0 12px', borderRadius: 8, border: 'none', background: '#fff', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <PlusIcon size={14} color="#000" />
          </button>
        </div>
        {draft.techStack.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
            {draft.techStack.map(t => (
              <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: D.tag, color: D.tagText, padding: '3px 6px 3px 9px', borderRadius: 999, fontSize: tokens.fontSizes.xs, border: `1px solid ${D.border}` }}>
                {t}
                <button onClick={() => onChange({ ...draft, techStack: draft.techStack.filter(x => x !== t) })} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}>
                  <CloseIcon size={11} color={D.tagText} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <input style={{ ...inputBase, flex: 1 }} placeholder="GitHub URL (선택)" value={draft.githubUrl ?? ''} onChange={e => onChange({ ...draft, githubUrl: e.target.value })} onFocus={focus} onBlur={blur} />
        <input style={{ ...inputBase, flex: 1 }} placeholder="데모 URL (선택)" value={draft.demoUrl ?? ''} onChange={e => onChange({ ...draft, demoUrl: e.target.value })} onFocus={focus} onBlur={blur} />
      </div>
      <input style={{ ...inputBase }} placeholder="GitHub Stars (선택)" type="number" value={draft.stars ?? ''} onChange={e => onChange({ ...draft, stars: e.target.value ? Number(e.target.value) : undefined })} onFocus={focus} onBlur={blur} />
      <div>
        <div style={labelStyle}>배경 색상</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {GRADIENT_PRESETS.map(g => (
            <button key={g} onClick={() => onChange({ ...draft, imageGradient: g })} style={{ width: 40, height: 28, borderRadius: 6, background: g, border: draft.imageGradient === g ? '2px solid #fff' : `2px solid transparent`, cursor: 'pointer', padding: 0 }} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onCancel} style={{ flex: 1, padding: '8px', borderRadius: 7, border: `1px solid ${D.border}`, background: 'none', color: D.muted, fontSize: tokens.fontSizes.sm, cursor: 'pointer', fontWeight: 500 }}>취소</button>
        <button onClick={onSave} style={{ flex: 2, padding: '8px', borderRadius: 7, border: 'none', background: '#fff', color: '#000', fontSize: tokens.fontSizes.sm, cursor: 'pointer', fontWeight: 700 }}>저장</button>
      </div>
    </div>
  );
};

/* ── Post Manager ── */

const PostManager: React.FC<{ posts: Post[]; onNew: () => void; onEdit: (id: string) => void }> = ({ posts, onNew, onEdit }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    {posts.map(post => (
      <div key={post.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: `1px solid ${D.border}`, background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
          <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, marginTop: 2 }}>{post.date} · {post.readingTime}분 읽기</div>
        </div>
        <button onClick={() => onEdit(post.id)} style={{ background: 'none', border: `1px solid ${D.border}`, borderRadius: 6, padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <PencilIcon size={12} color={D.muted} />
        </button>
      </div>
    ))}
    <button onClick={onNew} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 8, border: `1px dashed ${D.border}`, background: 'none', color: D.muted, fontSize: tokens.fontSizes.sm, cursor: 'pointer', marginTop: 2 }}>
      <PlusIcon size={14} color={D.muted} /> 새 포스트 작성
    </button>
  </div>
);

/* ── Shared sub-components ── */

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ background: '#0f0f0f', borderRadius: 12, border: `1px solid rgba(255,255,255,0.08)`, padding: '22px 24px', marginBottom: 14 }}>
    <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: 700, color: '#fff', margin: '0 0 18px', letterSpacing: '-0.3px' }}>{title}</h2>
    {children}
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ flex: 1 }}>
    <label style={labelStyle}>{label}</label>
    {children}
  </div>
);

const NotifRow: React.FC<{ label: string; desc: string }> = ({ label, desc }) => {
  const [on, setOn] = useState(false);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
      <div>
        <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 500, color: '#fff' }}>{label}</div>
        <div style={{ fontSize: tokens.fontSizes.xs, color: '#52525b', marginTop: 2 }}>{desc}</div>
      </div>
      <button
        onClick={() => setOn(v => !v)}
        style={{ width: 42, height: 24, borderRadius: 999, border: 'none', background: on ? '#0070f3' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: `background ${tokens.transitions.normal}`, flexShrink: 0 }}
      >
        <div style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: `left ${tokens.transitions.normal}` }} />
      </button>
    </div>
  );
};

export default Settings;
