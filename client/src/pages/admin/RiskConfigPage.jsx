import { useState } from 'react';
import { FiSave, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';

const DEFAULT_CONFIG = {
  attendance: { high: 60, medium: 70, low: 75 },
  quizAvg: { high: 40, medium: 55, low: 65 },
  assignmentCompletion: { high: 40, medium: 60, low: 75 },
  consecutiveAbsences: { high: 5, medium: 3, low: 2 },
};

function Slider({ label, value, min, max, onChange, color }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: '14px', fontWeight: 800, color, fontFamily: "'Space Grotesk',sans-serif" }}>{value}%</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: color, cursor: 'pointer', height: '6px' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
        <span>{min}%</span><span>{max}%</span>
      </div>
    </div>
  );
}

export default function RiskConfigPage() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);

  const update = (category, level, val) =>
    setConfig(prev => ({ ...prev, [category]: { ...prev[category], [level]: val } }));

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const sections = [
    {
      key: 'attendance', title: 'Attendance Threshold', icon: '📅',
      desc: 'Students below these attendance % values get flagged at respective risk levels.',
      levels: [{ level: 'high', label: 'High Risk below', color: '#ef4444' }, { level: 'medium', label: 'Medium Risk below', color: '#f97316' }, { level: 'low', label: 'Low Risk below', color: '#f59e0b' }],
    },
    {
      key: 'quizAvg', title: 'Quiz Score Threshold', icon: '✏️',
      desc: 'Quiz average below these values trigger risk flags.',
      levels: [{ level: 'high', label: 'High Risk below', color: '#ef4444' }, { level: 'medium', label: 'Medium Risk below', color: '#f97316' }, { level: 'low', label: 'Low Risk below', color: '#f59e0b' }],
    },
    {
      key: 'assignmentCompletion', title: 'Assignment Completion', icon: '📝',
      desc: 'Assignment completion % below these thresholds trigger flags.',
      levels: [{ level: 'high', label: 'High Risk below', color: '#ef4444' }, { level: 'medium', label: 'Medium Risk below', color: '#f97316' }, { level: 'low', label: 'Low Risk below', color: '#f59e0b' }],
    },
    {
      key: 'consecutiveAbsences', title: 'Consecutive Absences', icon: '🗓️',
      desc: 'Number of consecutive absent days that trigger a risk flag.',
      unit: ' days',
      levels: [{ level: 'high', label: 'High Risk after', color: '#ef4444' }, { level: 'medium', label: 'Medium Risk after', color: '#f97316' }, { level: 'low', label: 'Low Risk after', color: '#f59e0b' }],
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-title">Risk Configuration</div>
            <div className="page-subtitle">Configure thresholds that trigger academic risk flags</div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary" onClick={() => setConfig(DEFAULT_CONFIG)}><FiRefreshCw size={14} /> Reset Defaults</button>
            <button className="btn btn-primary" onClick={handleSave}>
              {saved ? '✓ Saved!' : <><FiSave size={14} /> Save Config</>}
            </button>
          </div>
        </div>
      </div>

      {saved && (
        <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px 18px', marginBottom: '20px', fontSize: '14px', fontWeight: 600, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ✓ Configuration saved successfully!
        </div>
      )}

      {/* Risk Level Guide */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {[{ level: 'HIGH', color: '#ef4444', bg: '#fef2f2', desc: 'Immediate intervention required. Parent notified.' },
          { level: 'MEDIUM', color: '#f97316', bg: '#fff7ed', desc: 'Faculty attention needed. Recovery plan suggested.' },
          { level: 'LOW', color: '#f59e0b', bg: '#fffbeb', desc: 'Monitor closely. Encourage improvement.' }].map(r => (
          <div key={r.level} style={{ background: r.bg, border: `1px solid ${r.color}30`, borderRadius: '14px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <FiAlertTriangle size={20} color={r.color} />
            <div>
              <div style={{ fontWeight: 700, color: r.color, marginBottom: '4px' }}>{r.level} RISK</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{r.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Config Sections */}
      <div className="grid-2">
        {sections.map(sec => (
          <div key={sec.key} className="card">
            <div className="card-header" style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>{sec.icon}</span>
                <div>
                  <div className="card-title">{sec.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{sec.desc}</div>
                </div>
              </div>
            </div>
            {sec.levels.map(({ level, label, color }) => (
              <Slider
                key={level}
                label={label}
                value={config[sec.key][level]}
                min={sec.key === 'consecutiveAbsences' ? 1 : 20}
                max={sec.key === 'consecutiveAbsences' ? 15 : 90}
                color={color}
                onChange={val => update(sec.key, level, val)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
