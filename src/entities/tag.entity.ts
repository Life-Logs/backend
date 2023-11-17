import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { RoutineTag } from './routine-tag.entity';
import { User } from './user.entity';
@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ length: 50 })
  name: string;

  @Column({ name: 'parent_id', length: 200, nullable: true })
  parentId: string;

  @OneToMany(() => RoutineTag, (routineTag) => routineTag.tag)
  routineTags: RoutineTag[];

  @ManyToOne(() => User, (user) => user.tags)
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;
}
