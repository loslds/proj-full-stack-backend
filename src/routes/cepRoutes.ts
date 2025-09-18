
//C:\repository\proj-full-stack-backend\src\routes\correiocepRoutes.ts
// src/routes/cepRoutes.ts
import { Router } from "express";
import axios from "axios";

const router = Router();

router.get("/:cep", async (req, res) => {
  const { cep } = req.params;

  try {
    const resp = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar CEP" });
  }
});

export default router;
