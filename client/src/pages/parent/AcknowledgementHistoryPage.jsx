import { ACKNOWLEDGEMENT_HISTORY, DEMO_FACULTY_REPORTS } from '../../data/mockData';
import { FiCheck, FiClock } from 'react-icons/fi';
import { useState } from 'react';

export default function AcknowledgementHistoryPage() {
  // Combine demo history with dynamically acknowledged reports
  const [history] = useState(ACKNOWLEDGEMENT_HISTORY);
  const allReports = DEMO_FACULTY_REPORTS;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-title">Acknowledgement History</div>
        <div className="page-subtitle">Record of all faculty reports you have reviewed</div>
      </div>

      {/* Info Banner */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '16px 20px', marginBottom: '24px', fontSize: '13px', color: '#1e40af' }}>
        <strong>ℹ️ About Acknowledgements:</strong> Acknowledgements serve as proof that you have reviewed each faculty report. They do not indicate agreement with the report.
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Reports', value: allReports.length, icon: '📝', color: '#3b82f6' },
          { label: 'Acknowledged', value: allReports.filter(r => r.parentAcknowledged).length, icon: '✅', color: '#16a34a' },
          { label: 'Pending Review', value: allReports.filter(r => !r.parentAcknowledged).length, icon: '⏳', color: '#f97316' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <div className="card-title">All Faculty Reports</div>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Faculty</th>
                <th>Course</th>
                <th>Severity</th>
                <th>Reported On</th>
                <th>Acknowledgement</th>
                <th>Date Acknowledged</th>
              </tr>
            </thead>
            <tbody>
              {allReports.map(r => (
                <tr key={r._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.concernType?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{r.description?.slice(0, 50)}...</div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{r.faculty?.name}</td>
                  <td>{r.course?.name}</td>
                  <td>
                    <span className={`badge badge-${r.severity === 'high' ? 'error' : r.severity === 'medium' ? 'warning' : 'info'}`}>
                      {r.severity?.charAt(0).toUpperCase() + r.severity?.slice(1)}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>{r.createdAt}</td>
                  <td>
                    {r.parentAcknowledged ? (
                      <span className="badge badge-success"><FiCheck size={10} /> Acknowledged</span>
                    ) : (
                      <span className="badge badge-warning"><FiClock size={10} /> Pending</span>
                    )}
                  </td>
                  <td style={{ fontSize: '13px' }}>
                    {r.parentAcknowledged && r.acknowledgedAt
                      ? new Date(r.acknowledgedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
