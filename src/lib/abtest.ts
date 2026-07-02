import { supabase } from "./supabase";

export function getABVariant(testName: string): "A" | "B" {
  if (typeof window === "undefined") return "A";
  const stored = localStorage.getItem(`ab_${testName}`);
  if (stored === "A" || stored === "B") return stored;
  const variant = Math.random() > 0.5 ? "A" : "B";
  localStorage.setItem(`ab_${testName}`, variant);
  return variant;
}

export async function trackABEvent(
  testName: string,
  variant: "A" | "B",
  eventType: "view" | "click" | "purchase"
) {
  const sessionId = localStorage.getItem("session_id") || crypto.randomUUID();
  localStorage.setItem("session_id", sessionId);

  await supabase.from("ab_events").insert({
    test_name: testName,
    variant,
    event_type: eventType,
    session_id: sessionId,
  });
}
