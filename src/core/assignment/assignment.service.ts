import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AssignmentReposity } from './assignment.repo';
import {
  AssignmentRequestDTO,
  AssignmentResponseCountStatusDTO,
  AssignmentResponseDTO,
  AssignmentResponseTopTrainerDTO,
  AssignmentResponseWithPaginationDTO,
} from './assignment.dto';
import { Pagination } from '../../common/dto/pagination.dto';
import { AssignmentStatusEnum, TrainerPopularEntity } from './assignment.entity';

@Injectable()
export class AssignmentService {
  constructor(private readonly assignmentRepo: AssignmentReposity) {}

  async create(
    request: AssignmentRequestDTO,
    userId: number,
  ): Promise<AssignmentResponseDTO> {
    try {
      const assignment = await this.assignmentRepo.create(request, userId);
      return AssignmentResponseDTO.fromEntity(assignment);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal Server Error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: number,
    request: AssignmentRequestDTO,
    userId: number,
  ): Promise<AssignmentResponseDTO> {
    try {
      const assignment = await this.assignmentRepo.update(id, request, userId);
      return AssignmentResponseDTO.fromEntity(assignment);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal Server Error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateStatus(
    id: number,
    status: AssignmentStatusEnum,
    userId: number,
  ): Promise<AssignmentResponseDTO> {
    try {
      const assignment = await this.assignmentRepo.updateStatus(
        id,
        status,
        userId,
      );
      return AssignmentResponseDTO.fromEntity(assignment);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal Server Error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAll(
    page: number,
    limit: number,
    status: string | '',
  ): Promise<AssignmentResponseWithPaginationDTO> {
    const skip = (page - 1) * limit;
    const take = limit;
    const count = await this.assignmentRepo.count();
    try {
      const assignments = await this.assignmentRepo.getAll(
        skip,
        take,
        status as any,
      );
      return AssignmentResponseWithPaginationDTO.set(
        assignments,
        new Pagination(page, limit, count),
      );
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal Server Error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getById(id: number): Promise<AssignmentResponseDTO> {
    try {
      const data = await this.assignmentRepo.getById(id);
      if (!data) {
        throw new HttpException('Assignment not found', HttpStatus.NOT_FOUND);
      }
      return AssignmentResponseDTO.fromEntity(data);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal Server Error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.assignmentRepo.delete(id);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal Server Error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async countByStatus(
    status: AssignmentStatusEnum,
  ): Promise<AssignmentResponseCountStatusDTO> {
    console.log(status);
    try {
      const count = await this.assignmentRepo.countByStatus(
        status,
      );
      return AssignmentResponseCountStatusDTO.set(
        status,
        count,
      );
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal Server Error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async topTrainer(): Promise<AssignmentResponseTopTrainerDTO[]> {
    try {
      const data = await this.assignmentRepo.topTrainer();
      const result: TrainerPopularEntity[] = data.map((item) => ({
        trainer: {
          id: item.id,
          name: item.name,
          email: item.email,
        },
        countAssignment: item.countAssignment,
      }));
      return AssignmentResponseTopTrainerDTO.set(result);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal Server Error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
