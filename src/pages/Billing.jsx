import { useState } from 'react';
import { Upload, FileText } from 'lucide-react';

export default function Billing({ user }) {
  const [bills] = useState([
    { id: 'INV-2605-01', month: 'พฤษภาคม 2569', amount: 800, type: 'ค่าส่วนกลาง', status: 'unpaid', due_date: '2026-05-31' },
    { id: 'INV-2604-01', month: 'เมษายน 2569', amount: 800, type: 'ค่าส่วนกลาง', status: 'paid', due_date: '2026-04-30' },
  ]);

  return (
    <div>
      <h1 className="page-title">การแจ้งค่าบริการ</h1>
      
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 className="card-title mb-6">รายการแจ้งหนี้ / ค้างชำระ</h2>
        <div className="glass-table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>เลขที่เอกสาร</th>
                <th>รอบบิล</th>
                <th>ประเภท</th>
                <th>ยอดชำระ (บาท)</th>
                <th>วันครบกำหนด</th>
                <th>สถานะ</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(bill => (
                <tr key={bill.id}>
                  <td>{bill.id}</td>
                  <td>{bill.month}</td>
                  <td>{bill.type}</td>
                  <td>{bill.amount.toFixed(2)}</td>
                  <td>{bill.due_date}</td>
                  <td>
                    {bill.status === 'unpaid' 
                      ? <span className="tag warning">รอชำระเงิน</span>
                      : <span className="tag success">ชำระแล้ว</span>
                    }
                  </td>
                  <td>
                    {bill.status === 'unpaid' ? (
                      <button className="glass-button" style={{ padding: '6px 12px', fontSize: '0.875rem' }}>
                        <Upload size={18} color="#ffffff" /> แนบสลิป
                      </button>
                    ) : (
                      <button className="glass-button secondary" style={{ padding: '6px 12px', fontSize: '0.875rem' }}>
                        <FileText size={18} color="#3b82f6" /> ใบเสร็จรับเงิน
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
