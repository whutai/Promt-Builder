import { supabase } from "../lib/supabase";

export const promptsService = {
  async getAll() {
    return await supabase
      .from("promts")
      .select("*")
      .order("id", { ascending: false });
  },

  async create(promts: {
    title: string;
    system_role: string;
    requirements: number;
    structure: string;
  }) {
    return await supabase.from("promts").insert([promts]).select();
  },

  async update(id: number, updates: any) {
    return await supabase.from("promts").update(updates).eq("id", id);
  },

  async delete(id: number) {
    return await supabase.from("promts").delete().eq("id", id);
  },

  async update(id: number, updates: any) {
    return await supabase.from("promts").update(updates).eq("id", id);
  }
};
