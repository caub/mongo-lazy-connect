import { MongoClient, MongoClientOptions, Db } from "mongodb";

export default function (uri: string, options: MongoClientOptions): Db;
