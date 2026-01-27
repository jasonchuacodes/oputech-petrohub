export type Tenant = {
  id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  description: string;

  sss?: string;
  tin?: string;
  philhealth?: string;
  pagibig?: string;

  logoUrl?: string;
};

export interface GetTenantUsersFilters {
  searchTerm?: string;
}
