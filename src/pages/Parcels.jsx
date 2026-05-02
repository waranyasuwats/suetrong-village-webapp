import { ChevronLeft, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Parcels() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="glass-button icon-only secondary">
          <ChevronLeft size={24} />
        </button>
        <h1 className="page-title" style={{ margin: 0 }}>พัสดุของคุณ</h1>
      </div>
      
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', marginBottom: '16px' }}>
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '50%' }}>
          <Package size={28} color="#3b82f6" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>หมายเลข: TH123456789</div>
          <div className="text-muted" style={{ fontSize: '0.85rem' }}>Shopee Express</div>
        </div>
        <span className="tag success">รอรับที่นิติฯ</span>
      </div>

      <div style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-muted)' }}>
        <p>คุณไม่มีพัสดุที่ค้างรับเพิ่มเติมในขณะนี้</p>
      </div>
    </div>
  );
}
