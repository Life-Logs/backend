import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
  ) {}

  async createRoutine(createRoutineDto: CreateRoutineDto) {
    const { routineTags, ...routineData } = createRoutineDto;
    routineData.userId = 1;
    //임시로 userId를 1로 설정
    //routineTags = ['운동', '취미']
    const tags = await this.tagRepository.find({
      where: {
        name: In(routineTags),
        userId: routineData.userId,
      },
    });

    const realRoutionTags = routineTags
      .filter((tag) => !tags.find((t) => t.name === tag))
      .map((t) => {
        return { name: t, userId: routineData.userId };
      });

    const createdTags = await this.tagRepository.save(realRoutionTags);

    const routine = await this.routineRepository.save(routineData);

    console.log('routinereturn', routine);
    console.log('tags', createdTags);

    //const routineTagPromises = (await Promise.all(createdTags)).map((tag) =>
    //  this.routineTagRepository.save({
    //    routine:routine.id,
    //    tag: tag.id,
    //  }),
    //);
    console.log(realRoutionTags);
    console.log(routineData);

    //return routine;
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
