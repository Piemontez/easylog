import { Controller, Logger, Param, Post, UsePipes, Query, Req, Body } from '@nestjs/common';
import { RegisterValidationPipe } from '../../../commons/validation.pipe';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam } from '@nestjs/swagger';
import { QueueService } from 'src/app/processor/queue.service';
import { PersistService } from 'src/app/processor/persist.service';
import { LogPersistDto, LogPersistOptionsDto } from './dto/persist.dto';
import LogRawData from 'src/commons/type/lograwdata';
import { FormException } from 'src/commons/form.exception';
import { isEmpty } from 'lodash';

@Controller('log')
export class PersistController {
  private readonly logger = new Logger(PersistController.name);

  constructor(
    private readonly queueService: QueueService,
    private readonly persistService: PersistService,
  ) {
    this.logger.log('Starting');
  }

  /**
   * Registra o log de dados
   */
  @ApiOperation({ tags: ['Log Persist'], summary: 'Registra o log de dados' })
  @ApiParam({ name: 'index', description: 'Indice para agrupamento dos dados' })
  @ApiBody({ schema: { type: 'object', nullable: false } })
  @ApiConsumes('application/json', 'text/plain')
  @Post('/:index')
  @UsePipes(new RegisterValidationPipe())
  async persist(@Param('index') index: string, @Query() query: LogPersistOptionsDto, @Body() body: LogPersistDto): Promise<any> {
    this.logger.log('persist');

    this.validate(index, body);

    const data = this.formatData(index, body);
    if (query?.async === 'true') {
      this.queueService //
        .queuePersist(data)
        .then(this.persistService.flush);
    } else {
      await this.queueService.queuePersist(data);
      await this.persistService.flush();
    }

    return data;
  }

  private validate(index: string, body: LogPersistDto) {
    this.logger.verbose('validate');

    const validIndex = this.persistService.formatIndex(index);
    if (validIndex !== index) {
      throw new FormException([{ kind: 'index', error: 'has_invalid_character' }]);
    }
    if (isEmpty(body)) {
      throw new FormException([{ kind: 'body', error: 'required' }]);
    }
  }

  private formatData(index: string, data: LogPersistDto): LogRawData {
    return {
      index,
      time: new Date(),
      data,
    };
  }
}
