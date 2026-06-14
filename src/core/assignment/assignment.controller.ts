import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import {
  AssignmentRequestDTO,
  AssignmentResponseCountStatusDTO,
  AssignmentResponseDTO,
  AssignmentResponseWithPaginationDTO,
} from './assignment.dto';
import { ZBody } from '../../common/decorator/zod.decorator';
import { AssignmentValidation } from './assignment.validation';
import { UserResponseDTO } from '../../user/user.dto';
import { Message } from '../../common/decorator/message.decorator';
import { AuthUser } from '../../auth/auth.decorator';
import { AssignmentStatusEnum } from './assignment.entity';

@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  @Message('Assignment created successfully')
  async create(
    @ZBody(AssignmentValidation.CREATEUPDATE) request: AssignmentRequestDTO,
    @AuthUser() user: UserResponseDTO,
  ): Promise<AssignmentResponseDTO> {
    return this.assignmentService.create(request, user.id!);
  }

  @Put(':id')
  @Message('Assignment updated successfully')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @ZBody(AssignmentValidation.CREATEUPDATE) request: AssignmentRequestDTO,
    @AuthUser() user: UserResponseDTO,
  ): Promise<AssignmentResponseDTO> {
    return this.assignmentService.update(id, request, user.id!);
  }

  @Patch(':id/status')
  @Message('Assignment status updated successfully')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
    @AuthUser() user: UserResponseDTO,
  ): Promise<AssignmentResponseDTO> {
    return this.assignmentService.updateStatus(
      id,
      status as AssignmentStatusEnum,
      user.id!,
    );
  }

  @Get()
  @Message('Success get all assignments')
  async getAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('status') status: string | '',
  ): Promise<AssignmentResponseWithPaginationDTO> {
    return this.assignmentService.getAll(page, limit, status);
  }

  @Get(':id')
  @Message('Success get assignment by id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AssignmentResponseDTO> {
    return this.assignmentService.getById(id);
  }

  @Delete(':id')
  @Message('Success delete assignment')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.assignmentService.delete(id);
  }

  @Get('count/status')
  @Message('Success get assignment count by status')
  async countByStatus(
    @Query('status') status: string,
  ): Promise<AssignmentResponseCountStatusDTO> {
    const count = this.assignmentService.countByStatus(status as AssignmentStatusEnum);
    return count;
  }

  @Get('trainer/populars')
  @Message('Success get top trainers by assignment count')
  async topTrainers(): Promise<any[]> {
    const data = this.assignmentService.topTrainer();
    return data;
  }
}
