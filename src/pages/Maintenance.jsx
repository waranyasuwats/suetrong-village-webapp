import { ChevronLeft, Wrench, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Maintenance() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="glass-button icon-only secondary">
          <ChevronLeft size={24} />
        </button>
        <h1 className="page-title" style={{ margin: 0 }}>แจ้งซ่อมส่วนกลาง</h1>
      </div>

      <button className="glass-button primary" style={{ width: '100%', marginBottom: '24px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
        <Plus size={20} /> แจ้งปัญหาใหม่
      </button>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '10px', borderRadius: '50%' }}>
              <Wrench size={24} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>หลอดไฟทางเดินซอย 2 ดับ</div>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>แจ้งเมื่อ: 2 พ.ค. 2567</div>
            </div>
          </div>
        </div>
        <span className="tag warning">กำลังดำเนินการ</span>
      </div>
    </div>
  );
}
