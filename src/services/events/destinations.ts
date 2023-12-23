import { sendByTransport } from './transports';
import logger from '../helpers/LoggerFactory';

export const destinations = [
  {
    // destination unique name, matches `possibleDestinations` property names
    name: 'destination1',
    // transport type
    transport: 'http.post',
    // address to send payload to if http.* transport in use
    url: 'https://echo.free.beeceptor.com',
  },
  {
    // destination unique name, matches `possibleDestinations` property names
    name: 'destination2',
    // transport type
    transport: 'http.put',
    // address to send payload to if http.* transport in use
    url: 'https://echo.free.beeceptor.com',
  },
  {
    // destination unique name, matches `possibleDestinations` property names
    name: 'destination3',
    // transport type
    transport: 'console.log',
  },
  {
    // destination unique name, matches `possibleDestinations` property names
    name: 'destination4',
    // transport type
    transport: 'console.warn',
  },
];

export const sendToDestination = (payload: any, destinationName: string) => {
  const destination = destinations.find(
    (destination) => destination.name === destinationName
  );
  if (!destination) {
    logger.warn(`Destination ${destinationName} not found`);

    return false;
  }
  return sendByTransport(payload, destination.transport, destination.url);
};
