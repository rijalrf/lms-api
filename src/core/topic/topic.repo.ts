import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TopicEntity, topicSelects } from './topic.entity';
import { TOPIC_POPULARS_SQL, TopicPopularSQLResult } from './topic.queries';

@Injectable()
export class TopicRepositoy {
  constructor(private readonly db: PrismaService) {}

  /**
   * Creates a new topic.
   * @param request The topic data.
   * @param userId The ID of the user creating the topic.
   * @returns The created topic.
   */
  async create(request: TopicEntity, userId: number): Promise<TopicEntity> {
    const topic = await this.db.topic.create({
      data: {
        ...request,
        createdBy: userId,
      },
      select: topicSelects,
    });
    return topic;
  }

  async update(
    id: number,
    request: TopicEntity,
    userId: number,
  ): Promise<TopicEntity> {
    const topic = await this.db.topic.update({
      data: {
        ...request,
        updatedBy: userId,
      },
      where: {
        id: id,
      },
      select: topicSelects,
    });
    return topic;
  }

  async delete(id: number): Promise<void> {
    await this.db.topic.delete({
      where: {
        id: id,
      },
    });
  }

  async findById(id: number): Promise<TopicEntity | null> {
    const topic = await this.db.topic.findUnique({
      where: {
        id: id,
      },
      select: topicSelects,
    });
    return topic;
  }

  async findAll(
    title: string,
    skip: number,
    take: number,
  ): Promise<TopicEntity[]> {
    const topics = await this.db.topic.findMany({
      where: {
        title: {
          contains: title,
        },
      },
      orderBy: {
        id: 'desc',
      },
      select: topicSelects,
      skip: skip,
      take: take,
    });
    return topics;
  }

  async count(): Promise<number> {
    const count = await this.db.topic.count();
    return count;
  }

  async findTopicPopular(): Promise<TopicPopularSQLResult[]> {
    const topics =
      await this.db.$queryRaw<TopicPopularSQLResult[]>(TOPIC_POPULARS_SQL);
    return topics;
  }
}
