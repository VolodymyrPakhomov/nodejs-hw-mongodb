import fs from 'node:fs/promises';

export const createDirIfNotExists = async (url) => {
  try {
    await fs.access(url);
    console.log(`Directory ${url} already exists`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(url);
      console.log(`Directory ${url} created`);
    } else {
      console.error(`Error accessing directory ${url}:`, err);
    }
  }
};