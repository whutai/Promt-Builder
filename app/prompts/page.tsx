"use client";
import { useState, useEffect } from "react";
import { promptsService } from "../services/promptsService";
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

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewData, setPreviewData] = useState<any | null>(null);

  const [form, setForm] = useState({
    title: "",
    system_role: "",
    requirements: "",
    structure: ""
  });

  // Hàm đếm số kịch bản dựa trên dấu |
  const getAngleCount = (text: string) =>
    text.split("|").filter((t) => t.trim() !== "").length;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await promptsService.getAll();
    if (data) setPrompts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await promptsService.update(editingId, form);
    } else {
      await promptsService.create(form);
    }
    resetForm();
    loadProducts();
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: "", system_role: "", requirements: "", structure: "" });
  };

  const filteredPrompts = prompts.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
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
          Quản lý Template Prompt
        </h1>
      </header>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-y-auto">
          <h2 className="text-lg font-bold mb-6 text-slate-700">
            {editingId ? "Cập nhật" : "Thêm mới"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <InputField
                label="Tên Template"
                value={form.title}
                onChange={(e: any) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <TextAreaField
                label="VAI TRÒ CHUNG"
                rows={1}
                value={form.system_role}
                onChange={(e: any) =>
                  setForm({ ...form, system_role: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <TextAreaField
                label="CẤU TRÚC"
                rows={6}
                value={form.structure}
                onChange={(e: any) =>
                  setForm({ ...form, structure: e.target.value })
                }
              />
            </div>

            <div className="col-span-2">
              <TextAreaField
                label="DANH SÁCH KỊCH BẢN (Ngăn cách bằng dấu -)"
                rows={6}
                value={form.requirements}
                onChange={(e: any) =>
                  setForm({ ...form, requirements: e.target.value })
                }
              />
              <div className="mt-2 flex justify-between items-center text-[11px] font-bold">
                <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                  Đã phát hiện {getAngleCount(form.requirements)} kịch bản
                </span>
                <span className="text-gray-400 italic">
                  Ví dụ: Đánh vào nỗi đau|Tính năng|Đa năng
                </span>
              </div>
            </div>

            <button className="col-span-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
              {editingId ? "Cập nhật" : "Lưu Template"}
            </button>
          </form>
        </div>

        <div className="col-span-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <div className="font-bold text-slate-700 mb-3">
              Danh sách Template
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full p-2.5 text-sm border border-slate-200 rounded-xl outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {filteredPrompts.map((p, index) => (
              <div
                key={p.id}
                className="p-3 mb-2 bg-slate-50 rounded-xl flex items-center gap-4 border hover:border-indigo-200 transition"
              >
                <div className="w-8 h-8 flex items-center justify-center font-bold text-slate-400 bg-white rounded-lg text-xs shadow-sm">
                  {index + 1}
                </div>
                <div className="flex-1 font-bold text-slate-800 text-sm truncate">
                  {p.title}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPreviewData(p)}
                    className="text-slate-600 bg-slate-200 px-3 py-1 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-300 transition"
                  >
                    Xem
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
                      promptsService.delete(p.id).then(loadProducts)
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

      {previewData && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
          onClick={() => setPreviewData(null)}
        >
          <div
            className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-lg mb-4">{previewData.title}</h2>
            <div className="text-sm text-slate-600 space-y-3 whitespace-pre-line max-h-96 overflow-y-auto pr-2">
              <p>
                <strong>Vai trò:</strong> {previewData.system_role}
              </p>
              <p>
                <strong>Cấu trúc:</strong> {previewData.structure}
              </p>
              <p>
                <strong>Kịch bản:</strong>{" "}
                {previewData.requirements.split("|").join(", ")}
              </p>
            </div>
            <button
              onClick={() => setPreviewData(null)}
              className="mt-6 w-full bg-slate-800 text-white py-2 rounded-xl text-sm font-bold"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
