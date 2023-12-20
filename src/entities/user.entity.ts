import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { Tag } from './tag.entity';
import { Routine } from './routine.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 50, unique: true })
  email: string;

  @Column({ name: 'google_provider_id', unique: true, nullable: true })
  providerId?: string;

  @Column({ name: 'nickname', length: 50, nullable: true })
  nickname?: string;

  @Column({ name: 'name', length: 50 })
  name: string;

  @Column({ length: 200, nullable: true })
  password: string;

  @OneToMany(() => Tag, (tag) => tag.userId)
  tags: Tag[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;
}
