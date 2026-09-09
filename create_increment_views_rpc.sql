-- ============================================================================
-- RPC OPCIONAL: increment_prospect_views
-- Si deseas tener la función RPC en Supabase para incrementar visitas
-- ============================================================================

CREATE OR REPLACE FUNCTION public.increment_prospect_views(site_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.prospect_sites
  SET views_count = COALESCE(views_count, 0) + 1,
      updated_at = NOW()
  WHERE id = site_id;
END;
$$;

-- Otorgar permisos de ejecución para usuarios anónimos y autenticados
GRANT EXECUTE ON FUNCTION public.increment_prospect_views(UUID) TO anon, authenticated, service_role;

-- Recargar caché de PostgREST
NOTIFY pgrst, 'reload schema';
