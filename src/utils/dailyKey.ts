
//C:\repository\proj-full-stack-backend\src\utils\dailyKey.ts
// src/utils/dailyKey.ts

// Para teste: YYYYMMDD usando data do servidor
export function getDailySecularKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`; // ex: 20260220
}

/**
 * JWT secret diário.
 * Para teste, você pode retornar só a chave secular.
 * Melhor: combinar com um seed fixo (JWT_SEED) do .env, para não ficar fraco.
 */
export function getDailyJwtSecret(d: Date = new Date()): string {
  const daily = getDailySecularKey(d);

  // ✅ recomendado: manter um seed fixo no backend e “misturar” com a chave do dia
  const seed = process.env.JWT_SEED ?? "";

  // Para teste você pode usar só daily, mas isto é fraco:
  // return daily;

  // Melhor (ainda simples):
  return seed ? `${seed}::${daily}` : daily;
}