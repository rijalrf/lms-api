import {
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import {
  TopicPopularResponseDTO,
  TopicRequestDTO,
  TopicResponseDTO,
  TopicResponseDTOwithPagination,
} from './topic.dto';
import { ZBody } from '../../common/decorator/zod.decorator';
import { TopicValidation } from './topic.validation';
import { AuthUser } from '../../auth/auth.decorator';
import { UserResponseDTO } from '../../user/user.dto';
import { Message } from '../../common/decorator/message.decorator';

@Controller('topics')
@Injectable()
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  @Message('Topic created successfully')
  async create(
    @AuthUser() user: UserResponseDTO,
    @ZBody(TopicValidation.CREATEUPDATE) request: TopicRequestDTO,
  ): Promise<TopicResponseDTO> {
    const data = await this.topicService.create(request, user.id);
    return data;
  }

  @Get()
  async findAll(
    @Query('title') title: string | '',
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<TopicResponseDTOwithPagination> {
    const data = await this.topicService.findAll(title, page, limit);
    return data;
  }

  @Get('topic/populars')
  @Message('Topics popular retrieved successfully')
  async findTopicPopular(): Promise<TopicPopularResponseDTO[]> {
    const data = await this.topicService.findTopicPopular();
    return data;
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const data = await this.topicService.findById(id);
    return data;
  }

  @Put(':id')
  @Message('Topic updated successfully')
  async update(
    @AuthUser() user: UserResponseDTO,
    @Param('id', ParseIntPipe) id: number,
    @ZBody(TopicValidation.CREATEUPDATE) request: TopicRequestDTO,
  ): Promise<TopicResponseDTO> {
    const data = await this.topicService.update(id, request, user.id

      
    );
    return data;
  }

  @Delete(':id')
  @Message('Topic deleted successfully')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.topicService.delete(id);
  }
}
