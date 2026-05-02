import { useState, useEffect } from 'react';
import { ChevronLeft, User, CreditCard, Receipt, Clock, CheckCircle, AlertCircle, FileText, Home, ShieldCheck, Mail, Phone, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Members({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
    
    if (user?.house_number) {
      fetchData();
    } else {
      // Mock data if user is not fully loaded or no house number
      loadMockData();
    }
  }, [user]);

  const loadMockData = () => {
    setMembers([
      { id: '1', full_name: user?.username || 'คุณสมชาย', role: 'resident', phone_number: '081-234-5678', line_id: 'somchai_123', email: 'somchai@example.com' }
    ]);
    setTransactions([
      { id: '1', type: 'income', amount: 500, status: 'approved', created_at: new Date(Date.now() - 86400000 * 5).toISOString(), description: 'ค่าส่วนกลางเดือนมีนาคม' },
      { id: '2', type: 'income', amount: 500, status: 'pending', created_at: new Date(Date.now() - 86400000).toISOString(), description: 'ค่าส่วนกลางเดือนเมษายน' }
    ]);
    setInvoices([
      { id: '1', invoice_number: 'INV-2024-05', amount: 500, description: 'ค่าส่วนกลางเดือนพฤษภาคม', due_date: new Date(Date.now() + 86400000 * 10).toISOString(), status: 'unpaid' }
    ]);
    setLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch house members
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .eq('house_number', user.house_number);
        
      // 2. Fetch transaction history (Payments)
      const { data: txData } = await supabase
        .from('transactions')
        .select('*')
        .eq('house_number', user.house_number)
        .order('created_at', { ascending: false });

      // 3. Fetch outstanding invoices
      const { data: invData } = await supabase
        .from('invoices')
        .select('*')
        .eq('house_number', user.house_number)
        .in('status', ['unpaid', 'pending_approval'])
        .order('due_date', { ascending: true });

      if (profilesData?.length > 0) setMembers(profilesData);
      else loadMockData(); // Fallback to mock if empty
      
      if (txData?.length > 0) setTransactions(txData);
      if (invData?.length > 0) setInvoices(invData);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      loadMockData(); // Fallback to mock on error
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Render Tabs
  const renderProfileTab = () => (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="glass-card" style={{ padding: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)' }}>
          <Home size={40} color="#ffffff" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
          บ้านเลขที่ {user?.house_number || 'ไม่ระบุ'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>หมู่บ้านซื่อตรง บางใหญ่ 3</p>
      </div>

      <h3 className="section-title" style={{ marginTop: '24px' }}>รายชื่อสมาชิกในบ้าน</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {members.map((member) => (
          <div key={member.id} className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '12px', borderRadius: '50%' }}>
              <User size={24} color="var(--primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>{member.full_name || 'ไม่ระบุชื่อ'}</div>
              {member.role === 'admin' && <span className="tag primary" style={{ marginBottom: '8px', display: 'inline-block' }}>นิติบุคคล</span>}
              {member.phone_number && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}><Phone size={14} /> {member.phone_number}</div>}
              {member.email && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {member.email}</div>}
            </div>
            {member.pdpa_consented && (
              <div title="ยินยอม PDPA แล้ว">
                <ShieldCheck size={20} color="#10b981" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaymentHistoryTab = () => (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <h3 className="section-title">ประวัติการชำระเงินทั้งหมด</h3>
      
      {transactions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {transactions.map((tx) => (
            <div key={tx.id} className="glass-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: tx.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', padding: '10px', borderRadius: '12px' }}>
                    <Receipt size={24} color={tx.status === 'approved' ? '#10b981' : '#f59e0b'} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{tx.description || 'ชำระค่าส่วนกลาง'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{formatDate(tx.created_at)}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>{formatCurrency(tx.amount)}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                  สถานะ: 
                  {tx.status === 'approved' ? (
                     <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}><CheckCircle size={14} /> สำเร็จ</span>
                  ) : tx.status === 'rejected' ? (
                     <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}><AlertCircle size={14} /> ถูกปฏิเสธ</span>
                  ) : (
                     <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}><Clock size={14} /> รอยืนยัน</span>
                  )}
                </div>
                {tx.status === 'approved' && (
                  <button className="glass-button secondary" style={{ width: 'max-content', padding: '4px 16px', fontSize: '0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={14} /> ดูใบเสร็จ
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Receipt size={40} style={{ opacity: 0.5, margin: '0 auto 16px' }} />
          <p>ยังไม่มีประวัติการชำระเงินในระบบ</p>
        </div>
      )}
    </div>
  );

  const renderOutstandingTab = () => {
    const totalOutstanding = invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
    
    return (
      <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <div className="glass-card" style={{ padding: '24px', marginBottom: '20px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(245, 158, 11, 0.1))', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>ยอดค้างชำระรวมทั้งหมด</span>
            <AlertCircle size={20} color="#ef4444" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ef4444' }}>
            {formatCurrency(totalOutstanding)}
          </div>
        </div>

        <h3 className="section-title">รายการที่ต้องชำระ</h3>
        
        {invoices.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {invoices.map((inv) => (
              <div key={inv.id} className="glass-card" style={{ padding: '16px', borderLeft: '4px solid #ef4444' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>{inv.description}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>เลขที่แจ้งหนี้: {inv.invoice_number || `INV-${inv.id}`}</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)' }}>
                    {formatCurrency(inv.amount)}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', marginTop: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#ef4444', fontWeight: 600 }}>
                    <Clock size={16} /> กำหนดชำระ: {formatDate(inv.due_date)}
                  </div>
                  <button className="glass-button primary" style={{ width: 'max-content', padding: '6px 20px', fontSize: '0.85rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CreditCard size={14} /> ชำระเงิน
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CheckCircle size={48} color="#10b981" style={{ marginBottom: '16px', opacity: 0.8 }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '8px' }}>ยอดเยี่ยมมาก!</h3>
            <p>คุณไม่มีรายการค้างชำระในระบบ</p>
          </div>
        )}
      </div>
    );
  };

  // Tab Button Style
  const getTabStyle = (isActive) => ({
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    whiteSpace: 'nowrap',
    padding: '12px 16px',
    borderRadius: '30px',
    fontWeight: 700,
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: isActive ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.8)',
    background: isActive 
      ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.85), rgba(139, 92, 246, 0.85))' 
      : 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    color: isActive ? '#ffffff' : 'var(--text-main)',
    boxShadow: isActive 
      ? '0 8px 24px rgba(79, 70, 229, 0.3), inset 0 2px 6px rgba(255, 255, 255, 0.3)' 
      : '0 4px 16px rgba(31, 38, 135, 0.05)',
    transform: isActive ? 'translateY(-2px)' : 'none'
  });

  return (
    <div style={{ paddingBottom: '80px' }}>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/')} className="glass-button icon-only">
          <ChevronLeft size={24} />
        </button>
        <h1 className="page-title" style={{ margin: 0 }}>ข้อมูลบ้านและสมาชิก</h1>
      </div>

      {/* Tabs Header */}
      <div style={{ display: 'flex', overflowX: 'auto', gap: '12px', marginBottom: '24px', paddingBottom: '8px', scrollbarWidth: 'none', paddingLeft: '4px', paddingRight: '4px' }}>
        <button 
          onClick={() => setActiveTab('profile')}
          style={getTabStyle(activeTab === 'profile')}
        >
          <User size={18} /> ข้อมูลบ้าน
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          style={getTabStyle(activeTab === 'history')}
        >
          <Receipt size={18} /> ประวัติชำระเงิน
        </button>
        <button 
          onClick={() => setActiveTab('outstanding')}
          style={getTabStyle(activeTab === 'outstanding')}
        >
          <AlertCircle size={18} /> ยอดค้างชำระ
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <Loader2 size={32} className="spin" color="var(--primary)" />
        </div>
      ) : (
        <>
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'history' && renderPaymentHistoryTab()}
          {activeTab === 'outstanding' && renderOutstandingTab()}
        </>
      )}
    </div>
  );
}
