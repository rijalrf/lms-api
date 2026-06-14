import { Pagination } from '../../common/dto/pagination.dto';
import { TopicEntity, TopicPopularEntity } from './topic.entity';

export class TopicRequestDTO {
  title!: string;
  description!: string;
}

export class TopicResponseDTO {
  id?: number;
  title!: string;
  description!: string;

  constructor(topic: TopicEntity) {
    this.id = topic.id;
    this.title = topic.title;
    this.description = topic.description;
  }

  static fromEntity(topic: TopicEntity): TopicResponseDTO {
    return new TopicResponseDTO(topic);
  }

  static fromEntities(topics: TopicEntity[]): TopicResponseDTO[] {
    return topics.map((topic) => TopicResponseDTO.fromEntity(topic));
  }
}

export class TopicResponseDTOwithPagination {
  data: TopicResponseDTO[];
  pagination: Pagination;

  constructor(data: TopicEntity[], pagination: Pagination) {
    this.data = data.map(TopicResponseDTO.fromEntity);
    this.pagination = pagination;
  }

  static set(data: TopicEntity[], pagination: Pagination) {
    return new TopicResponseDTOwithPagination(data, pagination);
  }
}

export class TopicPopularResponseDTO {
  title: string;
  description: string;
  countAssignment: number;

  constructor(data: TopicPopularEntity) {
    this.title = data.title;
    this.description = data.description;
    this.countAssignment = Number(data.countAssignment);
  }
  static set(data: TopicPopularEntity[]): TopicPopularResponseDTO[] {
    return data.map((item) => new TopicPopularResponseDTO(item));
  }
}
