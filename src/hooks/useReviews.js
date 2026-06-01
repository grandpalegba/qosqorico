import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

// ── Fetch all reviews for a provider, with computed averages ──────────────
export function useProviderReviews(providerId) {
  return useQuery({
    queryKey: ['reviews', providerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const reviews = data || [];

      if (reviews.length === 0) {
        return { reviews: [], averages: null, count: 0 };
      }

      const avg = (key) =>
        Math.round(reviews.reduce((sum, r) => sum + (r[key] || 0), 0) / reviews.length);

      return {
        reviews,
        count: reviews.length,
        averages: {
          authenticity: avg('authenticity'),
          originality: avg('originality'),
          impact: avg('impact'),
        },
      };
    },
    enabled: !!providerId,
    staleTime: 1000 * 60 * 2,
  });
}

// ── Check if the current user already left a review ───────────────────────
export function useMyReview(providerId) {
  return useQuery({
    queryKey: ['reviews', providerId, 'mine'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('provider_id', providerId)
        .eq('reviewer_id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!providerId,
  });
}

// ── Submit a new review ───────────────────────────────────────────────────
export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ providerId, authenticity, originality, impact, comment }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Vous devez être connecté pour laisser un avis.');

      const { data, error } = await supabase
        .from('reviews')
        .upsert([{
          provider_id: providerId,
          reviewer_id: session.user.id,
          authenticity,
          originality,
          impact,
          comment,
        }], { onConflict: 'provider_id,reviewer_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.providerId] });
      queryClient.invalidateQueries({ queryKey: ['provider', variables.providerId] });
    },
  });
}
