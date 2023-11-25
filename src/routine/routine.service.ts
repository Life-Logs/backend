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

  async createRoutine(createRoutineDto: CreateRoutineDto): Promise<Routine> {
    const { routineTags, ...routineData } = createRoutineDto;
    const routine = await this.routineRepository.save(routineData);

    // 태그를 생성하거나 찾아서 루틴과 연결
    const tags = await Promise.all(
      routineTags.map(async (tagString) => {
        const [tagName, parentTagName] = tagString.split('/');
        const parentTag = parentTagName
          ? await this.tagRepository.findOne({ where: { name: parentTagName } })
          : null;

        const tag = await this.tagRepository.save({
          name: tagName,
          parentId: parentTag ? parentTag.id : null,
        });

        await this.routineTagRepository.save({
          routine,
          tag,
        });

        return tag;
      }),
    );

    routine.routineTags = tags;

    return routine;
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
