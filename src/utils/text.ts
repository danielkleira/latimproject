import type { TokenItem } from "../types";

const STOPWORDS = new Set(["et", "in", "de", "ad", "non", "ut", "cum"]);

export const normalize = (str: string): string =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const tokenize = (text: string): string[] =>
  text.match(/\w+|[^\s\w]+/g) || [];

export function hideWords(tokens: string[], percentage: number): TokenItem[] {
  const candidates = tokens
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => /\w+/.test(t) && !STOPWORDS.has(normalize(t)));

  const toHide = Math.max(1, Math.floor(candidates.length * percentage));
  const indexes = new Set<number>();

  while (indexes.size < toHide && indexes.size < candidates.length) {
    const rand = candidates[Math.floor(Math.random() * candidates.length)].i;
    indexes.add(rand);
  }

  return tokens.map((token, i) => ({
    token,
    hidden: indexes.has(i),
  }));
}
