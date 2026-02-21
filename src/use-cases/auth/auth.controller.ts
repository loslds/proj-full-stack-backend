
//C:\repository\proj-full-stack-backend\src\use-cases\auth\auth.controller.ts
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getDailyJwtSecret } from "../../utils/dailyKey";
import { validateMasterInput } from "../../utils/masterKeyValidator";

export class AuthController {
  master = async (req: Request, res: Response) => {
    try {
      const { masterKey } = req.body as { masterKey?: string };

      if (!masterKey || typeof masterKey !== "string") {
        return res.status(400).json({ success: false, message: "masterKey obrigatório." });
      }

      const v = validateMasterInput(masterKey);
      if (!v.ok) {
        return res.status(401).json({ success: false, message: "Chave master inválida." });
      }

      const secret = getDailyJwtSecret();

      const token = jwt.sign(
        { role: "admin", scope: "master", mode: v.mode },
        secret,
        { expiresIn: "30m" }
      );

      return res.json({ success: true, token });
    } catch {
      return res.status(500).json({ success: false, message: "Erro interno ao autenticar." });
    }
  };
}