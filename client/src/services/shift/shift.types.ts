export type Shift = {
  id: string;
  tenantId: string;
  name: string;
  shiftStart: Date;
  shiftEnd: Date;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    users: number;
  };
};

export type CreateShiftPayload = {
  tenantId: string;
  name: string;
  shiftStart: string;
  shiftEnd: string;
};

export type UpdateShiftPayload = {
  name?: string;
  shiftStart?: string;
  shiftEnd?: string;
};
