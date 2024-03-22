export const ICryptServiceName = 'ICryptService';
export interface ICryptService {
  encrypt(data: string | Buffer): Promise<string>;
  compare(data: string | Buffer, encrypted: string): Promise<boolean>
}
