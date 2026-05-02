import { ChevronLeft, MessageCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ContactJuristic() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate(-1)} className="glass-button icon-only secondary">
          <ChevronLeft size={24} />
        </button>
        <h1 className="page-title" style={{ margin: 0 }}>ติดต่อนิติบุคคล</h1>
      </div>

      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
          <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.8)', padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px', maxWidth: '80%' }}>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>สวัสดีครับ นิติบุคคลหมู่บ้านซื่อตรง 3 ยินดีให้บริการครับ มีอะไรให้ช่วยเหลือไหมครับ?</p>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>10:00 น.</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <input type="text" className="glass-input" placeholder="พิมพ์ข้อความ..." style={{ flex: 1 }} />
          <button className="glass-button primary icon-only">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
