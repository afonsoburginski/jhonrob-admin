// pages/api/download.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { filePath } = req.query;

  if (!filePath) {
    return res.status(400).json({ error: 'File path is required' });
  }

  const localFilePath = path.join('\\\\192.168.1.102\\Arquivos\\DESENHOS GERENCIADOR\\180', filePath as string);

  try {
    const fileBuffer = await fs.readFile(localFilePath);
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(localFilePath)}"`);
    res.send(fileBuffer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read file' });
  }
}
