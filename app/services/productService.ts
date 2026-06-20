import { supabase } from "../lib/supabase";

export const productService = {
  async getAll() {
    return await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });
  },

  async create(product: {
    name: string;
    description: string;
    price: string;
    image?: string; // Sửa từ image thành image (khớp với page.tsx)
    target: string;
    pain_point: string;
    styling: string;
    variants: string;
  }) {
    return await supabase.from("products").insert([product]).select();
  },

  async update(id: number, updates: any) {
    return await supabase.from("products").update(updates).eq("id", id);
  },

  async delete(id: number) {
    return await supabase.from("products").delete().eq("id", id);
  }
};
