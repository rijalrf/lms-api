import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AssignmentEntity,
  AssignmentFullEntity,
  AssignmentStatusEnum,
  includeSelects,
} from './assignment.entity';
import { TOP_TRAINERS_SQL, TopTrainerSQLResult } from './assignment.queries';

@Injectable()
export class AssignmentReposity {
  constructor(private readonly db: PrismaService) {}

  async create(
    request: AssignmentEntity,
    userId: number,
  ): Promise<AssignmentFullEntity> {
    const newData = {
      ...request,
      createdBy: userId,
    };
    const data = await this.db.assignment.create({
      data: newData,
      include: {
        topic: { select: includeSelects.topic },
        material: { select: includeSelects.material },
        trainerUser: { select: includeSelects.trainer },
      },
    });
    return data;
  }

  async update(
    id: number,
    request: AssignmentEntity,
    userId: number,
  ): Promise<AssignmentFullEntity> {
    const updateData = {
      ...request,
      updatedBy: userId,
    };
    const data = await this.db.assignment.update({
      where: { id },
      data: updateData,
      include: {
        topic: { select: includeSelects.topic },
        material: { select: includeSelects.material },
        trainerUser: { select: includeSelects.trainer },
      },
    });
    return data;
  }

  async updateStatus(
    id: number,
    status: AssignmentStatusEnum,
    userId: number,
  ): Promise<AssignmentFullEntity> {
    const assignment = await this.db.assignment.update({
      where: { id },
      data: {
        status: status,
        updatedBy: userId,
      },
      include: {
        topic: { select: includeSelects.topic },
        material: { select: includeSelects.material },
        trainerUser: { select: includeSelects.trainer },
      },
    });
    return assignment;
  }

  async getAll(
    skip: number,
    take: number,
    status: AssignmentStatusEnum,
  ): Promise<AssignmentFullEntity[]> {
    const data = await this.db.assignment.findMany({
      skip,
      take,
      where: {
        status: status,
      },
      include: {
        topic: { select: includeSelects.topic },
        material: { select: includeSelects.material },
        trainerUser: { select: includeSelects.trainer },
      },
    });
    return data;
  }

  async getById(id: number): Promise<AssignmentFullEntity | null> {
    const data = await this.db.assignment.findUnique({
      where: { id },
      include: {
        topic: { select: includeSelects.topic },
        material: { select: includeSelects.material },
        trainerUser: { select: includeSelects.trainer },
      },
    });
    return data;
  }

  async delete(id: number): Promise<void> {
    await this.db.assignment.delete({ where: { id } });
  }

  async count(): Promise<number> {
    const count = await this.db.assignment.count();
    return count;
  }

  async countByStatus(status: AssignmentStatusEnum): Promise<number> {
    console.log({ status });
    const count = await this.db.assignment.count({
      where: {
        status: status,
      },
    });
    return count;
  }

  async topTrainer(): Promise<TopTrainerSQLResult[]> {
    const result =
      await this.db.$queryRaw<TopTrainerSQLResult[]>(TOP_TRAINERS_SQL);
    return result;
  }
}
