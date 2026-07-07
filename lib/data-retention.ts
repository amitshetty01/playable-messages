import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase";

type RetentionPolicy = {
  maxAgeDays: number;
  action: 'delete' | 'anonymize';
};

const POLICIES: Record<string, RetentionPolicy> = {
  default: { maxAgeDays: 90, action: 'delete' },
  unclaimed: { maxAgeDays: 30, action: 'delete' },
  claimed: { maxAgeDays: 365, action: 'anonymize' },
};

export async function cleanupExpiredExperiences(): Promise<{ deleted: number; anonymized: number }> {
  if (!isSupabaseConfigured()) return { deleted: 0, anonymized: 0 };
  const supabase = getSupabaseServerClient();
  const now = new Date().toISOString();
  let deleted = 0;
  let anonymized = 0;

  // Delete unclaimed experiences older than 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: oldUnclaimed, error: unclaimedError } = await supabase
    .from('generated_experiences')
    .delete()
    .lt('created_at', thirtyDaysAgo)
    .is('reaction', null) // unclaimed = no reaction
    .select('id');
  if (!unclaimedError && oldUnclaimed) deleted += oldUnclaimed.length;

  // Anonymize experiences older than 365 days
  const yearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
  const { data: oldClaimed, error: claimedError } = await supabase
    .from('generated_experiences')
    .update({
      creator_name: 'Deleted User',
      receiver_name: 'Deleted User',
      final_message: '[This message has been archived per our data retention policy]',
      custom_messages: {},
      images: [],
    })
    .lt('created_at', yearAgo)
    .not('reaction', 'is', null)
    .select('id');
  if (!claimedError && oldClaimed) anonymized += oldClaimed.length;

  return { deleted, anonymized };
}
