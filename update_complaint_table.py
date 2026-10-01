import re

f_path = 'd:/Developments/FreeLance/AICrimeReporting/frontend/src/pages/police/PoliceComplaintsList.js'
with open(f_path, 'r', encoding='utf-8') as f:
    c = f.read()

# Make sure FaClock is imported
if "FaClock" not in c:
    c = c.replace("FaExclamationTriangle,", "FaExclamationTriangle,\n  FaClock,")

start_idx = c.find('<div className="police-table-responsive">')
end_idx = c.find('</>', start_idx)

replacement = """<div className="police-table-responsive" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
              <table className="police-table" style={{ borderCollapse: 'collapse', width: '100%', margin: 0 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ color: '#475569', padding: '16px 20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, textAlign: 'left' }}>Case Info</th>
                    <th style={{ color: '#475569', padding: '16px 20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, textAlign: 'left' }}>Location & Time</th>
                    <th style={{ color: '#475569', padding: '16px 20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, textAlign: 'center' }}>Status / Priority</th>
                    <th style={{ color: '#475569', padding: '16px 20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, textAlign: 'center' }}>AI Intelligence</th>
                    <th style={{ color: '#475569', padding: '16px 20px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c, idx) => (
                    <tr key={c.id} style={{ 
                      background: '#fff', 
                      borderBottom: idx === complaints.length - 1 ? 'none' : '1px solid #f1f5f9',
                      transition: 'background 0.2s ease',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                    >
                      <td style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ 
                            minWidth: '44px', height: '44px', borderRadius: '10px', 
                            background: '#eff6ff', color: '#3b82f6', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' 
                          }}>
                            <FaClipboardList />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', marginBottom: '4px' }}>{c.title}</div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <strong style={{ color: '#6366f1', fontFamily: '"SFMono-Regular", Consolas, monospace', fontSize: '0.75rem', letterSpacing: '0.05em', background: '#e0e7ff', padding: '2px 6px', borderRadius: '4px' }}>
                                #{c.complaint_id}
                              </strong>
                              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{c.complaint_type}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '20px' }}>
                        <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                           {c.location}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          <FaClock style={{ display: 'inline', marginRight: '4px', color: '#94a3b8' }} />
                          {c.formatted_date || c.date}
                        </div>
                      </td>
                      <td style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                          <span className={getStatusBadge(c.status)} style={{ minWidth: '100px' }}>
                            {c.status}
                          </span>
                          <span className={getPriorityBadge(c.priority)}>
                            {c.priority} Priority
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '20px', textAlign: 'center' }}>
                        {getAIBadge(c.ai_severity)}
                      </td>
                      <td style={{ padding: '20px', textAlign: 'right' }}>
                        <Link
                          to={`/police/complaints/${c.complaint_id}`}
                          className="btn-view-details"
                          style={{ 
                            padding: '8px 16px', 
                            fontSize: '0.85rem', 
                            background: '#fff', 
                            color: '#0f172a', 
                            border: '1px solid #cbd5e1', 
                            borderRadius: '6px',
                            fontWeight: 600,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            textDecoration: 'none'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                        >
                          <FaEye /> View Case
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          """

if start_idx != -1 and end_idx != -1:
    new_c = c[:start_idx] + replacement + c[end_idx:]
    with open(f_path, 'w', encoding='utf-8') as f:
        f.write(new_c)
    print("Table Redesigned")
else:
    print("Could not find table section")
