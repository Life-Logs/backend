import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, DataSource } from 'typeorm';
import { Routine } from 'src/entities/routine.entity';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { Tag } from 'src/entities/tag.entity';
import { RoutineTag } from 'src/entities/routine-tag.entity';
import { query } from 'express';
import { RoutineInfoDto } from './dto/routine-info.dto';
import { RoutineDetailDto } from './dto/routine-detail.dto';

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

      const routine = this.routineRepository.create(routineData);
      const createdTags = this.tagRepository.create(newTags);
      const { id: routineId } = await queryRunner.manager.save(routine);
      const savedTags = await queryRunner.manager.save(createdTags);

      const createdRoutineTags = [...savedTags, ...existingTags].map((t) => {
        return { routineId, tagId: t.id };
      });

      const createRoutineTags = this.routineTagRepository.create(createdRoutineTags);
      await queryRunner.manager.save(createRoutineTags);
      await queryRunner.commitTransaction();
      return routine;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllRoutines(): Promise<RoutineInfoDto[]> {
    const routines = await this.routineRepository.find({
      relations: ['routineTags', 'routineTags.tag'],
      select: {
        routineTags: {
          id: true,
          tag: {
            id: true,
            name: true,
          },
        },
      },
    });

    //인스턴스 없이 사용 가능한 클래스 스태틱 함수
    return routines.map((e) => RoutineInfoDto.from(e));
  }

  async getRoutine(id: number): Promise<RoutineDetailDto> {
    const routine = await this.routineRepository.findOne({
      where: { id, deletedAt: null },
      relations: ['routineTags', 'routineTags.tag'],
      select: {
        routineTags: {
          id: true,
          tag: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!routine) throw new BadRequestException({ message: 'Not found' });
    return RoutineDetailDto.from(routine);
  }

  async updateRoutine(id: number, routine: Routine): Promise<Routine> {
    await this.routineRepository.update(id, routine);
    return this.routineRepository.findOne({
      where: { id },
    });
  }

  async deleteRoutine(id: number): Promise<Routine> {
    const routine = await this.routineRepository.findOne({
      where: { id },
    });

    return await this.routineRepository.softRemove(routine);
  }
}
