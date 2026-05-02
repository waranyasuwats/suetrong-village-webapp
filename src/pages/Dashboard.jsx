import { useState, useEffect } from 'react';
import { User, Package, Wrench, CreditCard, Receipt, Globe, Dumbbell, CalendarDays, MessageCircle, Phone, Contact, ClipboardList, FileText, Users, ChevronRight, Sun, Moon, CloudSun, Sunset, Home, Cloud, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreetingData = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return { type: 'morning', text: 'สวัสดีตอนเช้า', icon: <CloudSun size={28} color="#ffffff" />, bg: 'linear-gradient(135deg, #38bdf8, #0ea5e9)' };
    if (hour >= 12 && hour < 17) return { type: 'afternoon', text: 'สวัสดีตอนบ่าย', icon: <Sun size={28} color="#ffffff" />, bg: 'linear-gradient(135deg, #0284c7, #0369a1)' };
    if (hour >= 17 && hour < 20) return { type: 'evening', text: 'สวัสดีตอนเย็น', icon: <Sunset size={28} color="#ffffff" />, bg: 'linear-gradient(135deg, #f59e0b, #ea580c)' };
    return { type: 'night', text: 'ราตรีสวัสดิ์', icon: <Moon size={28} color="#fef08a" />, bg: 'linear-gradient(135deg, #1e1b4b, #0f172a)' };
  };

  const greeting = getGreetingData();
  
  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('th-TH', options);
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  };

  // Mocking the username to display beautifully
  const displayName = user.username.replace('คุณลูกบ้าน บ้านเลขที่ 123/45', 'คุณสมชาย (ลูกบ้าน)').replace('นิติบุคคล', 'คุณแอดมิน (นิติฯ)');

  return (
    <div>
      {/* Top Section */}
      <div className="top-dashboard-grid">
        <div className="profile-card" style={{ gridColumn: '1 / 3', background: greeting.bg, flexDirection: 'column', alignItems: 'stretch', position: 'relative', overflow: 'hidden' }}>
          
          {/* --- Decorative Floating Icons --- */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0, opacity: 0.15, pointerEvents: 'none' }}>
             {greeting.type === 'morning' && (
                <>
                  <Sun size={140} style={{ position: 'absolute', top: '-30px', right: '-20px' }} />
                  <Cloud size={80} style={{ position: 'absolute', top: '50px', right: '80px', opacity: 0.8 }} />
                  <Cloud size={60} style={{ position: 'absolute', bottom: '-10px', left: '20px', opacity: 0.6 }} />
                </>
             )}
             {greeting.type === 'afternoon' && (
                <>
                  <Sun size={180} style={{ position: 'absolute', top: '-40px', right: '-40px' }} />
                  <Cloud size={50} style={{ position: 'absolute', bottom: '10px', left: '40px', opacity: 0.5 }} />
                </>
             )}
             {greeting.type === 'evening' && (
                <>
                  <Sunset size={160} style={{ position: 'absolute', bottom: '-40px', right: '-20px' }} />
                  <Cloud size={70} style={{ position: 'absolute', top: '10px', left: '30px', opacity: 0.5 }} />
                  <Star size={24} style={{ position: 'absolute', top: '20px', right: '120px', opacity: 0.8 }} />
                </>
             )}
             {greeting.type === 'night' && (
                <>
                  <Moon size={140} style={{ position: 'absolute', top: '-20px', right: '-20px', transform: 'rotate(-15deg)' }} />
                  <Star size={30} style={{ position: 'absolute', top: '40px', left: '60px', opacity: 0.8 }} />
                  <Star size={20} style={{ position: 'absolute', bottom: '20px', right: '100px', opacity: 0.6 }} />
                  <Star size={16} style={{ position: 'absolute', top: '80px', left: '30px', opacity: 0.4 }} />
                </>
             )}
          </div>
          {/* ------------------------------- */}

          {/* Top Row: Greeting & Time */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '16px', zIndex: 1, position: 'relative' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {greeting.icon}
               </div>
               <div>
                 <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{greeting.text}</div>
                 <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '2px' }}>{formatDate(currentTime)}</div>
               </div>
             </div>
             <div style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
               {formatTime(currentTime)}
             </div>
          </div>

          {/* Bottom Row: User Info */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', zIndex: 1, position: 'relative' }}>
            <div className="profile-avatar" style={{ width: '56px', height: '56px' }}>
              <User size={32} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', lineHeight: '1.2', fontWeight: 700, marginBottom: '8px' }}>{displayName}</h2>
              {user.house_number && (
                 <div style={{ fontSize: '0.9rem', fontWeight: 700, background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '16px', display: 'inline-block', marginBottom: '6px' }}>
                   🏠 บ้านเลขที่ {user.house_number}
                 </div>
              )}
              <div style={{ margin: 0, opacity: 0.9, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Home size={14} color="#ffffff" /> หมู่บ้านซื่อตรง บางใหญ่ 3
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Parcel & Repair */}
      <div className="finance-grid">
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', cursor: 'pointer' }} onClick={() => navigate('/parcels')}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '12px' }}>
            <Package size={28} color="#3b82f6" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>พัสดุ</div>
            <div className="text-muted" style={{ fontSize: '0.85rem' }}><span style={{ fontWeight: 700, color: 'var(--text-main)' }}>0</span> รายการ</div>
          </div>
        </div>
        
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px' }}>
            <Wrench size={28} color="#10b981" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>แจ้งซ่อม</div>
            <div className="text-muted" style={{ fontSize: '0.85rem' }}><span style={{ fontWeight: 700, color: 'var(--text-main)' }}>0</span> รายการ</div>
          </div>
        </div>
      </div>

      {/* Finance Cards */}
      <div className="finance-grid">
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', cursor: 'pointer' }} onClick={() => navigate('/billing')}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '12px' }}>
            <CreditCard size={28} color="#ef4444" />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>ยอดที่ต้องชำระ</div>
            <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-main)' }}>฿ 60.00</div>
          </div>
        </div>
        
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', cursor: 'pointer' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '12px' }}>
            <Receipt size={28} color="#3b82f6" />
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>ใบเสร็จ</div>
        </div>
      </div>

      {/* Main Banner */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', cursor: 'pointer' }}>
        <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '12px', borderRadius: '50%' }}>
          <Globe size={28} color="#8b5cf6" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>ประชุมใหญ่</div>
          <div className="text-muted" style={{ fontSize: '0.85rem' }}>การประชุมประจำปี</div>
        </div>
        <ChevronRight size={24} color="var(--text-muted)" />
      </div>

      {/* Quick Menu Grid */}
      <div className="quick-menu-grid">
        <Link to="/contact" className="menu-item">
          <div className="menu-icon-wrapper">
            <MessageCircle size={28} color="#10b981" />
          </div>
          <span className="menu-item-text">ติดต่อนิติ</span>
        </Link>
        <Link to="/emergency" className="menu-item">
          <div className="menu-icon-wrapper">
            <Phone size={28} color="#ef4444" />
          </div>
          <span className="menu-item-text">ติดต่อฉุกเฉิน</span>
        </Link>
        
        <Link to="/visitors" className="menu-item">
          <div className="menu-icon-wrapper">
            <Contact size={28} color="#8b5cf6" />
          </div>
          <span className="menu-item-text">ผู้มาติดต่อ</span>
        </Link>
        <Link to="/reports" className="menu-item">
          <div className="menu-icon-wrapper">
            <ClipboardList size={28} color="#f59e0b" />
          </div>
          <span className="menu-item-text">รายงานทั่วไป</span>
        </Link>
        <Link to="/surveys" className="menu-item">
          <div className="menu-icon-wrapper">
            <FileText size={28} color="#ec4899" />
          </div>
          <span className="menu-item-text">แบบสำรวจ</span>
        </Link>
        <Link to="/members" className="menu-item">
          <div className="menu-icon-wrapper">
            <Users size={28} color="#6366f1" />
          </div>
          <span className="menu-item-text">สมาชิก</span>
        </Link>
      </div>

      {/* Announcements */}
      <div className="section-title">
        <div style={{ width: '6px', height: '24px', background: 'var(--primary)', borderRadius: '4px' }}></div>
        ประกาศข่าวสาร <span className="tag danger" style={{ padding: '2px 8px', marginLeft: '8px' }}>9</span>
        <ChevronRight size={20} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
      </div>
      
      <div className="horizontal-scroll">
        <div className="glass-card" style={{ minWidth: '300px', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px', background: 'rgba(79, 70, 229, 0.1)' }}>
            <h3 style={{ fontSize: '1rem', color: '#dc2626', marginBottom: '8px' }}>📢 Announcement: Invoice for April</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
              Dear Residents, As we approach the end of the month, please kindly check your expenses and outstanding balances...
            </p>
          </div>
        </div>
        <div className="glass-card" style={{ minWidth: '300px', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px', background: 'rgba(245, 158, 11, 0.1)' }}>
            <h3 style={{ fontSize: '1rem', color: '#d97706', marginBottom: '8px' }}>🚧 แจ้งซ่อมบำรุงไฟทางเดิน</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
              ขออภัยในความไม่สะดวก จะมีการปิดไฟทางเดินซอย 2-4 เพื่อเปลี่ยนหลอดไฟใหม่ในวันพรุ่งนี้...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
