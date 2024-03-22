import { injectable } from 'inversify';
import { ICryptService } from './crypt.service.interface';
import bcrypt from 'bcrypt';

@injectable()
export class CryptServiceBcrypt implements ICryptService {
  async encrypt(data: string | Buffer): Promise<string> {
    return await bcrypt.hash(data, 10);
  }

  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(data, encrypted);
  }
}
