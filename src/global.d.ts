declare namespace NodeJS {
    interface Global {
      _mongoClientPromise: Promise<import('mongodb').MongoClient>;
    }
  }