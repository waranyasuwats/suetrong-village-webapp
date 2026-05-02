import { ChevronLeft, Phone, ShieldAlert, HeartPulse, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Emergency() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="glass-button icon-only secondary">
          <ChevronLeft size={24} />
        </button>
        <h1 className="page-title" style={{ margin: 0 }}>เบอร์ติดต่อฉุกเฉิน</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <a href="tel:191" className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '50%' }}>
            <ShieldAlert size={32} color="#3b82f6" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>เหตุด่วนเหตุร้าย (ตำรวจ)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3b82f6' }}>191</div>
          </div>
        </a>

        <a href="tel:1669" className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '50%' }}>
            <HeartPulse size={32} color="#10b981" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>หน่วยแพทย์ฉุกเฉิน</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>1669</div>
          </div>
        </a>

        <a href="tel:199" className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '50%' }}>
            <Flame size={32} color="#ef4444" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>ดับเพลิง</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>199</div>
          </div>
        </a>

        <a href="tel:021234567" className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '16px', borderRadius: '50%' }}>
            <Phone size={32} color="#8b5cf6" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>ป้อมยามหน้าหมู่บ้าน</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#8b5cf6' }}>02-123-4567</div>
          </div>
        </a>
      </div>
    </div>
  );
}
