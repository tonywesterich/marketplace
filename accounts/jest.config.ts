import type { JestConfigWithTsJest } from 'ts-jest';
import { name as packageName } from './package.json';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  displayName: packageName,
  testEnvironment: 'node',
  testTimeout: 90000,
};

export default config;
