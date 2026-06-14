import { Pagination } from '../../common/dto/pagination.dto';
import {
  AssignmentFullEntity,
  AssignmentStatusEnum,
  TrainerEntity,
  TrainerPopularEntity,
} from './assignment.entity';
import { TopicEntity } from '../topic/topic.entity';
import { MaterialEntity } from '../material/material.entity';


export class AssignmentRequestDTO {
  id!: number;
  topicId!: number;
  materialId!: number;
  userId!: number;
  trainingDate!: Date;
  startTime!: Date;
  endTime!: Date;
  maxParticipant!: number;
  classRoomLink!: string;
  status!: AssignmentStatusEnum;
}

export class AssignmentResponseCountStatusDTO {
  status!: string;
  count!: number;

  constructor(status: string, count: number) {
    this.status = status;
    this.count = count;
  }
  static set(status: string, count: number) {
    return new AssignmentResponseCountStatusDTO(status, count);
  }
}

export class AssignmentResponseTopTrainerDTO {
  trainer: TrainerEntity;
  countAssignment: number;

  constructor(topTrainer: TrainerPopularEntity) {
    this.trainer = topTrainer.trainer;
    this.countAssignment = Number(topTrainer.countAssignment);
  }
  static set(trainer: TrainerPopularEntity[]) {
    return trainer.map((item) => new AssignmentResponseTopTrainerDTO(item));
  }
}

export class AssignmentResponseDTO {
  id: number;
  trainingDate: Date;
  startTime: Date;
  endTime: Date;
  maxParticipant: number;
  classRoomLink: string;
  status: AssignmentStatusEnum;
  trainer: TrainerEntity;
  topic: TopicEntity;
  material: MaterialEntity;

  constructor(assignment: AssignmentFullEntity) {
    this.id = assignment.id;
    this.trainingDate = assignment.trainingDate;
    this.startTime = assignment.startTime;
    this.endTime = assignment.endTime;
    this.maxParticipant = assignment.maxParticipant;
    this.classRoomLink = assignment.classRoomLink;
    this.status = assignment.status;
    this.topic = assignment.topic;
    this.material = assignment.material;
    this.trainer = assignment.trainerUser;
  }
  static fromEntity(assignment: AssignmentFullEntity): AssignmentResponseDTO {
    return new AssignmentResponseDTO(assignment);
  }
  static fromEntities(
    assignments: AssignmentFullEntity[],
  ): AssignmentResponseDTO[] {
    return assignments.map(AssignmentResponseDTO.fromEntity);
  }
}

export class AssignmentResponseWithPaginationDTO {
  data: AssignmentResponseDTO[];
  pagination: Pagination;

  constructor(data: AssignmentFullEntity[], pagination: Pagination) {
    this.data = AssignmentResponseDTO.fromEntities(data);
    this.pagination = pagination;
  }
  static set(data: AssignmentFullEntity[], pagination: Pagination) {
    return new AssignmentResponseWithPaginationDTO(data, pagination);
  }
}
