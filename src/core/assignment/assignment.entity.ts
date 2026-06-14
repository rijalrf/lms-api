import { StatusAssignment, Prisma } from '../../prisma/generated-client/client.js';
import { MaterialEntity } from '../material/material.entity';
import { TopicEntity } from '../topic/topic.entity';

export type AssignmentStatusEnum = StatusAssignment;

export type AssignmentEntity = {
  id: number;
  topicId: number;
  materialId: number;
  userId: number;
  trainingDate: Date;
  startTime: Date;
  endTime: Date;
  maxParticipant: number;
  classRoomLink: string;
  status: AssignmentStatusEnum;
};

export type AssignmentFullEntity = Omit<
  AssignmentEntity,
  'topicId' | 'materialId' | 'userId'
> & {
  topic: TopicEntity;
  material: MaterialEntity;
  trainerUser: TrainerEntity;
};

export type TrainerEntity = {
  id: number;
  name: string;
  email: string;
};

export type TrainerPopularEntity = {
  trainer: TrainerEntity;
  countAssignment: bigint;
};

export const includeSelects = {
  topic: {
    id: true,
    title: true,
    description: true,
  } satisfies Prisma.TopicSelect,
  material: {
    id: true,
    title: true,
    description: true,
    topicId: true,
    fileUrl: true,
  } satisfies Prisma.MaterialSelect,
  trainer: {
    id: true,
    name: true,
    email: true,
  } satisfies Prisma.UserSelect,
};
