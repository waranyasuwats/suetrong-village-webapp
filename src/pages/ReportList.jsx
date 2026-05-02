import { ChevronLeft, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ReportList() {
  const navigate = useNavigate();
  const { type } = useParams();

  let title = 'รายงาน';
  let reports = [];

  if (type === 'meeting') {
    title = 'รายงานประชุมใหญ่';
    reports = [
      { id: 1, name: 'รายงานการประชุมใหญ่สามัญเจ้าของร่วม (ครั้งแรก) วันอาทิตย์ ที่ 12 พฤษภาคม 2567' }
    ];
  } else if (type === 'finance') {
    title = 'รายงานการเงิน';
    reports = [
      { id: 1, name: 'งบกระแสเงินสด ม.ค. 67' },
      { id: 2, name: 'งบกระแสเงินสด ก.พ. 67' },
      { id: 3, name: 'งบกระแสเงินสด มี.ค. 67' },
      { id: 4, name: 'งบกระแสเงินสด เม.ย. 67' },
      { id: 5, name: 'งบกระแสเงินสด พ.ค. 67' },
      { id: 6, name: 'งบกระแสเงินสด มิ.ย. 67' },
    ];
  } else {
    title = 'รายงานอื่นๆ';
    reports = [
      { id: 1, name: 'เอกสารรายงาน 01' }
    ];
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="glass-button icon-only secondary">
          <ChevronLeft size={24} />
        </button>
        <h1 className="page-title" style={{ margin: 0, fontSize: '1.5rem' }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {reports.map((report) => (
          <a href="#" key={report.id} className="list-item-card">
            <span style={{ paddingRight: '16px', lineHeight: 1.5 }}>{report.name}</span>
            <div style={{ 
              padding: '12px', 
              background: 'rgba(255,255,255,0.9)', 
              borderRadius: '50%', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              flexShrink: 0
            }}>
              <FileText size={24} color="#1e293b" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
