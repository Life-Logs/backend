import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

import { RoutineTag } from './routine-tag.entity';
import { RoutineType } from 'src/routine/enum/routine-type.enum';

@Entity()
export class Routine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 200 })
  type: RoutineType;

  @Column({ type: 'json' })
  datetime: object;

  @Column({ name: 'is_actived', default: true })
  isActived: boolean;

  @Column({ name: 'goal', nullable: true })
  goal?: number;

  @OneToMany(() => RoutineTag, (routineTag) => routineTag.routine)
  routineTags: RoutineTag[];

  @Column({ name: 'actived_at', type: 'timestamp' })
  activedAt: Date;

  @Column({ name: 'inactived_at', type: 'timestamp' })
  inactivedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;
}
