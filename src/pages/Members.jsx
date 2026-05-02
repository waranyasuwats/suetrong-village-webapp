import { ChevronLeft, Users, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Members() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="glass-button icon-only secondary">
          <ChevronLeft size={24} />
        </button>
        <h1 className="page-title" style={{ margin: 0 }}>สมาชิกในบ้านเรือน</h1>
      </div>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '50%' }}>
          <User size={28} color="#6366f1" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>คุณสมชาย รักหมู่บ้าน</div>
          <div className="text-muted" style={{ fontSize: '0.85rem' }}>เจ้าบ้าน</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '50%' }}>
          <User size={28} color="#6366f1" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>คุณสมศรี รักหมู่บ้าน</div>
          <div className="text-muted" style={{ fontSize: '0.85rem' }}>ผู้อยู่อาศัย</div>
        </div>
      </div>
    </div>
  );
}
