import fs from 'fs';
import { join } from 'path';

export const setupUploadDirectory = (rootDir) => {
  const uploadDir = join(rootDir, 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
};
