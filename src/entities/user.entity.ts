import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  email: string;

  @Column({ length: 50 })
  username: string;

  @Column({ length: 200 })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
