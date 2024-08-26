import { Controller, Logger, Param, Body, UsePipes, Get, Query, Post } from '@nestjs/common';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { LogJsonDataSearchDto, LogPlainDataSearchDto } from './dto/search.dto';
import { SearchService } from 'src/app/processor/search.service';

@Controller('log')
export class SearchController {
  private readonly logger = new Logger(SearchController.name);

  constructor(private readonly searchService: SearchService) {
    this.logger.log('Starting');
  }

  /**
   * Coleta os logs de dados
   */
  @ApiOperation({ tags: ['Log'], summary: 'Coleta os índices existentes' })
  @Get('/indexes')
  @UsePipes(new RegisterValidationPipe())
  async indexes(): Promise<any> {
    this.logger.log('indexes');

    const indexes = await this.searchService.getIndiceFolders();
    return indexes.map((index) => ({ name: index }));
  }

  /**
   * Coleta os logs de dados
   */
  @ApiOperation({ tags: ['Log'], summary: 'Coleta os logs de dados' })
  @ApiParam({ name: 'index', description: 'Indice para agrupamento dos dados' })
  @Get('/:index')
  @UsePipes(new RegisterValidationPipe())
  async search(@Param('index') index: string, @Query() { where, ...options }: LogJsonDataSearchDto): Promise<any> {
    this.logger.log('search');

    const itens = await this.searchService.seach(index, 'plain', where as any, options);
    return itens;
  }

  /**
   * Coleta os logs de dados
   */
  @ApiOperation({ tags: ['Log'], summary: 'Coleta os logs de dados' })
  @ApiParam({ name: 'index', description: 'Indice para agrupamento dos dados' })
  @Post('/:index/_search/json')
  @UsePipes(new RegisterValidationPipe())
  async searchJsonFromPost(@Param('index') index: string, @Body() { where, ...options }: LogJsonDataSearchDto): Promise<any> {
    this.logger.log('searchFromPost');

    const itens = await this.searchService.seach(index, 'json', where as any, options);
    return itens;
  }

  @ApiOperation({ tags: ['Log'], summary: 'Coleta os logs de dados' })
  @ApiParam({ name: 'index', description: 'Indice para agrupamento dos dados' })
  @Post('/:index/_search/plain')
  @UsePipes(new RegisterValidationPipe())
  async searchPlainFromPost(@Param('index') index: string, @Body() { where, ...options }: LogPlainDataSearchDto): Promise<any> {
    this.logger.log('searchFromPost');

    const itens = await this.searchService.seach(index, 'plain', where as any, options);
    return itens;
  }
}
