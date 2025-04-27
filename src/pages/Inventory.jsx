// src/pages/Inventory.jsx
"use client"

import { useState, useEffect } from "react"
import { PlusCircle, ScanLine, Trash2 } from "lucide-react"
import axios from "axios"

export default function InventoryPage() {
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState({
    name: "",
    barcode: "",
    quantity: "",
    desired_quantity: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [err, setErr] = useState("")

  useEffect(() => {
    axios.get("/api/inventory")
      .then(({ data }) => setProducts(data))
      .catch(() => setErr("שגיאה בטעינת מלאי"))
      .finally(() => setIsLoading(false))
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewProduct(prev => ({ ...prev, [name]: value }))
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.barcode) return

    try {
      const payload = {
        name:             newProduct.name,
        barcode:          newProduct.barcode,
        quantity:         Number(newProduct.quantity),
        desired_quantity: Number(newProduct.desired_quantity),
        created_at:       new Date().toISOString().slice(0,10)
      }
      const { data } = await axios.post("/api/inventory", payload)
      setProducts(prev => [...prev, { id: data.id, threshold: 5, ...payload }])
      setNewProduct({ name: "", barcode: "", quantity: "", desired_quantity: "" })
      setErr("")
    } catch {
      setErr("שגיאה בהוספת מוצר")
    }
  }

  const handleScanProduct = () => {
    alert("סריקת מוצר צפויה בקרוב…")
  }

  const removeItem = async (id) => {
    try {
      await axios.delete(`/api/inventory/${id}`)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch {
      setErr("שגיאת מחיקה")
    }
  }

  // ✏️ פונקציה לעדכון סף התראה
  const updateThreshold = async (id, oldThreshold) => {
    const input = prompt(`הכנס סף התראה חדש (נוכחי: ${oldThreshold})`)
    const newThreshold = Number(input)
    if (isNaN(newThreshold)) return alert('ערך לא תקין')
    try {
      await axios.put(`/api/inventory/${id}`, { threshold: newThreshold })
      setProducts(prev =>
        prev.map(p => p.id === id ? { ...p, threshold: newThreshold } : p)
      )
    } catch {
      setErr("שגיאה בעדכון סף")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">ניהול מלאי</h1>

          {/* טופס הוספה */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <input
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              placeholder="שם המוצר"
              className="h-12 px-4 rounded-lg border focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="barcode"
              value={newProduct.barcode}
              onChange={handleInputChange}
              placeholder="ברקוד"
              className="h-12 px-4 rounded-lg border focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="quantity"
              type="number"
              value={newProduct.quantity}
              onChange={handleInputChange}
              placeholder="כמות"
              className="h-12 px-4 rounded-lg border focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="desired_quantity"
              type="number"
              value={newProduct.desired_quantity}
              onChange={handleInputChange}
              placeholder="כמות רצויה"
              className="h-12 px-4 rounded-lg border focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-3 mb-8 justify-center sm:justify-start">
            <button
              onClick={handleAddProduct}
              disabled={!newProduct.name || !newProduct.barcode}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg"
            >
              <PlusCircle className="h-5 w-5" />
              הוסף מוצר
            </button>
            <button
              onClick={handleScanProduct}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
            >
              <ScanLine className="h-5 w-5" />
              סריקת מוצר
            </button>
          </div>

          {/* הודעות טעינה/שגיאה */}
          {err && <p className="text-red-600 mb-2">{err}</p>}
          {isLoading && <p className="text-gray-500 mb-2">טוען...</p>}

          {/* טבלה */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">פעולה</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">שם המוצר</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">ברקוד</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">כמות</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">כמות רצויה</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">סף התראה</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading
                  ? <tr><td colSpan={6} className="py-4 text-center">טוען...</td></tr>
                  : products.length === 0
                    ? <tr><td colSpan={6} className="py-4 text-center">אין מוצרים במלאי</td></tr>
                    : products.map((p, i) => (
                        <tr key={p.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2 text-right">
                            <button onClick={() => removeItem(p.id)} className="flex items-center gap-1 text-red-600">
                              <Trash2 className="h-4 w-4" /><span>הסר</span>
                            </button>
                          </td>
                          <td className="px-4 py-2 text-right">{p.name}</td>
                          <td className="px-4 py-2 text-right">{p.barcode}</td>
                          <td className="px-4 py-2 text-right">{p.quantity}</td>
                          <td className="px-4 py-2 text-right">{p.desired_quantity}</td>
                          <td className="px-4 py-2 text-right flex items-center gap-2">
                            <span>{p.threshold}</span>
                            <button
                              onClick={() => updateThreshold(p.id, p.threshold)}
                              className="text-blue-600 hover:underline text-sm"
                            >
                              שנה
                            </button>
                          </td>
                        </tr>
                      ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
