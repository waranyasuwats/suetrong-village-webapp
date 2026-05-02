import { ChevronLeft, Contact, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Visitors() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="glass-button icon-only secondary">
          <ChevronLeft size={24} />
        </button>
        <h1 className="page-title" style={{ margin: 0 }}>ลงทะเบียนผู้มาติดต่อ</h1>
      </div>

      <button className="glass-button primary" style={{ width: '100%', marginBottom: '24px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
        <Plus size={20} /> ลงทะเบียนล่วงหน้า
      </button>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '10px', borderRadius: '50%' }}>
              <Contact size={24} color="#8b5cf6" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>ช่างแอร์ (คุณสมคิด)</div>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>ทะเบียน: กข-1234 กทม.</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>คาดว่าจะถึง: 14:00 น.</div>
           <span className="tag info">รอการเข้าพบ</span>
        </div>
      </div>
    </div>
  );
}
