
// C:\repository\proj-full-stack-backend\src\system\systemTable.controller.ts
import { Request, Response } from "express";
import { AppDataSource } from "../config/db";


function isSafeTableName(name: string): boolean {
  return /^[A-Za-z0-9_]+$/.test(name);
}

export class SystemTableController {
  getTableByName = async (req: Request, res: Response) => {
    try {
      const raw = String(req.params.tableName ?? "").trim();

      if (!raw) {
        return res.status(400).json({ exists: false, rows: [] });
      }

      if (!isSafeTableName(raw)) {
        return res.status(400).json({ exists: false, rows: [] });
      }

      const dbName = process.env.DB_NAME ?? "sgb";

      // Verifica existência
      const existsRows = await AppDataSource.query(
        `
        SELECT 1
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
        LIMIT 1
        `,
        [dbName, raw]
      );

      if (!existsRows.length) {
        return res.status(404).json({ exists: false, rows: [] });
      }

      // Colunas
      const colsRaw = await AppDataSource.query(
        `
        SELECT COLUMN_NAME as name, DATA_TYPE as dataType
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
        `,
        [dbName, raw]
      );

      const columns = colsRaw.map((c: any) => ({
        key: String(c.name),
        header: String(c.name),
        type: String(c.dataType ?? ""),
      }));

      // Linhas
      const rows = await AppDataSource.query(
         `SELECT * FROM \`${dbName}\`.\`${raw}\``
        //`SELECT * FROM \`${dbName}\`.\`${raw}\` LIMIT 500`
      );

      return res.json({
        exists: true,
        rows,
        columns,
      });
    } catch {
      return res.status(500).json({ exists: false, rows: [] });
    }
  };
}