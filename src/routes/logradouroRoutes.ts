
//C:\repository\proj-full-stack-backend\src\routes\correioLogradouroRoutes.ts
import { Router } from "express";
import axios from "axios";

const logradouroRoutes = Router();

// Busca por logradouro (cidade, uf e rua)
logradouroRoutes.get("/logradouro", async (req, res) => {
  const { uf, cidade, rua } = req.query;

  if (!uf || !cidade || !rua) {
    return res.status(400).json({ error: "Parâmetros obrigatórios: uf, cidade, rua" });
  }

  try {
    const resp = await axios.get(
      `https://viacep.com.br/ws/${uf}/${encodeURIComponent(
        cidade as string
      )}/${encodeURIComponent(rua as string)}/json/`
    );
    res.json(resp.data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar logradouro" });
  }
});

export default logradouroRoutes;