// src/app/api/download.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const filePath = path.join(process.cwd(), './public/assets/010000006_00.dwf');
    const data = await fs.promises.readFile(filePath);

    res.setHeader('Content-Type', 'application/dwg');
    res.setHeader('Content-Disposition', 'attachment; filename="010000006_00.dwg"');

    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching file' });
  }
}
