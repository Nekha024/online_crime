import re

f_path = 'd:/Developments/FreeLance/AICrimeReporting/frontend/src/pages/police/PoliceComplaintDetail.js'
with open(f_path, 'r', encoding='utf-8') as f:
    c = f.read()

# Add renderInlineEvidence helper
helper_code = """
  // Helper to render evidence inline without downloading
  const renderInlineEvidence = (url) => {
    if (!url) return null;
    const fullUrl = url.startsWith('http') ? url : `http://localhost:8000${url}`;
    const lowerUrl = fullUrl.toLowerCase();
    
    if (lowerUrl.match(/\\.(jpeg|jpg|gif|png|webp)$/)) {
      return <img src={fullUrl} alt="Evidence" style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />;
    }
    if (lowerUrl.match(/\\.(mp4|webm|ogg)$/)) {
      return <video controls src={fullUrl} style={{ width: '100%', maxHeight: '500px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />;
    }
    if (lowerUrl.match(/\\.(pdf)$/)) {
      return <iframe src={fullUrl} style={{ width: '100%', height: '600px', border: '1px solid #cbd5e1', borderRadius: '8px' }} title="Evidence Document" />;
    }
    return (
      <a href={fullUrl} target="_blank" rel="noreferrer" className="btn-view-details" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <FaFileAlt /> Open Evidence File
      </a>
    );
  };
"""

if "renderInlineEvidence" not in c:
    c = c.replace("const fetchComplaintDetails = useCallback(async () => {", helper_code + "\n  const fetchComplaintDetails = useCallback(async () => {")


# Update evidence rendering
old_evidence = """            {complaint.evidence_file && (
              <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                <a href={`http://localhost:8000${complaint.evidence_file}`} target="_blank" rel="noreferrer" className="btn-view-details" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <FaFileAlt /> View Uploaded Evidence File
                </a>
              </div>
            )}"""

new_evidence = """            {complaint.evidence_file && (
              <div style={{ marginTop: '14px', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaFileAlt /> Attached Evidence File
                </div>
                {renderInlineEvidence(complaint.evidence_file)}
              </div>
            )}"""

c = c.replace(old_evidence, new_evidence)

# Add Registered User info to top header
old_header_right = """        <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 16px', textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Assigned Precinct</div>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>{complaint.station_name}</div>
          <div style={{ fontSize: '0.75rem', color: '#1e3a8a' }}>{complaint.station_code} ({complaint.police_district})</div>
        </div>
      </div>"""

new_header_right = """        <div style={{ display: 'flex', gap: '16px', textAlign: 'right' }}>
          {complaint.registered_user_details && (
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 16px', textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Registered Account</div>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>{complaint.registered_user_details.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#1e3a8a' }}>{complaint.registered_user_details.email}</div>
              <div style={{ fontSize: '0.75rem', color: '#475569' }}>{complaint.registered_user_details.phone}</div>
            </div>
          )}

          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 16px', textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Assigned Precinct</div>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{complaint.station_name}</div>
            <div style={{ fontSize: '0.75rem', color: '#1e3a8a' }}>{complaint.station_code} ({complaint.police_district})</div>
          </div>
        </div>
      </div>"""

c = c.replace(old_header_right, new_header_right)

with open(f_path, 'w', encoding='utf-8') as f:
    f.write(c)
print("Updated evidence and header")
