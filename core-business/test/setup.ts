import dotenv from 'dotenv';
import fs from 'fs';

const TEST_ENV_FILE = '.env.test';

dotenv.config({ path: TEST_ENV_FILE });

if (!fs.existsSync(TEST_ENV_FILE)) {
  throw new Error('.env.test file not found');
}

dotenv.config({ path: TEST_ENV_FILE });
