import React, { useState, useRef, useEffect } from 'react';

interface LocationInputProps {
  value: string;
  onChange: (v: string) => void;
  style?: React.CSSProperties;
  placeholder?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

interface NominatimResult {
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    province?: string;
    region?: string;
    country?: string;
  };
}

function formatResult(item: NominatimResult): string {
  const a = item.address;
  const city = a.city || a.town || a.village || a.municipality || a.county;
  const state = a.state || a.province || a.region;
  const country = a.country;
  const parts = [city, state, country].filter(Boolean);
  return parts.length >= 2 ? parts.join(', ') : item.display_name.split(',').slice(0, 3).join(',').trim();
}

const LocationInput: React.FC<LocationInputProps> = ({
  value, onChange, style, placeholder = '예: 서울, 대한민국', onFocus, onBlur,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const search = (q: string) => {
    clearTimeout(debounceRef.current);
    if (q.length < 2) { setSuggestions([]); setOpen(false); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1&accept-language=ko`,
        );
        const data: NominatimResult[] = await res.json();
        const names = data.map(formatResult);
        const unique = [...new Set(names)].slice(0, 5);
        setSuggestions(unique);
        setOpen(unique.length > 0);
      } catch {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 320);
  };

  const select = (s: string) => {
    onChange(s);
    setOpen(false);
    setSuggestions([]);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <input
        value={value}
        onChange={e => { onChange(e.target.value); search(e.target.value); }}
        placeholder={placeholder}
        style={style}
        autoComplete="off"
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {(open || loading) && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 200,
          background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 8, overflow: 'hidden',
          boxShadow: '0 8px 28px rgba(0,0,0,0.55)',
        }}>
          {loading && suggestions.length === 0 && (
            <div style={{ padding: '10px 14px', fontSize: 12, color: '#52525b' }}>검색 중...</div>
          )}
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onMouseDown={e => { e.preventDefault(); select(s); }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 14px', background: 'none', border: 'none',
                borderBottom: i < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                cursor: 'pointer', fontSize: 13, color: '#e4e4e7', fontFamily: 'inherit',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
