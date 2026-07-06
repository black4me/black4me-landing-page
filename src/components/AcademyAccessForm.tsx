"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, Lock } from "lucide-react";

import { verifyAcademyCode } from "@/server/actions/academy";

export default function AcademyAccessForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("الرجاء إدخال كود الدخول");
      return;
    }

    setIsLoading(true);

    const result = await verifyAcademyCode(code);
    
    if (result.success) {
      // Correct code: Redirect to the academy
      window.location.href = "https://marketing-academy-liard.vercel.app/";
    } else {
      // Incorrect code
      setError(result.message || "كود الدخول غير صحيح. يرجى التأكد والمحاولة مرة أخرى.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-1.5 text-right">
          كود الدخول
        </label>
        <div className="relative">
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            dir="ltr"
            placeholder="أدخل الكود هنا"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition text-center text-lg tracking-wider"
            autoComplete="off"
            spellCheck="false"
          />
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-400 text-right animate-in fade-in">
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-brand-gold text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            دخول للمنصة
            <ArrowLeft className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}
