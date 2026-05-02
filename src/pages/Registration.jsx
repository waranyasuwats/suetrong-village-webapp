import { UserPlus, Search } from 'lucide-react';

export default function Registration({ user }) {
  if (user.role !== 'admin') return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="page-title" style={{ marginBottom: 0 }}>ลงทะเบียนลูกบ้าน</h1>
        <button className="glass-button" style={{ width: 'auto' }}>
          <UserPlus size={18} color="#ffffff" /> ลงทะเบียนใหม่
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div className="flex gap-4 mb-6">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={22} color="#8b5cf6" style={{ position: 'absolute', top: '13px', left: '16px' }} />
            <input
              type="text"
              placeholder="ค้นหาตามบ้านเลขที่ หรือ ชื่อลูกบ้าน"
              className="glass-input"
              style={{ paddingLeft: '48px', marginBottom: 0 }}
            />
          </div>
          <button className="glass-button secondary" style={{ width: 'auto' }}>ค้นหา</button>
        </div>

        <div className="glass-table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>บ้านเลขที่</th>
                <th>ชื่อ-นามสกุล</th>
                <th>เบอร์โทรศัพท์</th>
                <th>วันที่ลงทะเบียน</th>
                <th>สถานะใช้งาน</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>123/45</td>
                <td>นายสมชาย รักดี</td>
                <td>081-234-5678</td>
                <td>2024-01-15</td>
                <td><span className="tag success">ใช้งาน</span></td>
                <td><a href="#" className="text-primary" style={{ fontWeight: 600 }}>แก้ไข</a></td>
              </tr>
              <tr>
                <td>123/46</td>
                <td>นางสมหญิง ใจเย็น</td>
                <td>089-876-5432</td>
                <td>2024-02-20</td>
                <td><span className="tag success">ใช้งาน</span></td>
                <td><a href="#" className="text-primary" style={{ fontWeight: 600 }}>แก้ไข</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
