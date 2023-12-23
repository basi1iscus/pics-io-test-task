import logger from '../helpers/LoggerFactory';

//TODO Where should we put the payload when the transport uses GET method?
//TODO What should we do if error occurs?
const httpTransport =
  (method: 'POST' | 'GET' | 'PUT') => (data: any, url: string) => {
    if (!url) {
      logger.error(`Destination URL ${url} not found`);
      return false;
    }

    fetch(url, {
      method,
      body: JSON.stringify(data),
    })
      .then((responce) => responce.text())
      .then((data) => logger.info(data))
      .catch((err) => logger.error(err));
    return true;
  };

export const transports = {
  'http.post': httpTransport('POST'),
  'http.put': httpTransport('PUT'),
  'http.get': httpTransport('GET'),
  'console.log': (data: any) => {
    console.log(data);
    return true;
  },
  'console.warn': (data: any) => {
    console.warn(data);
    return true;
  },
};

export const sendByTransport = (
  payload: any,
  transportName: string,
  url?: string
) => {
  const transport = transports[transportName];
  if (!transport) {
    logger.warn(`Destination ${transportName} not found`);
    return false;
  }

  return transport(payload, url);
};
