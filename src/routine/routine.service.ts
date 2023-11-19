import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Routine } from 'src/entities/routine.entity';

@Injectable()
export class RoutineService {
  constructor(
    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,
  ) {}

  async createRoutine(routine: Routine): Promise<Routine> {
    return this.routineRepository.save(routine);
  }

  async getAllRoutines(): Promise<Routine[]> {
    return this.routineRepository.find();
  }

  async getRoutine(id: number): Promise<Routine> {
    return this.routineRepository.findOne(id);
  }

  async updateRoutine(id: number, routine: Routine): Promise<Routine> {
    await this.routineRepository.update(id, routine);
    return this.getRoutine(id);
  }

  async deleteRoutine(id: number): Promise<void> {
    await this.routineRepository.delete(id);
  }
}
