import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, DataSource, Not } from 'typeorm';
import { Routine } from 'src/entities/routine.entity';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { Tag } from 'src/entities/tag.entity';
import { RoutineTag } from 'src/entities/routine-tag.entity';
import { query } from 'express';
import { RoutineInfoDto } from './dto/routine-info.dto';
import { RoutineDetailDto } from './dto/routine-detail.dto';
import { ToggleActivation } from './dto/routine-activation.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

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

  async createRoutine(id: number, createRoutineDto: CreateRoutineDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    const { routineTags, ...routineData } = createRoutineDto;
    routineData.userId = id;

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

  async getAllRoutines(id: number): Promise<RoutineInfoDto[]> {
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
      where: {
        userId: id,
      },
    });

    //인스턴스 없이 사용 가능한 클래스 스태틱 함수
    return routines.map((e) => RoutineInfoDto.from(e));
  }

  async getRoutine(userId: number, id: number): Promise<RoutineDetailDto> {
    const routine = await this.routineRepository.findOne({
      where: { id, deletedAt: null, userId },
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

  async toggleActivation(userId: number, id: number, toggleActivation: ToggleActivation): Promise<Routine> {
    const routine = await this.routineRepository.findOne({
      where: { id, userId },
    });

    if (!routine) throw new NotFoundException(`Rountine: ${id} not found`);

    routine.isActived = toggleActivation.isActived;
    return this.routineRepository.save(routine);
  }

  async updateRoutine(userId: number, id: number, updateRoutineDto: UpdateRoutineDto): Promise<Routine> {
    const { routineTags, ...others } = updateRoutineDto;
    if (routineTags) {
      //태그가 들어옴
      //가정
      //기존태그 칼퇴, <회사>
      //신규태그 칼퇴, (공부) => routineTags
      const existingTags = await this.tagRepository.find({
        where: {
          name: In(routineTags),
          userId,
          routineTags: { routineId: id },
        },
        relations: ['routineTags'],
      });
      //-> 칼퇴

      const notTags = await this.routineTagRepository.find({
        where: {
          routineId: id,
          tag: { userId, name: Not(In(routineTags)) },
        },
        relations: ['tag'],
      });
      //->회사

      //신규태그는 태그테이블 생성하고, 루틴태그테이블에 생성해야함
      const newTags = routineTags
        .filter((tag) => !existingTags.find((t) => t.name === tag))
        .map((t) => {
          return { name: t, userId };
        });
      //-> 공부
      const createTags = await this.tagRepository.save(newTags);
      await this.routineTagRepository.softRemove(notTags);

      const createdRoutineTags = createTags.map((t) => {
        return { routineId: id, tagId: t.id };
      });
      await this.routineTagRepository.save(createdRoutineTags);
    }
    const updateRoutineInfo: Omit<UpdateRoutineDto, 'routineTags'> = { ...others };
    await this.routineRepository.update(id, updateRoutineInfo);

    return this.routineRepository.findOne({
      where: { id, userId },
    });
  }

  async deleteRoutine(userId: number, id: number): Promise<Routine> {
    const routine = await this.routineRepository.findOne({
      where: { id, userId },
    });
    if (!routine) throw new BadRequestException('이미 삭제된 루틴이거나 권한이 없습니다.');
    return await this.routineRepository.softRemove(routine);
  }
}
