import { IUser } from "./user.model";

export const userMocks: IUser[] = [
  {
    id: crypto.randomUUID(),
    name: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    createdIn: new Date(),
    updatedIn: new Date(),
    status: "active"
  },
  {
    id: crypto.randomUUID(),
    name: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    createdIn: new Date(),
    updatedIn: new Date(),
    status: "active"
  },
  {
    id: crypto.randomUUID(),
    name: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@example.com",
    createdIn: new Date(),
    updatedIn: new Date(),
    status: "inactive"
  },
  {
    id: crypto.randomUUID(),
    name: "Bob",
    lastName: "Brown",
    email: "bob.brown@example.com",
    createdIn: new Date(),
    updatedIn: new Date(),
    status: "active"
  },
  {
    id: crypto.randomUUID(),
    name: "Charlie",
    lastName: "Davis",
    email: "charlie.davis@example.com",
    createdIn: new Date(),
    updatedIn: new Date(),
    status: "inactive"
  }
];