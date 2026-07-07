export const EVENT_CREATE_STARTED = "create_started";
export const EVENT_CREATE_COMPLETED = "create_completed";
export const EVENT_TEMPLATE_SELECTED = "template_selected";
export const EVENT_SHARE_LINK_COPIED = "share_link_copied";
export const EVENT_EXPERIENCE_OPENED = "experience_opened";
export const EVENT_EXPERIENCE_COMPLETED = "experience_completed";
export const EVENT_REACTION_SENT = "reaction_sent";
export const EVENT_REPLY_SENT = "reply_sent";

export function trackCustomEvent(
  name: string,
  data?: Record<string, string | number | boolean>
) {
  try {
    if (typeof window !== "undefined" && (window as any).va) {
      (window as any).va.track(name, data);
    }
    if (process.env.NODE_ENV === "development") {
      console.log(`[Analytics] ${name}`, data);
    }
  } catch { /* analytics unavailable */ }
}
