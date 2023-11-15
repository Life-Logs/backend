import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { Routine } from './routine.entity';
import { Tag } from './tag.entity';

@Entity()
export class RoutineTag {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'json' })
  datetime: object;

  @ManyToOne(() => Routine, (routine) => routine.routineTags)
  routine: Routine;

  @ManyToOne(() => Tag, (tag) => tag.routineTags)
  tag: Tag;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;
}
