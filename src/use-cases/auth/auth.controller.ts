
// C:\repository\proj-full-stack-backend\src\use-cases\auth\auth.controller.ts

import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { getDailyJwtSecret } from "../../utils/dailyKey";
import { validateMasterInput } from "../../utils/masterKeyValidator";

type MasterBody = { masterKey?: unknown };

export class AuthController {
  master = async (req: Request, res: Response) => {
    try {
      const body = (req.body ?? {}) as MasterBody;
      const masterKey = body.masterKey;

      // ✅ valida payload
      if (typeof masterKey !== "string" || masterKey.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "masterKey obrigatório.",
        });
      }

      // ✅ valida entrada master: PIN4 / DATE8 / STATIC
      const v = validateMasterInput(masterKey);
      if (!v.ok) {
        return res.status(401).json({
          success: false,
          message: "Chave master inválida.",
        });
      }

      // ✅ segredo diário (não pode ser vazio)
      const secret = getDailyJwtSecret();
      if (!secret || typeof secret !== "string" || secret.trim().length < 10) {
        // 10 é um mínimo prático; ajuste se quiser
        return res.status(500).json({
          success: false,
          message: "Servidor sem segredo JWT configurado.",
        });
      }

      const token = jwt.sign(
        {
          role: "admin",
          scope: "master",
          mode: v.mode, // DATE8 | PIN4 | STATIC
        },
        secret,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        success: true,
        token,
        mode: v.mode,
      });
    } catch (err) {
      console.error("[AUTH MASTER] erro:", err);
      return res.status(500).json({
        success: false,
        message: "Erro interno ao autenticar.",
      });
    }
  };
}