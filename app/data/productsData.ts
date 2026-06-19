export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  target?: string;
  painPoint?: string;
  styling?: string;
  variants?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Giày Sneaker Humi - Bản Kem",
    description:
      "Đế đúc 5cm siêu nhẹ, lót giày êm ái, màu kem pastel thanh lịch.",
    price: 550000,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=500&auto=format&fit=crop",
    target: "Học sinh, sinh viên, người đi làm",
    painPoint: "Muốn tăng chiều cao nhưng sợ bị thô, sợ đau chân",
    styling: "Quần jean, chân váy, đồ công sở",
    variants: "Size 35-39, 3 màu: Đen, Trắng, Kem"
  },
  {
    id: 2,
    name: "Giày Classic Pro - Trắng Da",
    description:
      "Chất liệu da tổng hợp cao cấp, dễ dàng vệ sinh, kiểu dáng cổ điển.",
    price: 450000,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop",
    target: "Học sinh, người năng động",
    painPoint: "Cần giày trắng bền, không lỗi mốt",
    styling: "Đồng phục, quần short, đồ thể thao",
    variants: "Size 36-42, màu Trắng"
  },
  {
    id: 3,
    name: "Giày High-Boost Urban",
    description: "Cấu trúc đế ẩn 5cm tinh tế, thoáng khí, ôm chân tối ưu.",
    price: 620000,
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500&auto=format&fit=crop",
    target: "Người có chiều cao khiêm tốn",
    painPoint: "Muốn tăng chiều cao mà giày nhìn không bị thô",
    styling: "Quần cargo, quần jogger, thời trang đường phố",
    variants: "Size 35-40, 2 màu: Xám, Đen"
  },
  {
    id: 4,
    name: "Giày Street Black - Vải Lưới",
    description: "Vải lưới thoáng khí, công nghệ thấm hút mồ hôi, cực kỳ nhẹ.",
    price: 490000,
    image:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=500&auto=format&fit=crop",
    target: "Người hay di chuyển, vận động nhiều",
    painPoint: "Sợ bí chân và có mùi hôi khi đi cả ngày",
    styling: "Đồ tập, quần legging, quần jean tối màu",
    variants: "Size 38-44, màu Đen"
  },
  {
    id: 5,
    name: "Giày Minimalist Grey",
    description:
      "Thiết kế tối giản, không chi tiết rườm rà, cực kỳ sang trọng.",
    price: 520000,
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=500&auto=format&fit=crop",
    target: "Người theo phong cách tối giản, công sở",
    painPoint: "Ghét logo to, muốn sự tinh tế",
    styling: "Quần âu, váy liền, đồ smart-casual",
    variants: "Size 36-43, màu Xám"
  }
];

export const addProductToArray = (product: Product) => {
  products.push(product);
};
export const deleteProduct = (id: number) => {
  const index = products.findIndex((p) => p.id === id);
  if (index > -1) products.splice(index, 1);
};
