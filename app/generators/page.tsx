"use client";
import { useState, useEffect, useRef } from "react";
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
  const [isCopied, setIsCopied] = useState(false); // Thêm state để hiển thị trạng thái đã copy

  // State để điều khiển dropdown
  const [isProductOpen, setIsProductOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const availableAngles = selectedTemplate?.requirements
    ? selectedTemplate.requirements
        .split("-")
        .filter((a: string) => a.trim() !== "")
    : [];

  useEffect(() => {
    loadData();
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsProductOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadData = async () => {
    const { data: p } = await productService.getAll();
    const { data: t } = await promptsService.getAll();
    if (p) setProducts(p);
    if (t) setTemplates(t);
  };

  const handleCopy = () => {
    if (!finalPrompt) return;
    navigator.clipboard.writeText(finalPrompt).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset lại sau 2 giây
    });
  };

  const handleGenerate = () => {
    if (!selectedProduct || !selectedTemplate || selectedAngles.length === 0) {
      alert("Vui lòng chọn đầy đủ sản phẩm, mẫu và ít nhất 1 kịch bản!");
      return;
    }

    const formattedAngles = selectedAngles
      .map((angle, index) => `Kịch bản ${index + 1}: ${angle}`)
      .join("");

    const prompt = `VAI TRÒ CHUNG:\n ${selectedTemplate.system_role}\n
CẤU TRÚC:\n ${selectedTemplate.structure}\n
THÔNG TIN SẢN PHẨM:
- Tên: ${selectedProduct.name}
- Đối tượng: ${selectedProduct.target}
- Nỗi đau: ${selectedProduct.pain_point}
- Nổi bật: ${selectedProduct.description}
- Phối đồ: ${selectedProduct.styling}
- Biến thể: ${selectedProduct.variants}
- Giá: ${selectedProduct.price}
    \nYÊU CẦU BIẾN TẤU GÓC TIẾP CẬN VÀ CTA:
    Mỗi kịch bản đi thẳng vào vấn đề theo một góc nhìn khác nhau và biến tấu câu kêu gọi hành động (CTA) chứa size/màu ở cuối để không bị lặp từ:
    \n${formattedAngles}\n Định dạng đầu ra: Chỉ cung cấp phần lời thoại để lồng tiếng, không kèm mô tả cảnh quay. Sau mỗi kịch bản ghi chú số lượng từ.`;
    setFinalPrompt(prompt.trim());
  };

  return (
    <div className="w-full h-screen flex flex-col p-6 bg-slate-50 text-slate-900">
      <Link href="/" className="text-sm text-blue-600 font-bold mb-4">
        ← Quay về trang chủ
      </Link>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-4 bg-white p-6 rounded-2xl border flex flex-col gap-6 overflow-y-auto">
          {/* Custom Dropdown cho Sản phẩm */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProductOpen(!isProductOpen)}
              className="w-full p-3 border rounded-xl bg-white text-left flex justify-between items-center"
            >
              {selectedProduct ? (
                <div className="flex items-center gap-2">
                  <img
                    src={selectedProduct.image}
                    className="w-8 h-8 rounded object-cover"
                  />
                  <span className="text-sm font-bold">
                    {selectedProduct.name}
                  </span>
                </div>
              ) : (
                "Chọn sản phẩm..."
              )}
            </button>

            {isProductOpen && (
              <div className="absolute top-full left-0 w-full bg-white border rounded-xl shadow-lg mt-2 z-10 max-h-60 overflow-y-auto">
                {products.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p);
                      setIsProductOpen(false);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer border-b"
                  >
                    <img
                      src={p.image}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <span className="text-sm">{p.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <select
            className="w-full p-3 border rounded-xl"
            onChange={(e) =>
              setSelectedTemplate(templates.find((t) => t.id == e.target.value))
            }
          >
            <option value="">Chọn mẫu Prompt...</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>

          {selectedTemplate && (
            <div className="p-3 border rounded-xl bg-slate-50 space-y-2">
              {availableAngles.map((angle: string) => (
                <label
                  key={angle}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedAngles.includes(angle)}
                    onChange={(e) =>
                      e.target.checked
                        ? setSelectedAngles([...selectedAngles, angle])
                        : setSelectedAngles(
                            selectedAngles.filter((a) => a !== angle)
                          )
                    }
                  />
                  {angle}
                </label>
              ))}
            </div>
          )}

          <button
            onClick={handleGenerate}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold"
          >
            TẠO PROMPT
          </button>
        </div>

        <div className="col-span-8 bg-white p-6 rounded-2xl border flex flex-col gap-3">
          <textarea
            className="flex-1 w-full p-4 border rounded-xl font-mono text-sm"
            value={finalPrompt}
            readOnly
          />
          <button
            onClick={handleCopy}
            className={`w-full py-2 rounded-xl text-sm font-bold transition ${
              isCopied
                ? "bg-green-600 text-white"
                : "bg-slate-800 text-white hover:bg-black"
            }`}
          >
            {isCopied ? "Đã sao chép!" : "Copy Prompt"}
          </button>
        </div>
      </div>
    </div>
  );
}
