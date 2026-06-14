import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TopicRepositoy } from './topic.repo';
import {
  TopicResponseDTO,
  TopicRequestDTO,
  TopicResponseDTOwithPagination,
  TopicPopularResponseDTO,
} from './topic.dto';
import { Pagination } from '../../common/dto/pagination.dto';

@Injectable()
export class TopicService {
  constructor(private readonly topicRepo: TopicRepositoy) {}

  async create(
    request: TopicRequestDTO,
    userId: number,
  ): Promise<TopicResponseDTO> {
    try {
      const topic = await this.topicRepo.create(request, userId);
      return TopicResponseDTO.fromEntity(topic);
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
    request: TopicRequestDTO,
    userId: number,
  ): Promise<TopicResponseDTO> {
    try {
      const topic = await this.topicRepo.update(id, request, userId);
      return TopicResponseDTO.fromEntity(topic);
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
      await this.topicRepo.delete(id);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal Server Error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(
    title: string | '',
    page: number,
    limit: number,
  ): Promise<TopicResponseDTOwithPagination> {
    const skip = (page - 1) * limit;
    const totalItems = await this.topicRepo.count();
    const pagination = new Pagination(page, limit, totalItems);
    try {
      const topics = await this.topicRepo.findAll(title, skip, limit);
      return TopicResponseDTOwithPagination.set(topics, pagination);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal Server Error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findById(id: number): Promise<TopicResponseDTO> {
    try {
      const topic = await this.topicRepo.findById(id);
      if (!topic) {
        throw new HttpException('Topic not found', HttpStatus.NOT_FOUND);
      }
      return TopicResponseDTO.fromEntity(topic);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal Server Error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findTopicPopular(): Promise<TopicPopularResponseDTO[]> {
    try {
      const topicPopulars = await this.topicRepo.findTopicPopular();
      return TopicPopularResponseDTO.set(topicPopulars);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Internal Server Error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
