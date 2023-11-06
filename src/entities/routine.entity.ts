import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Routine {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 50, unique: true, name: 'user_id' })
  userId: string;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 200, nullable: true })
  type: string;

  @Column({})
  datetime: JSON;

  @Column({ length: 50, name: 'routine_tag' })
  routineTag: string;

  @Column({ name: 'actived_at', type: 'timestamp' })
  activedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;
}
