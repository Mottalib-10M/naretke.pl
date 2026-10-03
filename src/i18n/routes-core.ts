/** Fabrique des helpers de routage multi-locale à partir d'une table ROUTES. */
export interface RouteDef<L extends string> { id: string; paths: Record<L, string>; noindex?: boolean }
export function makeRouter<L extends string>(locales: readonly L[], routes: RouteDef<L>[]) {
  const NOINDEX_PATHS = routes.filter((r) => r.noindex).flatMap((r) => locales.map((l) => r.paths[l]));
  function route(id: string, lang: L): string { const r = routes.find((x) => x.id === id); if (!r) throw new Error(`Unknown route id: ${id}`); return r.paths[lang]; }
  function altPaths(pathname: string): Record<L, string> | null { const r = routes.find((x) => locales.some((l) => x.paths[l] === pathname)); return r ? r.paths : null; }
  return { NOINDEX_PATHS, route, altPaths };
}
