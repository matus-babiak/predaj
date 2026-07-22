// Diakritiku-necitlivé vyhľadávanie naprieč appkou: námietky, myšlienky, produkty.

export function normalizeSearch(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

export interface SearchResult {
  type: "namietka" | "vlastna-namietka" | "myslienka" | "vlastna-myslienka" | "produkt";
  id: string;
  title: string;
  subtitle?: string;
  href: string;
}

export const SEARCH_TYPE_LABEL: Record<SearchResult["type"], string> = {
  namietka: "Námietka",
  "vlastna-namietka": "Vlastná námietka",
  myslienka: "Myšlienka",
  "vlastna-myslienka": "Moja myšlienka",
  produkt: "Produkt",
};
