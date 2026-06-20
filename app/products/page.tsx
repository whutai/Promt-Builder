"use client";
import { useState, useEffect } from "react";
import { productService } from "../services/productService";
import { resizeAndCompress } from "../utils/imageUtils";
import Link from "next/link";

const InputField = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
      {label}
    </label>
    <input
      {...props}
      className="border border-gray-200 bg-gray-50 p-2.5 rounded-xl text-sm focus:border-indigo-500 focus:bg-white outline-none transition-all"
    />
  </div>
);

const TextAreaField = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
      {label}
    </label>
    <textarea
      {...props}
      className="border border-gray-200 bg-gray-50 p-2.5 rounded-xl text-sm focus:border-indigo-500 focus:bg-white outline-none transition-all"
    />
  </div>
);

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    target: "",
    pain_point: "",
    styling: "",
    variants: ""
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await productService.getAll();
    if (data) setProducts(data);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await resizeAndCompress(file);
      setForm((prev) => ({ ...prev, image: base64 }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ép kiểu price sang số để tránh lỗi type error
    const formattedForm = {
      ...form,
      price: String(form.price)
    };

    if (editingId) {
      await productService.update(editingId, formattedForm);
    } else {
      await productService.create(formattedForm);
    }
    resetForm();
    loadProducts();
  };

  const handleDuplicate = (product: any) => {
    const { id, ...dataToCopy } = product;
    setForm({
      ...dataToCopy,
      name: `${dataToCopy.name} (Bản sao)`,
      price: String(dataToCopy.price)
    });
    setEditingId(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      description: "",
      price: "",
      image: "",
      target: "",
      pain_point: "",
      styling: "",
      variants: ""
    });
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-screen flex flex-col p-6 bg-slate-50 text-slate-900 overflow-hidden">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-bold mb-4 transition-colors group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">
          ←
        </span>{" "}
        Quay về trang chủ
      </Link>

      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">
          Quản lý Sản phẩm
        </h1>
      </header>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-y-auto">
          <h2 className="text-lg font-bold mb-6 text-slate-700">
            {editingId ? "Cập nhật sản phẩm" : "Thêm mới sản phẩm"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <InputField
                label="Tên sản phẩm"
                value={form.name}
                onChange={(e: any) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <TextAreaField
                label="Giá"
                rows={1}
                value={form.price}
                onChange={(e: any) =>
                  setForm({ ...form, price: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                Ảnh đại diện
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm border border-gray-200 p-2 rounded-xl w-full"
              />
            </div>
            <div className="col-span-2">
              <TextAreaField
                label="Đối tượng mục tiêu"
                rows={1}
                value={form.target}
                onChange={(e: any) =>
                  setForm({ ...form, target: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <TextAreaField
                label="Nỗi đau khách hàng"
                rows={1}
                value={form.pain_point}
                onChange={(e: any) =>
                  setForm({ ...form, pain_point: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <TextAreaField
                label="Gợi ý phối đồ"
                rows={1}
                value={form.styling}
                onChange={(e: any) =>
                  setForm({ ...form, styling: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <TextAreaField
                label="Các biến thể"
                rows={1}
                value={form.variants}
                onChange={(e: any) =>
                  setForm({ ...form, variants: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <TextAreaField
                label="Mô tả chi tiết"
                rows={2}
                value={form.description}
                onChange={(e: any) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <button className="col-span-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg">
              {editingId ? "Cập nhật thông tin" : "Lưu sản phẩm mới"}
            </button>
          </form>
        </div>

        <div className="col-span-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full p-2.5 text-sm border rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {filteredProducts.map((p, index) => (
              <div
                key={p.id}
                className="p-3 mb-2 bg-slate-50 rounded-xl flex items-center gap-4"
              >
                <div className="w-8 h-8 flex items-center justify-center font-bold text-slate-400 bg-white rounded-lg text-xs shadow-sm">
                  {index + 1}
                </div>
                <img
                  src={p.image}
                  className="w-12 h-12 rounded-lg object-cover shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 text-sm truncate">
                    {p.name}
                  </div>
                  <div className="text-indigo-600 text-xs font-semibold">
                    {Number(p.price).toLocaleString()}đ
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleDuplicate(p)}
                    className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg text-[10px] font-bold uppercase hover:bg-emerald-600 hover:text-white transition"
                  >
                    Nhân bản
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(p.id);
                      setForm(p);
                    }}
                    className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-[10px] font-bold uppercase hover:bg-indigo-600 hover:text-white transition"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() =>
                      productService.delete(p.id).then(loadProducts)
                    }
                    className="text-red-600 bg-red-50 px-3 py-1 rounded-lg text-[10px] font-bold uppercase hover:bg-red-600 hover:text-white transition"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
