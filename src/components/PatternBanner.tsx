type PatternType = 'creational' | 'structural' | 'behavioral';

interface PatternBannerProps {
  patterns: { name: string; type: PatternType }[];
  description: string;
}

const TYPE_COLORS: Record<PatternType, { bg: string; border: string; text: string; label: string }> = {
  creational: { bg: '#1e1333', border: '#7c3aed', text: '#c4b5fd', label: 'Creational' },
  structural:  { bg: '#0c1f26', border: '#0e7490', text: '#67e8f9', label: 'Structural' },
  behavioral:  { bg: '#1c110a', border: '#c2410c', text: '#fdba74', label: 'Behavioral' },
};

export default function PatternBanner({ patterns, description }: PatternBannerProps) {
  return (
    <div className="pattern-banner">
      <div className="pattern-banner-tags">
        {patterns.map(p => {
          const c = TYPE_COLORS[p.type];
          return (
            <span
              key={p.name}
              className="pattern-tag"
              style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
            >
              <span className="pattern-tag-label" style={{ color: c.border }}>{c.label}</span>
              {p.name}
            </span>
          );
        })}
      </div>
      <p className="pattern-banner-desc">{description}</p>
    </div>
  );
}
