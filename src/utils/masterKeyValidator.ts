
//C:\repository\proj-full-stack-backend\src\utils\masterKeyValidator.ts
// src/utils/masterKeyValidator.ts

export function getYYYYMMDD(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`; // ex: 20260220
}

export function isDigits(s: string): boolean {
  return /^\d+$/.test(s);
}

export function isDigitsLen(s: string, len: number): boolean {
  return new RegExp(`^\\d{${len}}$`).test(s);
}

/**
 * PIN do dia conforme sua regra:
 * YYYYMMDD -> [YY, YY, MM, DD] (pares)
 * soma dígitos de cada par: "20" -> 2, "26" -> 8, "02" -> 2, "20" -> 2 => "2822"
 */
export function pinFromSecular(secularYYYYMMDD: string): string {
  const pairs = secularYYYYMMDD.match(/.{1,2}/g);
  if (!pairs || pairs.length !== 4) return "";

  const pinDigits = pairs.map((p) => {
    const a = Number(p[0]);
    const b = Number(p[1]);
    if (Number.isNaN(a) || Number.isNaN(b)) return "0";
    return String(a + b);
  });

  return pinDigits.join(""); // ex: "2822"
}

/**
 * Valida entrada do master:
 * - 8 dígitos: deve ser YYYYMMDD de hoje (servidor)
 * - 4 dígitos: deve ser PIN do dia derivado do YYYYMMDD
 * - alfanumérico: deve ser igual MASTER_STATIC do .env
 */
export function validateMasterInput(inputRaw: string): { ok: boolean; mode?: "DATE8" | "PIN4" | "STATIC" } {
  const input = (inputRaw ?? "").trim();

  const today = getYYYYMMDD();
  const todayPin = pinFromSecular(today);

  // 8 dígitos: data secular do servidor
  if (isDigitsLen(input, 8)) {
    return { ok: input === today, mode: "DATE8" };
  }

  // 4 dígitos: PIN derivado do dia
  if (isDigitsLen(input, 4)) {
    return { ok: input === todayPin, mode: "PIN4" };
  }

  // alfanumérico/fixo
  const staticKey = process.env.MASTER_STATIC ?? "";
  if (staticKey && input === staticKey) {
    return { ok: true, mode: "STATIC" };
  }

  return { ok: false };
}