import React, { useState } from 'react';
import axios from "../config";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export default function ItemForecastByMonth() {
  const [month, setMonth] = useState('');       // למשל "05" עבור מאי
  const [data, setData]   = useState([]);       // עכשיו תמיד מערך
  const [err, setErr]     = useState('');

  const fetchData = async () => {
    if (!month) return;
    try {
      const res = await axios.get(`/api/consumption-last-year?month=${month}`);
      setData(res.data);
      setErr('');
    } catch (e) {
      setErr('שגיאה בטעינת נתונים');
      setData([]);
    }
  };

  return (
    <div className="p-6" dir="rtl">
      <h2 className="text-xl font-bold mb-4">צריכה לפי מוצר – חודש בשנה שעברה</h2>

      {/* 1. בוחרים חודש */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="number"
          min="1"
          max="12"
          placeholder="הכנס חודש (1–12)"
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          הצג
        </button>
      </div>

      {/* 2. שגיאה */}
      {err && <p className="text-red-600 mb-2">{err}</p>}

      {/* 3. גרף עמודות */}
      {data.length > 0 && (
        <div className="h-80 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="consumed" fill="#4f46e5" name="כמות נצרכה" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 4. טבלה כגיבוי */}
      {data.length > 0 ? (
        <table className="w-full text-right border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">שם מוצר</th>
              <th className="border px-2 py-1">כמות נצרכה</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.name}>
                <td className="border px-2 py-1">{item.name}</td>
                <td className="border px-2 py-1">{item.consumed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !err && <p className="text-gray-500">אין נתונים להצגה</p>
      )}
    </div>
  );
}
