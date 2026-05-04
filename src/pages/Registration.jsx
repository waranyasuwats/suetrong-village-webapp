import { useState, useEffect } from 'react';
import { UserPlus, Search, Edit2, Trash2, Home, Phone, Mail, KeyRound, X, Check, Loader2, Clock, CreditCard, MessageCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { createClient } from '@supabase/supabase-js';

// Separate client for Auth to prevent Admin session from being overwritten
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseAuthClient = (supabaseUrl && supabaseAnonKey)
  ? createClient(
      supabaseUrl,
      supabaseAnonKey,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )
  : null;

export default function Registration() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    house_number: '',
    full_name: '',
    phone_number: '',
    id_card_number: '',
    line_id: '',
    email: '',
    password: '',
    pdpa_consented: false
  });

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'resident')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setResidents(data || []);
    } catch (error) {
      console.error('Error fetching residents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const generatePassword = () => {
    const randomPass = Math.random().toString(36).slice(-8);
    setFormData({ ...formData, password: randomPass });
  };

  const handleEditClick = (resident) => {
    setFormData({
      house_number: resident.house_number || '',
      full_name: resident.full_name || '',
      phone_number: resident.phone_number || '',
      id_card_number: resident.id_card_number || '',
      line_id: resident.line_id || '',
      pdpa_consented: resident.pdpa_consented || false,
      email: '', // ไม่สามารถแก้ไขอีเมลได้จากหน้านี้
      password: '' 
    });
    setEditingId(resident.id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ house_number: '', full_name: '', phone_number: '', id_card_number: '', line_id: '', email: '', password: '', pdpa_consented: false });
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลลูกบ้านท่านนี้? (จะเป็นการลบข้อมูลโปรไฟล์เท่านั้น ไม่ได้ลบอีเมลสำหรับล็อกอิน)')) {
      try {
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) throw error;
        alert('ลบข้อมูลสำเร็จ!');
        fetchResidents();
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการลบ: ' + error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.house_number || !formData.full_name) {
      alert('กรุณากรอกข้อมูลบ้านเลขที่และชื่อให้ครบถ้วน');
      return;
    }

    if (!formData.pdpa_consented) {
      alert('กรุณากดยอมรับเงื่อนไข PDPA ก่อนดำเนินการ');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        // ==== โหมดแก้ไขข้อมูล ====
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            house_number: formData.house_number,
            full_name: formData.full_name,
            phone_number: formData.phone_number,
            id_card_number: formData.id_card_number,
            line_id: formData.line_id,
            pdpa_consented: formData.pdpa_consented
          })
          .eq('id', editingId);

        if (updateError) throw updateError;
        alert('อัปเดตข้อมูลสำเร็จ!');

      } else {
        // ==== โหมดเพิ่มข้อมูลใหม่ ====
        if (!formData.email || !formData.password) {
           alert('กรุณากรอกอีเมลและรหัสผ่านสำหรับลูกบ้านใหม่');
           setIsSubmitting(false);
           return;
        }

        const { data: authData, error: authError } = await supabaseAuthClient.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        const userId = authData.user?.id;
        if (!userId) {
           throw new Error('ไม่สามารถสร้างบัญชีได้ อาจมีอีเมลนี้ในระบบแล้ว');
        }

        const { error: profileError } = await supabaseAuthClient
          .from('profiles')
          .insert([
            {
              id: userId,
              role: 'resident',
              house_number: formData.house_number,
              full_name: formData.full_name,
              phone_number: formData.phone_number,
              id_card_number: formData.id_card_number,
              line_id: formData.line_id,
              pdpa_consented: formData.pdpa_consented
            }
          ]);

        if (profileError) throw profileError;
        alert('ลงทะเบียนลูกบ้านใหม่สำเร็จ!\n\nกรุณาส่ง "อีเมล" และ "รหัสผ่านชั่วคราว" นี้ให้ลูกบ้านเพื่อเข้าใช้งานครับ');
      }

      handleCancelForm();
      fetchResidents();

    } catch (error) {
      console.error('Submit Error:', error);
      alert('เกิดข้อผิดพลาด: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredResidents = residents.filter(r => 
    (r.house_number && r.house_number.includes(searchTerm)) || 
    (r.full_name && r.full_name.includes(searchTerm))
  );

  return (
    <div style={{ paddingBottom: '80px' }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title" style={{ margin: 0 }}>จัดการทะเบียนลูกบ้าน</h1>
        <button 
          className="glass-button primary" 
          onClick={() => {
            if (showAddForm) handleCancelForm();
            else setShowAddForm(true);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          disabled={isSubmitting}
        >
          {showAddForm ? <X size={20} /> : <UserPlus size={20} />}
          {showAddForm ? 'ยกเลิก' : 'เพิ่มลูกบ้าน'}
        </button>
      </div>

      {showAddForm && (
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', animation: 'fadeIn 0.3s ease-out' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem', color: 'var(--primary)' }}>
            {editingId ? 'แก้ไขข้อมูลลูกบ้าน' : 'แบบฟอร์มลงทะเบียนลูกบ้านใหม่'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>บ้านเลขที่ *</label>
                <div style={{ position: 'relative' }}>
                  <Home size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" name="house_number" value={formData.house_number} onChange={handleInputChange} className="glass-input" placeholder="เช่น 78/123" style={{ width: '100%', paddingLeft: '40px' }} required />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>ชื่อ-นามสกุล (ตามบัตรประชาชน) *</label>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} className="glass-input" placeholder="ชื่อ นามสกุล" style={{ width: '100%' }} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>เลขบัตรประจำตัวประชาชน 13 หลัก</label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" name="id_card_number" value={formData.id_card_number} onChange={handleInputChange} className="glass-input" placeholder="สำหรับออกใบเสร็จ (เว้นว่างได้)" maxLength="13" style={{ width: '100%', paddingLeft: '40px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>เบอร์โทรศัพท์</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="glass-input" placeholder="08X-XXX-XXXX" style={{ width: '100%', paddingLeft: '40px' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Line ID</label>
                <div style={{ position: 'relative' }}>
                  <MessageCircle size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="text" name="line_id" value={formData.line_id} onChange={handleInputChange} className="glass-input" placeholder="Line ID (เว้นว่างได้)" style={{ width: '100%', paddingLeft: '40px' }} />
                </div>
              </div>

              {!editingId && (
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>อีเมล (สำหรับใช้ Login) *</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="glass-input" placeholder="example@email.com" style={{ width: '100%', paddingLeft: '40px' }} required />
                  </div>
                </div>
              )}
            </div>

            {!editingId && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>รหัสผ่านชั่วคราว (ให้ลูกบ้านไปเปลี่ยนทีหลัง) *</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <KeyRound size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="text" name="password" value={formData.password} onChange={handleInputChange} className="glass-input" placeholder="กำหนดรหัสผ่าน 6 ตัวขึ้นไป" style={{ width: '100%', paddingLeft: '40px' }} required />
                  </div>
                  <button type="button" onClick={generatePassword} className="glass-button secondary" style={{ whiteSpace: 'nowrap' }}>
                    สุ่มรหัสผ่าน
                  </button>
                </div>
              </div>
            )}

            {/* PDPA Consent Box */}
            <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)', marginTop: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  name="pdpa_consented" 
                  checked={formData.pdpa_consented} 
                  onChange={handleInputChange} 
                  style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: 'var(--primary)' }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>
                    <ShieldCheck size={18} /> นโยบายความเป็นส่วนตัว (PDPA) *
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    ข้าพเจ้ายินยอมให้นิติบุคคลหมู่บ้านซื่อตรง บางใหญ่ 3 เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลที่ให้ไว้ รวมถึงเลขประจำตัวประชาชน เพื่อวัตถุประสงค์ในการยืนยันตัวตน การออกใบเสร็จรับเงิน และการติดต่อสื่อสาร ตามพ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
                  </div>
                </div>
              </label>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={handleCancelForm} className="glass-button secondary">ยกเลิก</button>
              <button type="submit" className="glass-button primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 size={20} className="spin" /> : <Check size={20} />} 
                {isSubmitting ? 'กำลังบันทึก...' : (editingId ? 'บันทึกการแก้ไข' : 'ยืนยันการลงทะเบียน')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          className="glass-input" 
          placeholder="ค้นหาด้วยบ้านเลขที่ หรือ ชื่อลูกบ้าน..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', paddingLeft: '48px', paddingRight: '16px' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>กำลังโหลดข้อมูลลูกบ้าน...</div>
        ) : filteredResidents.length > 0 ? (
          filteredResidents.map((resident) => (
            <div key={resident.id} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '16px', borderRadius: '16px', textAlign: 'center', minWidth: '80px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>บ้านเลขที่</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{resident.house_number || '-'}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>{resident.full_name || 'ไม่ระบุชื่อ'}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '4px' }}>
                    {resident.phone_number && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {resident.phone_number}</div>}
                    {resident.line_id && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageCircle size={12} /> Line: {resident.line_id}</div>}
                    {resident.id_card_number && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CreditCard size={12} /> ID: {resident.id_card_number.slice(0, 3)}XXXXXX{resident.id_card_number.slice(-4)}</div>}
                  </div>
                  {resident.created_at && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> ลงทะเบียนเมื่อ: {new Date(resident.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEditClick(resident)} className="glass-button secondary icon-only" style={{ padding: '8px' }} title="แก้ไข">
                    <Edit2 size={16} color="var(--primary)" />
                  </button>
                  <button onClick={() => handleDeleteClick(resident.id)} className="glass-button secondary icon-only" style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)' }} title="ลบข้อมูล">
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            ยังไม่มีข้อมูลลูกบ้านในระบบ
          </div>
        )}
      </div>
    </div>
  );
}
