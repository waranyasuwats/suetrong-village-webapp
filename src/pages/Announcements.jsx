import { useState } from 'react';
import { Megaphone, Calendar } from 'lucide-react';

export default function Announcements({ user }) {
  const [announcements] = useState([
    {
      id: 1,
      title: 'ประชุมลูกบ้านประจำปี 2569',
      date: '2026-05-10',
      content: 'ขอเชิญลูกบ้านทุกท่านเข้าร่วมประชุมประจำปีเพื่อรับฟังรายงานผลการดำเนินงานและลงมติเลือกตั้งคณะกรรมการนิติบุคคลชุดใหม่ ณ สโมสรหมู่บ้าน เวลา 09:00 - 12:00 น.',
      priority: 'high'
    },
    {
      id: 2,
      title: 'งดจ่ายน้ำชั่วคราวซอย 5',
      date: '2026-05-05',
      content: 'การประปาจะทำการซ่อมบำรุงท่อเมนหลักที่แตกบริเวณต้นซอย 5 ทำให้ต้องงดจ่ายน้ำชั่วคราวในวันที่ 5 พ.ค. เวลา 10:00 - 14:00 น. ขออภัยในความไม่สะดวก',
      priority: 'medium'
    }
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="page-title" style={{ marginBottom: 0 }}>ประกาศจากนิติบุคคล</h1>
        {user.role === 'admin' && (
          <button className="glass-button" style={{ width: 'auto' }}>
            + สร้างประกาศใหม่
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {announcements.map((item) => (
          <div key={item.id} className="glass-card">
            <div className="flex items-center gap-3 mb-4">
              <Megaphone size={28} color={item.priority === 'high' ? '#ef4444' : '#f59e0b'} />
              <h2 className="card-title" style={{ margin: 0 }}>{item.title}</h2>
              {item.priority === 'high' && <span className="tag danger ml-auto">สำคัญมาก</span>}
            </div>
            
            <p className="mb-4 text-muted" style={{ lineHeight: 1.6 }}>
              {item.content}
            </p>
            
            <div className="flex items-center gap-2 text-sm text-muted">
              <Calendar size={18} color="#3b82f6" />
              <span style={{ fontWeight: 600 }}>ประกาศเมื่อ: {item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
