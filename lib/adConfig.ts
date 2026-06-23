// Add country codes (ISO 3166-1 alpha-2) where Adsterra
// serves aggressive redirect/popunder ads instead of banner/native.
// Test by connecting via VPN from different countries and noting
// which ones misbehave, then add them here.
export const BLOCKED_COUNTRIES: string[] = [
  "TH", // Thailand (confirmed by you)
];
