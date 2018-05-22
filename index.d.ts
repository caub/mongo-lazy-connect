import { MongoClient, MongoClientOptionsn, Db } from "@types/mongodb";

export default function (uri: string, options: MongoClientOptions): Promise<MongoClient | Db>;
