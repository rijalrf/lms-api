import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Material } from '../../prisma/generated-client/client';
import { MaterialEntity, materialSelects } from './material.entity';
import {
  MATERIAL_POPULARS_SQL,
  MaterialPopularSQLResult,
} from './material.queries';

@Injectable()
export class MaterialRepository {
  constructor(private readonly db: PrismaService) {}

  async create(request: MaterialEntity, userId: number): Promise<Material> {
    const material = await this.db.material.create({
      data: {
        ...request,
        createdBy: userId,
      },
    });

    return material;
  }

  async update(
    id: number,
    request: MaterialEntity,
    userId: number,
  ): Promise<MaterialEntity> {
    const material = await this.db.material.update({
      select: materialSelects,
      where: {
        id: id,
      },
      data: {
        ...request,
        updatedBy: userId,
      },
    });

    return material;
  }

  async delete(id: number): Promise<void> {
    await this.db.material.delete({
      where: {
        id: id,
      },
    });
  }

  async findById(id: number): Promise<MaterialEntity | null> {
    const material = await this.db.material.findUnique({
      select: materialSelects,
      where: {
        id: id,
      },
    });

    return material;
  }

  async findAllByTopicId(
    title: string,
    topicId: number,
    skip: number,
    take: number,
  ): Promise<MaterialEntity[]> {
    const materials = await this.db.material.findMany({
      select: materialSelects,
      where: {
        title: {
          contains: title,
        },
        topicId: topicId,
      },
      skip: skip,
      take: take,
      orderBy: {
        id: 'desc',
      },
    });

    return materials;
  }

  async countByTopic(topicId: number): Promise<number> {
    const count = await this.db.material.count({
      where: {
        topicId: topicId,
      },
    });

    return count;
  }

  async countAll(): Promise<number> {
    const count = await this.db.material.count();
    return count;
  }

  async findMaterialPopular(): Promise<MaterialPopularSQLResult[]> {
    const materials = await this.db.$queryRaw<MaterialPopularSQLResult[]>(
      MATERIAL_POPULARS_SQL,
    );
    return materials;
  }
}
