import dotenv from 'dotenv';
import fs from 'fs';

const ENV_FILE = '.env';
const TEST_ENV_FILE = '.env.test';

if (!fs.existsSync(ENV_FILE)) {
  throw new Error('.env file not found');
}

if (!fs.existsSync(TEST_ENV_FILE)) {
  throw new Error('.env.test file not found');
}

dotenv.config({ path: ENV_FILE });
dotenv.config({ path: TEST_ENV_FILE, override: true });
