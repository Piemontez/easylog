import { Injectable, Logger, Scope } from '@nestjs/common';
import logConfig from 'src/config/log.config';
import { Reader } from './io/reader';
import * as fs from 'fs';
import * as path from 'path';
import LogRawData from 'src/commons/type/lograwdata';
import { FilterQuery, ObjectQuery } from 'src/commons/type/whereoperator';
import { isEmpty } from 'lodash';
import { testJsonWhere, testPlainWhere } from 'src/commons/testjsonwhere';
import { getWriterDateFromFileName, resolveDirname } from 'src/commons/file.utils';

type SearchOptions = { page?: number; perPage?: number };
type WhereJsonData = FilterQuery<LogRawData>;
type WherePlainData = string | string[];
type SearchType = 'plain' | 'json';

@Injectable({ scope: Scope.DEFAULT })
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor() {
    this.logger.log('Starting');
  }

  async getIndiceFolders(): Promise<Array<string>> {
    let files = fs.readdirSync(logConfig.FOLDER_PATH, { withFileTypes: false, recursive: true }) as string[];

    return files.filter((fileOrDir) => fs.statSync(`${logConfig.FOLDER_PATH}${path.sep}${fileOrDir}`).isDirectory());
  }

  async seach(index: string, type: SearchType, where: WhereJsonData | WherePlainData, options?: SearchOptions): Promise<Array<any>> {
    const list: Array<any> = [];

    const dirname = resolveDirname(index);
    const reader = this.createReader(dirname);
    let files = reader.listFiles();

    let lineIdx = 0;
    let startLine, endLine;
    if (options?.perPage) {
      startLine = (options.page - 1) * options.perPage;
      endLine = startLine + options.perPage;
    }

    const time = (where as ObjectQuery<LogRawData>)?.time;
    if (time) {
      files = files.filter((path) => this.testFilename(path, time));
    }

    // Carrega os arquivos
    for (const rl of this.readFileByFile(reader, files)) {
      // Percorre cada linha do arquivo
      for await (const line of rl) {
        try {
          if (type === 'plain') {
            if (this.testPlainWhere(line, where as WherePlainData)) {
              list.push(line);
            }
          } else {
            const json = JSON.parse(line);
            // Verifica se atende as condições dos filtros
            if (this.testJsonWhere(json, where as WhereJsonData)) {
              // Se possui paginação
              if (options?.perPage) {
                // Verifica se já encontrou a quantidade de registros informados
                if (startLine <= lineIdx && lineIdx < endLine) {
                  list.push(json);
                } // Se superou a quantidade por página interrompe a busca
                else if (lineIdx >= endLine) {
                  break;
                }
                lineIdx++;
              } // Se não existe paginação, adiciona
              else {
                list.push(json);
              }
            }
          }
        } catch (ex) {
          this.logger.warn(`JSON corrupted in index ${index}: ${line}`);
        }
      }
    }

    return list;
  }

  /**
   * Verifica se o nome do arquivo da math com o filtro de data
   */
  private testFilename(path: string, time) {
    const fileNameDate = getWriterDateFromFileName(path).toISOString();

    return this.testJsonWhere({ time: fileNameDate } as any, { time });
  }

  private *readFileByFile(reader: Reader, files: Array<string>) {
    for (const file of files) {
      const rl = reader.createReadStream(file);

      yield rl;
    }
  }

  private testPlainWhere(line: string, where: WherePlainData) {
    this.logger.verbose('testPlainWhere');
    if (isEmpty(line)) return false;
    if (isEmpty(where)) return true;

    return testPlainWhere(line, where);
  }

  private testJsonWhere(line: LogRawData, where: WhereJsonData) {
    this.logger.verbose('testJsonWhere');
    if (isEmpty(line)) return false;
    if (isEmpty(where)) return true;

    return testJsonWhere(line, where);
  }

  createReader(dirname: string): Reader {
    const reader = new Reader();
    reader.init({ dirname });
    return reader;
  }
}
