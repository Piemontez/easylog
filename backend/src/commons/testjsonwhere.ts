//Código inspirado em: https://github.com/mikro-orm/mikro-orm/blob/cc0fc5f8e4190270c197c3f0c1d2f326fd133212/packages/core/src/utils/QueryHelper.ts#L3

import { isPlainObject, isArray } from 'lodash';
import LogRawData from './type/lograwdata';
import { FilterQuery, QueryOperator, QueryOperators, Scalar } from './type/whereoperator';

function processOperator(data: Scalar | any, op: QueryOperator, value: any): boolean {
  switch (op) {
    case '$lt':
      return data < value;
    case '$lte':
      return data <= value;
    case '$gt':
      return data > value;
    case '$gte':
      return data >= value;
    case '$contains':
      return value.every((el) => el === data);
    case '$in':
      return value.includes(data);
    case '$nin':
      return !value.includes(data);
    case '$exists':
      return value === true || value === 'true' ? !!data : !data;
    case '$ne':
      return data !== value;
    case '$eq':
    default:
      return data === value;
  }
}

function isOperator(opOrProps: string): boolean {
  return QueryOperators.includes(opOrProps);
}

export function testJsonWhere(line: Scalar | Record<string, any>, where: FilterQuery<LogRawData | any>): boolean | FilterQuery<LogRawData | any> {
  let passed = true;
  for (const [key, value] of Object.entries(where)) {
    const isOp = isOperator(key);
    // Se a condição for um objeto realiza a operação pra cada item
    if (isPlainObject(value)) {
      // Se a chave for um operador, então executa a lista de operações informadas
      if (isOp) {
        if (key === ('$not' as QueryOperator)) {
          passed &&= !testJsonWhere(line, value) as boolean;
        } else {
          passed &&= testJsonWhere(line, value) as boolean;
        }
      }
      // se a chave não for um operado, então deve verificar a próxima propriedade
      else if (line[key]) {
        passed &&= testJsonWhere(line[key], value) as boolean;
      }
      // se não tiver a próxima propriedade, então falhou
      else {
        passed = false;
      }
    }
    // Se foi informado o operador, realiza a operação informada
    else if (isOp) {
      passed &&= processOperator(line, key as QueryOperator, value);
    }
    // Se não foi informado a operação, realiza uma operação de igualdade
    else {
      passed &&= processOperator(line[key], '$eq', value);
    }
    if (!passed) return false;
  }

  return passed;
}

export function testPlainWhere(line: string, where: string | string[]): boolean | FilterQuery<LogRawData | any> {
  let passed = true;
  for (const value of isArray(where) ? where : [where]) {
    passed &&= processOperator(value, '$in', line);
  }

  return passed;
}
