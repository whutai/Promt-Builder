export interface PromptTemplate {
  id: number;
  title: string;
  systemRole: string;
  requirements: string;
  structure: string[]; // Chuyển từ string thành mảng các góc tiếp cận/kịch bản
}

export let promptTemplates: PromptTemplate[] = [
  {
    id: 1,
    title: "Mẫu TikTok Giày/Dép - Kho kịch bản đa dạng",
    systemRole:
      "Hãy đóng vai là một TikTok Creator chuyên làm video ngắn có tỷ lệ chuyển đổi cao.",
    requirements:
      "- Tất cả kịch bản ĐỀU PHẢI ĐI THẲNG VÀO VẤN ĐỀ (Direct Hook) ngay từ giây đầu tiên.\n- Sử dụng hoàn toàn là VĂN NÓI, khẩu ngữ hằng ngày.\n- Viết câu ngắn, có nhịp điệu để giọng AI ElevenLabs ngắt nghỉ hợp lý.\n- Viết rõ các con số thành chữ (ví dụ: size ba mươi lăm đến ba mươi chín).",
    structure: [
      "Kịch bản 1: Đánh vào nỗi đau lớn nhất (đau chân, hỏng phom).",
      "Kịch bản 2: Đánh thẳng vào giải pháp/tính năng tốt nhất (đế đúc siêu nhẹ).",
      "Kịch bản 3: Đánh vào tính đa năng/tiết kiệm (đi làm, đi chơi đều đẹp).",
      "Kịch bản 4: Cảnh báo/Sự thật về sản phẩm để tạo lòng tin.",
      "Kịch bản 5: Góc tiếp cận đập hộp (Unboxing) trực quan cảm xúc.",
      "Kịch bản 6: So sánh sản phẩm với các loại phân khúc giá rẻ ngoài thị trường.",
      "Kịch bản 7: Đánh vào yếu tố xu hướng (Trend) và tính thời trang.",
      "Kịch bản 8: Đánh vào chương trình ưu đãi, số lượng có hạn (Tạo độ khan hiếm)."
    ]
  }
];

export const addPromptTemplate = (template: PromptTemplate) => {
  promptTemplates = [...promptTemplates, template];
};

export const updatePromptTemplate = (
  id: number,
  updated: Partial<PromptTemplate>
) => {
  promptTemplates = promptTemplates.map((t) =>
    t.id === id ? { ...t, ...updated } : t
  );
};

export const deletePromptTemplate = (id: number) => {
  promptTemplates = promptTemplates.filter((t) => t.id !== id);
};
