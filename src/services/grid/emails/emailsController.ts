
//C:\repository\proj-full-stack-backend\src\services\grid\emails\emailsController.ts

import { Request, Response } from "express";
import { AppDataSource } from "../../../config/db";

import { emailsGridSelect } from "../../utility/emails/emailsGridSelect";
import { mapEmailsGridRow } from "../../utility/emails/mapEmailsGridRow";

export async function getEmailsGrid(req: Request, res: Response) {
  const rows = await AppDataSource.query(emailsGridSelect);

  const result = rows.map(mapEmailsGridRow);

  return res.json(result);
}