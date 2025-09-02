
// backend/use-cases/start/systable.controller.ts
import { Request, Response } from "express";
import { dbSource } from "./dbSource";

export const syncTables = async (req: Request, res: Response) => {
  const { tables } = req.body;

  if (!tables || !Array.isArray(tables)) {
    return res.status(400).json({ success: false, message: "Lista de tabelas inválida" });
  }

  try {
    const queryRunner = dbSource.createQueryRunner();
    await queryRunner.connect();

    const missingTables: string[] = [];

    for (const table of tables) {
      const result = await queryRunner.query(
        `SHOW TABLES LIKE '${table}'`
      );

      if (result.length === 0) {
        missingTables.push(table);
      }
    }

    await queryRunner.release();

    if (missingTables.length > 0) {
      return res.status(200).json({
        success: false,
        message: "Tabelas ausentes",
        missing: missingTables,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Todas as tabelas mínimas estão presentes",
    });

  } catch (error) {
    console.error("Erro na verificação das tabelas", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno ao verificar tabelas",
    });
  }
};