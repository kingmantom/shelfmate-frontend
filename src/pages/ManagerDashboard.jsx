// src/pages/ManagerDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config";

export default function ManagerDashboard() {
  const navigate = useNavigate();

  const dashboardItems = [
    {
      title: "גרף צריכה",
      description: "גרף צריכה ובזבוזים מעודכן לשנה אחורה",
      path: "/forcast",                // Forcast.jsx
    },
    {
      title: "גרף חיזוי",
      description: "בחר בין תחזית עונתית להיסטוריית צריכה",
      path: "/forecast-selector",     // ForecastSelector.jsx
    },
    {
      title: "מצב מלאי נוכחי",
      description: "טבלת מלאי נוכחית עם יכולת הוספה והורדה של מוצרים",
      path: "/inventory",              // Inventory.jsx
    },
  ];

  // פונקציה ששולחת את רשימת המוצרים במלאי נמוך למייל
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
        email: "tomwas2000@gmail.com",
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

      <div className="flex justify-center mb-8">
        <button
          onClick={handleSendLowStock}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition"
        >
          שלח רשימת חוסרים
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
