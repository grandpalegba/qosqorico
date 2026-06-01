import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { DEMO_PROVIDERS, getDemoProviderById } from '@/lib/providers';

// ── Fetch a single provider by id (real or demo) ──────────────────────────
export function useProvider(id) {
  return useQuery({
    queryKey: ['provider', id],
    queryFn: async () => {
      // Check demo first (instant, no network call)
      const demo = getDemoProviderById(id);
      if (demo) return { ...demo, _source: 'demo' };

      const { data, error } = await supabase
        .from('providers')
        .select('*, reviews(*)')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return { ...data, _source: 'real' };
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

// ── Fetch providers for a given series (real + demo merged) ───────────────
export function useProvidersForSeries(seriesName) {
  return useQuery({
    queryKey: ['providers', 'series', seriesName],
    queryFn: async () => {
      const demos = DEMO_PROVIDERS.filter(p => p.series_name === seriesName);

      if (!seriesName) return demos;

      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('series_name', seriesName)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const real = (data || []).map(p => ({ ...p, _source: 'real' }));
      const demoMarked = demos.map(p => ({ ...p, _source: 'demo' }));

      // Real providers first, then demo ones
      return [...real, ...demoMarked];
    },
    enabled: !!seriesName,
    staleTime: 1000 * 60 * 2,
  });
}

// ── Fetch all real providers (for home page, map, etc.) ───────────────────
export function useAllProviders({ suyuId } = {}) {
  return useQuery({
    queryKey: ['providers', 'all', suyuId],
    queryFn: async () => {
      let query = supabase
        .from('providers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (suyuId) query = query.eq('suyu_id', suyuId);

      const { data, error } = await query;
      if (error) throw error;

      const real = (data || []).map(p => ({ ...p, _source: 'real' }));
      const demos = DEMO_PROVIDERS.map(p => ({ ...p, _source: 'demo' }));
      return [...real, ...demos];
    },
    staleTime: 1000 * 60 * 5,
  });
}

// ── Create a provider profile ─────────────────────────────────────────────
export function useCreateProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileData) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('providers')
        .insert([{ ...profileData, user_id: session.user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    },
  });
}

// ── Update a provider profile ─────────────────────────────────────────────
export function useUpdateProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('providers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['provider', data.id] });
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    },
  });
}

// ── Get the current user's own provider profile (if any) ──────────────────
export function useMyProviderProfile() {
  return useQuery({
    queryKey: ['providers', 'mine'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
