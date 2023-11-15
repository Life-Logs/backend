import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Tag } from './tag.entity';
import { Routine } from './routine.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 50, unique: true })
  email: string;

  @Column({ name: 'google_provider_id', unique: true })
  providerId: string;

  @Column({ name: 'nickname', length: 50 })
  nickname: string;

  @Column({ length: 200, nullable: true })
  password: string;

  @OneToMany(() => Tag, (tag) => tag.userId)
  tags: Tag[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
