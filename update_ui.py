import re

f_path = 'd:/Developments/FreeLance/AICrimeReporting/frontend/src/pages/police/PoliceComplaintDetail.js'
with open(f_path, 'r', encoding='utf-8') as f:
    c = f.read()

replacement = """{/* Tactical AI Intelligence Brief */}
          {(complaint.ai_severity || complaint.ai_summary) && (
          <div className="police-card" style={{ margin: 0, padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
            <div style={{ background: 'linear-gradient(to right, #0f172a, #1e3a8a)', padding: '16px 24px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem', color: '#fff', fontWeight: 'bold' }}>
                <FaRobot style={{ fontSize: '1.4rem', color: '#38bdf8' }} /> Tactical AI Intelligence Brief
              </h3>
              <div>{getAIBadge(complaint.ai_severity)}</div>
            </div>
            
            <div style={{ padding: '24px', background: '#f8fafc' }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Executive Summary
                </div>
                <div style={{ color: '#0f172a', fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 500, background: 'white', padding: '18px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  {complaint.ai_summary}
                </div>
              </div>

              {complaint.ai_analysis && (
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '12px' }}>
                    Structured Entities & Recommended Protocol
                  </div>
                  <div style={{ 
                    background: '#0f172a', 
                    color: '#e2e8f0', 
                    padding: '20px', 
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
                    lineHeight: 1.6,
                    border: '1px solid #334155',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    {parseMarkdown(complaint.ai_analysis)}
                  </div>
                </div>
              )}
            </div>
          </div>
          )}

          {/* Complaint Text */}"""

new_c = re.sub(r'\{\/\*\s*AI Insights Card\s*\*\/\}.*?<\/div>\s*\}\)\}\s*\{\/\*\s*Complaint Text\s*\*\/\}', replacement, c, flags=re.DOTALL)

with open(f_path, 'w', encoding='utf-8') as f:
    f.write(new_c)
