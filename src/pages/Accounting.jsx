import { DollarSign, FileText } from 'lucide-react';

export default function Accounting({ user }) {
  if (user.role !== 'admin') return null;

  return (
    <div>
      <h1 className="page-title">ระบบบัญชี (สำนักงานบัญชี)</h1>
      
      <div className="grid-cards mb-8">
        <div className="glass-card" style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          <div className="card-title text-success">ยอดรับชำระเดือนนี้</div>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>฿ 145,000.00</p>
        </div>
        <div className="glass-card" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <div className="card-title text-danger">ยอดค้างชำระรวม</div>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger)' }}>฿ 32,500.00</p>
        </div>
        <div className="glass-card" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
          <div className="card-title text-primary">ค่าใช้จ่ายเดือนนี้</div>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>฿ 85,200.00</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="card-title" style={{ margin: 0 }}>ตั้งหนี้ / ตรวจสอบสลิป</h2>
          <div className="flex gap-4">
            <button className="glass-button secondary" style={{ width: 'auto' }}>
              <FileText size={18} color="#3b82f6" /> ลงบันทึกค่าใช้จ่าย
            </button>
            <button className="glass-button" style={{ width: 'auto' }}>
              <DollarSign size={18} color="#ffffff" /> ตั้งหนี้ค่าส่วนกลาง
            </button>
          </div>
        </div>

        <div className="glass-table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>วันที่ชำระ</th>
                <th>บ้านเลขที่</th>
                <th>รายการ</th>
                <th>ยอดเงิน</th>
                <th>หลักฐาน</th>
                <th>การอนุมัติ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2026-05-01 10:45</td>
                <td>123/45</td>
                <td>ค่าส่วนกลาง 05/26</td>
                <td>800.00</td>
                <td><a href="#" className="text-primary" style={{ fontWeight: 600 }}>ดูสลิป (SCB)</a></td>
                <td>
                  <button className="glass-button" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--success)' }}>
                    อนุมัติ / ออกใบเสร็จ
                  </button>
                </td>
              </tr>
              <tr>
                <td>2026-05-02 09:12</td>
                <td>123/88</td>
                <td>ค่าส่วนกลาง 05/26</td>
                <td>800.00</td>
                <td><a href="#" className="text-primary" style={{ fontWeight: 600 }}>ดูสลิป (KBANK)</a></td>
                <td>
                  <button className="glass-button" style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'var(--success)' }}>
                    อนุมัติ / ออกใบเสร็จ
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
