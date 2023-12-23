import { Request, Response, NextFunction } from 'express';
import { RequesrtDAL } from '../../database/RequestDAL';

const requestKeys = ['method', 'url', 'body'];
const responseKeys = ['statusCode', 'body'];

export const addRequestToLog = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const send = res.send;
  res.send = (body) => {
    new RequesrtDAL().createRequest(
      new Date(),
      Object.fromEntries(requestKeys.map((key) => [key, req[key]])),
      Object.fromEntries([
        ...responseKeys.map((key) => [key, res[key]]),
        ['body', body],
      ])
    );
    res.send = send;
    return res.send(body);
  };
  next();
};
