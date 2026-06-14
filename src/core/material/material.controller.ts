import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MaterialService } from './material.service';
import { ZBody } from '../../common/decorator/zod.decorator';
import {
  MaterialRequestDTO,
  MaterialResponseDTO,
  MaterialsPopularResponseDTO,
} from './material.dto';
import { AuthUser } from '../../auth/auth.decorator';
import { UserResponseDTO } from '../../user/user.dto';
import { Message } from '../../common/decorator/message.decorator';
import { MaterialValidation } from './material.validation';

@Controller('materials')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  @Message('Material created successfully')
  async create(
    @AuthUser() user: UserResponseDTO,
    @ZBody(MaterialValidation.CREATEUPDATE) request: MaterialRequestDTO,
  ): Promise<MaterialResponseDTO> {
    const data = await this.materialService.create(request, user.id);
    return data;
  }

  @Put(':id')
  @Message('Material updated successfully')
  async update(
    @AuthUser() user: UserResponseDTO,
    @Param('id', ParseIntPipe) id: number,
    @ZBody(MaterialValidation.CREATEUPDATE) request: MaterialRequestDTO,
  ): Promise<MaterialResponseDTO> {
    const data = await this.materialService.update(id, request, user.id);
    return data;
  }

  @Delete(':id')
  @Message('Material deleted successfully')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.materialService.delete(id);
  }

  @Get('material/populars')
  @Message('Materials popular retrieved successfully')
  async findMaterialPopular(): Promise<MaterialsPopularResponseDTO[]> {
    const data = await this.materialService.findMaterialPopular();
    return data;
  }

  @Get(':id')
  @Message('Material retrieved successfully')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MaterialResponseDTO> {
    const data = await this.materialService.findById(id);
    return data;
  }

  @Get('topic/:topicId')
  @Message('Materials by topic retrieved successfully')
  async findAllByTopicId(
    @Query('title') title: string | '',
    @Param('topicId', ParseIntPipe) topicId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    const data = await this.materialService.findAllByTopicId(
      title,
      topicId,
      page,
      limit,
    );
    return data;
  }

  @Get('count')
  @Message('Materials retrieved count successfully')
  async count(): Promise<number> {
    const data = await this.materialService.countAll();
    return data;
  }
}
