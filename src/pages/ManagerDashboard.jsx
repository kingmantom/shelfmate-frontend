// src/pages/ManagerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config";
import { useAuth } from "../AuthContext"; // הוסף למעלה

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [lowStockCount, setLowStockCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);
  const [inventoryCount, setInventoryCount] = useState(0);
  const { user } = useAuth(); // הוסף בתוך הפונקציה הראשית

  useEffect(() => {
    // קבלת מספר פריטים במלאי כולל
    axios.get("/api/stats").then(({ data }) => setInventoryCount(data.inventory_rows));

    // קבלת רשימת חוסרים ופריטים שפג תוקפם
    axios.get("/api/low-stock").then(({ data }) => {
      setLowStockCount(data.filter(item => item.quantity < item.threshold).length);
      setExpiredCount(data.filter(item => item.expiry_date && item.expiry_date <= new Date().toISOString().slice(0, 10)).length);
    });
  }, []);

  const dashboardItems = [
    {
      title: "גרף צריכה",
      description: "גרף צריכה ובזבוזים מעודכן לשנה אחורה",
      path: "/forcast",
    },
    {
      title: "גרף חיזוי",
      description: "בחר בין תחזית עונתית להיסטוריית צריכה",
      path: "/forecast-selector",
    },
    {
      title: "מצב מלאי נוכחי",
      description: "טבלת מלאי נוכחית עם יכולת הוספה והורדה של מוצרים",
      path: "/inventory",
    },
  ];

  const handleSendLowStock = async () => {
    try {
      const { data: lowStockItems } = await axios.get("/api/low-stock");
      if (lowStockItems.length === 0) {
        return alert("אין מוצרים במלאי נמוך כרגע");
      }

      let htmlContent = "<h2>רשימת מוצרים במלאי נמוך</h2><ul>";
      lowStockItems.forEach((item) => {
        htmlContent += `<li><strong>${item.name}</strong> (כמות: ${item.quantity} / סף: ${item.threshold})</li>`;
      });
      htmlContent += "</ul>";

      await axios.post("/api/send-alert", {
        email: user?.email || "tomwas2000@gmail.com",  // זה ייקח את המייל של המשתמש
        subject: "🚨 התראה: מלאי נמוך ב-ShelfMate",
        html: htmlContent,
      });
      

      alert("המייל נשלח בהצלחה!");
    } catch (err) {
      console.error(err);
      alert("שגיאה בשליחת המייל");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-transparent">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📋 ShelfMate Admin Dashboard
      </h1>

      {/* סטטיסטיקות */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-center">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-blue-600">{inventoryCount}</div>
          <div className="text-gray-700">סה"כ מוצרים</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-yellow-600">{lowStockCount}</div>
          <div className="text-gray-700">מלאי נמוך</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-red-600">{expiredCount}</div>
          <div className="text-gray-700">מוצרים שפג תוקפם</div>
        </div>
      </div>

      <div className="flex justify-center mb-8 gap-4">
        <button
          onClick={handleSendLowStock}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition"
        >
          שלח רשימת חוסרים
        </button>

        <button
  onClick={() =>
    window.open("https://shelfmate-server.onrender.com/api/export-inventory", "_blank")
  }
  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
>
  ייצוא מלאי לאקסל
</button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardItems.map((item) => (
          <div
            key={item.title}
            onClick={() => navigate(item.path)}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg cursor-pointer transition"
          >
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
