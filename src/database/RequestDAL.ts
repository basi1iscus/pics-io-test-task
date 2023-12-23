import mongodb from 'mongodb';

import databaseFactory from './DatabaseFactory';
import { Request, Response } from 'express';

export class RequesrtDAL {
  collection: mongodb.Collection;

  constructor() {
    this.collection = databaseFactory.database.collection('requests');
  }

  async createRequest(
    date: Date,
    request: Record<string, any>,
    response: Record<string, any>
  ) {
    try {
      const req = await this.collection.insertOne({
        date,
        request,
        response,
      });
      return { _id: req.insertedId };
    } catch (error: any) {
      throw new Error(
        typeof error === 'object' && error ? error.errmsg : 'Unknown error'
      );
    }
  }
}
