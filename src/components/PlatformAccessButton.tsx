"use client";
import { supabase } from "../lib/supabase";

export default function PlatformAccessButton() {

  async function handleAccess() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/checkout";
      return;
    }
    const { data } = await supabase
      .from("user_access")
      .select("file_url")
      .eq("customer_email", user.email)
      .single();

    window.location.href = data?.file_url ?? "/checkout";
  }

  return (
    <button
      onClick={handleAccess}
      className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition"
    >
      ادخل للمنصة ←
    </button>
  );
}
