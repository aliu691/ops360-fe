// types/audit.ts

export type AuditActorUser = {
  type: "USER";
  id: number;
  name: string;
  email: string;
  department: string;
};

export type AuditActorAdmin = {
  type: "ADMIN";
  id: number;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
};

export type AuditActor = AuditActorUser | AuditActorAdmin;

export interface AuditLog {
  id: number;
  actorType: "USER" | "ADMIN";
  actorId: number;

  // optional for safety (old logs / edge cases)
  actor?: AuditActor;

  action: string;
  entity?: string;
  entityId?: number;

  description: string;

  metadata?: Record<string, any>;

  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export interface AuditLogResponse {
  success: true;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  items: AuditLog[];
}
