import fs from 'fs';
import path from 'path';
import { ENV } from '../config/env.js';

// Ensure data directory exists
if (!fs.existsSync(ENV.DATA_DIR)) {
  fs.mkdirSync(ENV.DATA_DIR, { recursive: true });
}

/**
 * Reads JSON file, returns defaultData if file doesn't exist
 * @param {string} fileName 
 * @param {any} defaultData 
 */
export const readJsonFile = (fileName, defaultData = null) => {
  const filePath = path.join(ENV.DATA_DIR, fileName);
  try {
    if (!fs.existsSync(filePath)) {
      if (defaultData !== null) {
        writeJsonFile(fileName, defaultData);
      }
      return defaultData;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`[FileStorage] Error reading ${fileName}:`, err);
    return defaultData;
  }
};

/**
 * Atomically writes data to JSON file
 * @param {string} fileName 
 * @param {any} data 
 */
export const writeJsonFile = (fileName, data) => {
  const filePath = path.join(ENV.DATA_DIR, fileName);
  const tempPath = `${filePath}.tmp`;
  try {
    const serialized = JSON.stringify(data, null, 2);
    fs.writeFileSync(tempPath, serialized, 'utf-8');
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (err) {
    console.error(`[FileStorage] Error writing ${fileName}:`, err);
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch (_) {}
    }
    return false;
  }
};
