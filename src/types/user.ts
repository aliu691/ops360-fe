export interface User {
  id: number;

  firstName: string;
  lastName: string;
  email: string;

  department: string;
  yearlyTarget: number;

  authRole: "USER";
  status: "ACTIVE" | "INACTIVE";

  createdAt: string;
}
