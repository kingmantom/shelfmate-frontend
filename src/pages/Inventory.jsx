// src/pages/Inventory.jsx
"use client";

import { useState, useEffect } from "react";
import { PlusCircle, ScanLine, Trash2 } from "lucide-react";
import axios from "../config";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    barcode: "",
    quantity: "",
    expiry_date: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    axios
      .get("/api/inventory")
      .then(({ data }) => setProducts(data))
      .catch(() => setErr("שגיאה בטעינת מלאי"))
      .finally(() => setIsLoading(false));
  }, []);

  // אתחול הסורק
  useEffect(() => {
    if (!isScanning) return;
    const scanner = new Html5QrcodeScanner("scanner", { fps: 10, qrbox: 250 });
    scanner.render(
      async (decoded) => {
        await scanner.clear();
        setIsScanning(false);
        try {
          const res = await axios.get(
            `https://world.openfoodfacts.org/api/v0/product/${decoded}.json`
          );
          if (res.data.status === 1) {
            const prod = res.data.product;
            setNewProduct((p) => ({
              ...p,
              name: prod.product_name_he || prod.product_name || "",
              barcode: decoded,
            }));
            alert("המוצר זוהה והוזן אוטומטית");
          } else {
            setNewProduct((p) => ({ ...p, name: "", barcode: decoded }));
            alert("המוצר לא נמצא במאגר");
          }
        } catch {
          alert("שגיאה בהבאת מוצר");
        }
      },
      (err) => {
        console.warn(err);
        setIsScanning(false);
      }
    );
  }, [isScanning]);

  const handleScanProduct = () => setIsScanning(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((p) => ({ ...p, [name]: value }));
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.barcode) return;
    try {
      const payload = {
        ...newProduct,
        quantity: Number(newProduct.quantity) || 1,
        threshold: 5,
        created_at: new Date().toISOString().slice(0, 10),
      };
      const { data } = await axios.post("/api/inventory", payload);
      setProducts((p) => [...p, { id: data.id, ...payload }]);
      setNewProduct({ name: "", barcode: "", quantity: "", expiry_date: "" });
      setErr("");
    } catch {
      setErr("שגיאה בהוספת מוצר");
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`/api/inventory/${id}`);
      setProducts((p) => p.filter((item) => item.id !== id));
    } catch {
      setErr("שגיאת מחיקה");
    }
  };

  const updateThreshold = async (id, old) => {
    const input = prompt(`סף חדש (נוכחי: ${old})`);
    const nw = Number(input);
    if (isNaN(nw)) return alert("ערך לא תקין");
    try {
      await axios.put(`/api/inventory/${id}`, { threshold: nw });
      setProducts((p) => p.map(item => item.id===id ? {...item, threshold: nw} : item));
    } catch {
      setErr("שגיאה בעדכון סף");
    }
  };

  const isExpired = (expiry) => {
    if (!expiry) return false;
    const days = Math.ceil(
      (new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return days <= 3;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center mb-6">ניהול מלאי</h1>

          {/* טופס הוספה */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <input
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              placeholder="שם מוצר"
              className="border rounded p-2"
            />
            <input
              name="barcode"
              value={newProduct.barcode}
              onChange={handleInputChange}
              placeholder="ברקוד"
              className="border rounded p-2"
            />
            <input
              name="quantity"
              type="number"
              value={newProduct.quantity}
              onChange={handleInputChange}
              placeholder="כמות"
              className="border rounded p-2"
            />
            <input
              name="expiry_date"
              type="date"
              value={newProduct.expiry_date}
              onChange={handleInputChange}
              className="border rounded p-2"
            />
          </div>

          <div className="flex gap-4 mb-8 justify-center">
            <button
              onClick={handleAddProduct}
              disabled={!newProduct.name || !newProduct.barcode}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              <PlusCircle className="inline-block mr-1" /> הוסף מוצר
            </button>
            <button
              onClick={handleScanProduct}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              <ScanLine className="inline-block mr-1" /> סריקת מוצר
            </button>
          </div>

          {isScanning && (
            <div id="scanner" className="mb-6 mx-auto" style={{ width: 300 }} />
          )}

          {err && <p className="text-red-600 mb-2">{err}</p>}
          {isLoading && <p>טוען...</p>}

          {/* הטבלה */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-right">פעולה</th>
                  <th className="p-2 text-right">שם מוצר</th>
                  <th className="p-2 text-right">ברקוד</th>
                  <th className="p-2 text-right">כמות</th>
                  <th className="p-2 text-right">סף התראה</th>
                  <th className="p-2 text-right">תוקף</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && !isLoading && (
                  <tr><td colSpan={6} className="p-4 text-center">אין מוצרים</td></tr>
                )}
                {products.map((p, i) => (
                  <tr
                    key={p.id}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
                  >
                    <td className="p-2 text-right">
                      <button
                        onClick={() => removeItem(p.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="inline-block mr-1"/> הסר
                      </button>
                    </td>
                    <td className="p-2 text-right">{p.name}</td>
                    <td className="p-2 text-right">{p.barcode}</td>
                    <td className="p-2 text-right">{p.quantity}</td>
                    <td className="p-2 text-right">
                      {p.threshold}{' '}
                      <button
                        onClick={() => updateThreshold(p.id, p.threshold)}
                        className="text-blue-600 text-sm"
                      >
                        שנה
                      </button>
                    </td>
                    <td
                      className={`p-2 text-right ${
                        isExpired(p.expiry_date) ? 'text-red-600 font-bold' : ''
                      }`}
                    >
                      {p.expiry_date || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
