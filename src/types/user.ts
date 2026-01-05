export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "SALES_REP" | "MANAGER";
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}
