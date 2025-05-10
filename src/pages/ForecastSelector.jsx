import React, { useState } from "react";
import ItemForecastByMonth from "./ItemForecastByMonth";
import SeasonalForecast from "./SeasonalForecast";

export default function ForecastSelector() {
  const [view, setView] = useState(null);

  return (
    <div className="min-h-screen p-6 bg-gray-50" dir="rtl">
      <h1 className="text-2xl font-bold text-center mb-6">
        בחר סוג תחזית לצפייה
      </h1>

      {/* כפתורי בחירה */}
      <div className="flex justify-center gap-6 mb-8">
        <button
          onClick={() => setView("history")}
          className={`px-6 py-2 rounded-lg text-white transition ${
            view === "history" ? "bg-blue-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          היסטוריית צריכה בשנה שעברה
        </button>
        <button
          onClick={() => setView("seasonal")}
          className={`px-6 py-2 rounded-lg text-white transition ${
            view === "seasonal" ? "bg-purple-700" : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          תחזית צריכה עונתית
        </button>
      </div>

      {/* הצגת הרכיב המתאים */}
      {view === "history" && <ItemForecastByMonth />}
      {view === "seasonal" && <SeasonalForecast />}
      {!view && (
        <p className="text-center text-gray-500">
          אנא בחר את סוג התחזית שברצונך לצפות בה.
        </p>
      )}
    </div>
  );
}
