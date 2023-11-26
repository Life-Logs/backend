import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, DataSource } from 'typeorm';
import { Routine } from 'src/entities/routine.entity';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { Tag } from 'src/entities/tag.entity';
import { RoutineTag } from 'src/entities/routine-tag.entity';

@Injectable()
export class RoutineService {
  constructor(
    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(RoutineTag)
    private readonly routineTagRepository: Repository<RoutineTag>,
    private readonly dataSource: DataSource,
  ) {}

  async createRoutine(createRoutineDto: CreateRoutineDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    const { routineTags, ...routineData } = createRoutineDto;
    routineData.userId = 1;

    //임시로 userId를 1로 설정
    //routineTags = ['운동', '취미']

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const existingTags = await this.tagRepository.find({
        where: {
          name: In(routineTags),
          userId: routineData.userId,
        },
      });

      const newTags = routineTags
        .filter((tag) => !existingTags.find((t) => t.name === tag))
        .map((t) => {
          return { name: t, userId: routineData.userId };
        });

      const routine = await this.routineRepository.save(routineData);
      const createdTags = await this.tagRepository.save(newTags);
      const createdRoutineTags = [...createdTags, ...existingTags].map((t) => {
        return { routineId: routine.id, tagId: t.id };
      });

      await this.routineTagRepository.save(createdRoutineTags);
      await queryRunner.commitTransaction();
      return routine;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getAllRoutines(): Promise<Routine[]> {
    return this.routineRepository.find();
  }

  async getRoutine(id: number): Promise<Routine> {
    return this.routineRepository.findOne({
      where: { id },
    });
  }

  async updateRoutine(id: number, routine: Routine): Promise<Routine> {
    await this.routineRepository.update(id, routine);
    return this.getRoutine(id);
  }

  async deleteRoutine(id: number): Promise<void> {
    await this.routineRepository.delete(id);
  }
}
