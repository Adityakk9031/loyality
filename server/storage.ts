import { type IssuePointsRequest } from "@shared/schema";

export interface IStorage {
  // Add any storage methods if needed in the future
  // For now, we are just interacting with the blockchain
}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();
