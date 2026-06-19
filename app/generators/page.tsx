"use client";
import { useState, useEffect } from "react";
import { productService } from "../services/productService";
import { promptsService } from "../services/promptsService";
import Link from "next/link";

export default function GeneratorPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedAngles, setSelectedAngles] = useState<string[]>([]);
  const [finalPrompt, setFinalPrompt] = useState("");

  // Logic mới: Tách kịch bản từ cột requirements của template
  const availableAngles = selectedTemplate?.requirements
    ? selectedTemplate.requirements
        .split("-")
        .filter((a: string) => a.trim() !== "")
    : [];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: p } = await productService.getAll();
    const { data: t } = await promptsService.getAll();
    if (p) setProducts(p);
    if (t) setTemplates(t);
  };

  const handleGenerate = () => {
    if (!selectedProduct || !selectedTemplate || selectedAngles.length === 0) {
      alert("Vui lòng chọn đầy đủ sản phẩm, mẫu và ít nhất 1 kịch bản!");
      return;
    }

    const formattedAngles = selectedAngles
      .map((angle, index) => `Kịch bản ${index + 1}: ${angle}`)
      .join("\n");

    const prompt = `
VAI TRÒ CHUNG: 
${selectedTemplate.system_role}

CẤU TRÚC BẮT BUỘC: 
${selectedTemplate.structure}

THÔNG TIN SẢN PHẨM:
- Tên: ${selectedProduct.name}
- Đối tượng: ${selectedProduct.target}
- Nỗi đau: ${selectedProduct.pain_point}
- Nổi bật: ${selectedProduct.description}
- Phối đồ: ${selectedProduct.styling}
- Biến thể: ${selectedProduct.variants}
- Giá: ${selectedProduct.price}

YÊU CẦU CÁC GÓC TIẾP CẬN CẦN VIẾT:
Mỗi kịch bản đi thẳng vào vấn đề theo một góc nhìn khác nhau và biến tấu câu kêu gọi hành động (CTA) chứa size/màu ở cuối để không bị lặp từ:
${formattedAngles}

Định dạng đầu ra: Chỉ cung cấp phần lời thoại để lồng tiếng, không kèm mô tả cảnh quay. Sau mỗi kịch bản ghi chú số lượng từ.
`;
    setFinalPrompt(prompt.trim());
  };

  return (
    <div className="w-full h-screen flex flex-col p-6 bg-slate-50 text-slate-900">
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
          Tạo Kịch bản Video
        </h1>
      </header>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-4 bg-white p-6 rounded-2xl border border-slate-100 flex flex-col gap-6 overflow-y-auto">
          {/* Chọn Sản phẩm */}
          <select
            className="w-full p-3 border border-slate-200 rounded-xl"
            onChange={(e) =>
              setSelectedProduct(products.find((p) => p.id == e.target.value))
            }
          >
            <option value="">Chọn sản phẩm...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Chọn Mẫu Prompt */}
          <select
            className="w-full p-3 border border-slate-200 rounded-xl"
            onChange={(e) => {
              setSelectedTemplate(
                templates.find((t) => t.id == e.target.value)
              );
              setSelectedAngles([]); // Reset lại khi chọn mẫu mới
            }}
          >
            <option value="">Chọn mẫu Prompt...</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>

          {/* Render các kịch bản lấy từ Database */}
          {selectedTemplate && availableAngles.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase">
                Chọn kịch bản từ mẫu:
              </label>
              <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 space-y-2">
                {availableAngles.map((angle: string) => (
                  <label
                    key={angle}
                    className="flex items-center gap-2 text-sm text-black font-medium cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAngles.includes(angle)}
                      onChange={(e) => {
                        if (e.target.checked)
                          setSelectedAngles([...selectedAngles, angle]);
                        else
                          setSelectedAngles(
                            selectedAngles.filter((a) => a !== angle)
                          );
                      }}
                    />
                    {angle}
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
          >
            TẠO PROMPT
          </button>
        </div>

        {/* Khu vực hiển thị kết quả */}
        <div className="col-span-8 bg-white p-6 rounded-2xl border border-slate-100 flex flex-col">
          <textarea
            className="flex-1 w-full p-4 border border-slate-200 rounded-xl text-sm font-mono text-black"
            value={finalPrompt}
            readOnly
          />
          <button
            onClick={() => navigator.clipboard.writeText(finalPrompt)}
            className="mt-4 bg-slate-800 text-white py-2 rounded-xl text-sm font-bold hover:bg-black transition"
          >
            Copy Prompt
          </button>
        </div>
      </div>
    </div>
  );
}
