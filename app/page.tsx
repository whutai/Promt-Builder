import Link from "next/link";

export default function Home() {
  const menu = [
    {
      name: "Quản lý Sản phẩm",
      path: "/products",
      desc: "Thêm, sửa và cập nhật thông tin sản phẩm",
      color: "border-blue-500 hover:bg-blue-50"
    },
    {
      name: "Quản lý Mẫu Prompt",
      path: "/prompts",
      desc: "Cấu hình vai trò và cấu trúc nội dung",
      color: "border-indigo-500 hover:bg-indigo-50"
    },
    {
      name: "Tạo Kịch bản mới",
      path: "/generators",
      desc: "Kết hợp sản phẩm và mẫu để tạo nội dung",
      color: "border-emerald-500 hover:bg-emerald-50"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-2">
            Chọn chức năng để bắt đầu làm việc
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col p-6 bg-white border-l-4 rounded-xl shadow-sm transition-all hover:shadow-md ${item.color}`}
            >
              <h2 className="text-lg font-bold text-slate-800 mb-2">
                {item.name}
              </h2>
              <p className="text-sm text-slate-500 flex-1">{item.desc}</p>
              <span className="mt-4 text-indigo-600 font-bold text-sm">
                Truy cập →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
