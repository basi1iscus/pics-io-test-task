import vm from 'node:vm';

import { sendToDestination } from './destinations';
import logger from '../helpers/LoggerFactory';

const DEFAULT_STRATEGY = 'ANY';

enum Startegy {
  ANY = 'ANY',
  ALL = 'ALL',
}

type Destination = Record<string, boolean>;

export class EventsService {
  #runScriptInSandbox(
    strategyScript: string,
    possibleDestinations: Destination[]
  ) {
    const RUN_OPTIONS = { timeout: 1000, displayErrors: true };

    const sandbox = {};
    const code = `'use strict';\n${strategyScript}`;
    const context = vm.createContext(Object.freeze({ ...sandbox }));
    try {
      const func = vm.runInContext(code, context, RUN_OPTIONS);
      const result = func(possibleDestinations);
      if (typeof result !== 'boolean') {
        logger.error('Inccorect custom strategy function', strategyScript);
        return false;
      }
      return result;
    } catch (e) {
      logger.error('Inccorect custom strategy function', strategyScript);
    }
    return false;
  }

  #destinationCheck(
    possibleDestinations: Destination[],
    destinationFlag: boolean[],
    strategy: Startegy | string
  ) {
    switch (strategy) {
      case Startegy.ANY:
        return destinationFlag.some((item) => item);
      case Startegy.ALL:
        return destinationFlag.every((item) => item);
      default:
        return this.#runScriptInSandbox(strategy, possibleDestinations);
    }
  }

  async handleEvent(
    payload: any,
    possibleDestinations: Destination[],
    strategy: Startegy | string = DEFAULT_STRATEGY
  ) {
    const destinationsMap = possibleDestinations.reduce(
      (acc: Record<string, boolean[]>, item) => {
        Object.keys(item).forEach((destination) => {
          if (typeof acc[destination] === 'undefined') {
            acc[destination] = [item[destination]];
          } else {
            acc[destination].push(item[destination]);
          }
        });
        return acc;
      },
      {}
    );

    const result: Record<string, boolean> = {};
    for (const destinationName in destinationsMap) {
      if (
        this.#destinationCheck(
          possibleDestinations,
          destinationsMap[destinationName],
          strategy
        )
      ) {
        result[destinationName] = sendToDestination(payload, destinationName);
      } else {
        result[destinationName] = false;
      }
    }

    return result;
  }
}
