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

export default function SeasonalForecast() {
  const [month, setMonth] = useState('');
  const [data, setData]   = useState([]);
  const [err, setErr]     = useState('');

  const fetchData = async () => {
    console.log("🔎 month value:", month); // הוסף בשורה הראשונה של fetchData

    if (!month) return;
    try {
      const res = await axios.get(`/api/forecast-seasonal?month=${month}`);
      setData(res.data);
      setErr('');
    } catch (e) {
      setErr('שגיאה בטעינת נתונים');
      setData([]);
    }
  };

  return (
    <div className="p-6" dir="rtl">
      <h2 className="text-xl font-bold mb-4">תחזית צריכה לפי חודש</h2>

      {/* בחירת חודש */}
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
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          חזה
        </button>
      </div>

      {/* שגיאה */}
      {err && <p className="text-red-600 mb-2">{err}</p>}

      {/* גרף תחזית */}
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
              <Bar dataKey="avg_consumed" fill="#9333ea" name="תחזית צריכה" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* טבלה */}
      {data.length > 0 ? (
        <table className="w-full text-right border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">שם מוצר</th>
              <th className="border px-2 py-1">תחזית צריכה</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.name}>
                <td className="border px-2 py-1">{item.name}</td>
                <td className="border px-2 py-1">{item.avg_consumed}</td>
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
