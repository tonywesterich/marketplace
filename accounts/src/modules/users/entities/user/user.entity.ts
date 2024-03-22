import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from './';
import crypto from 'crypto';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;

  @Column({ type: 'varchar', length: 60, unique: true })
  email: string;

  @Column({
    type: 'varchar',
    length: 60,
    select: false,
  })
  password: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 8 })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    props: {
      email: string;
      password: string;
      name: string;
      role: string;
    },
    id?: string,
  ) {
    this.id = id ?? crypto.randomUUID();
    Object.assign(this, props);
  }
}
