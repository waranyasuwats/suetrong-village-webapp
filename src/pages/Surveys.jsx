import { ChevronLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Surveys() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="glass-button icon-only secondary">
          <ChevronLeft size={24} />
        </button>
        <h1 className="page-title" style={{ margin: 0 }}>แบบสำรวจความคิดเห็น</h1>
      </div>

      <div className="glass-card" style={{ padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '12px', borderRadius: '50%' }}>
            <FileText size={28} color="#ec4899" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>แบบสำรวจการปรับปรุงสวนหย่อม</div>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.5 }}>
              รบกวนลูกบ้านร่วมโหวตเลือกแบบสวนหย่อมใหม่บริเวณหน้าหมู่บ้านครับ
            </p>
            <button className="glass-button secondary" style={{ width: '100%', fontSize: '0.9rem' }}>
              ทำแบบสำรวจ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
