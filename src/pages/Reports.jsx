import { FileLineChart, ChevronLeft, FileText, Shield, Map } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Reports() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="glass-button icon-only secondary">
          <ChevronLeft size={24} />
        </button>
        <h1 className="page-title" style={{ margin: 0, fontSize: '1.5rem' }}>รายงานทั่วไป</h1>
      </div>

      <div className="report-grid">
        <Link to="/reports/meeting" className="report-card">
          <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <FileLineChart size={40} color="#f59e0b" />
          </div>
          <span>รายงานประชุมใหญ่</span>
        </Link>
        
        <Link to="/reports/committee" className="report-card">
          <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <FileText size={40} color="#3b82f6" />
          </div>
          <span>รายงานประชุมกรรมการ</span>
        </Link>
        
        <Link to="/reports/finance" className="report-card">
          <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <FileLineChart size={40} color="#10b981" />
          </div>
          <span>รายงานการเงิน</span>
        </Link>
        
        <Link to="/reports/rules" className="report-card">
          <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <FileText size={40} color="#8b5cf6" />
          </div>
          <span>ระเบียบข้อบังคับ</span>
        </Link>
        
        <Link to="/reports/insurance" className="report-card">
          <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Shield size={40} color="#ef4444" />
          </div>
          <span>ประกันภัยอาคาร</span>
        </Link>
        
        <Link to="/reports/physical" className="report-card">
          <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.9)', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Map size={40} color="#06b6d4" />
          </div>
          <span>กายภาพโครงการ</span>
        </Link>
      </div>
    </div>
  );
}
