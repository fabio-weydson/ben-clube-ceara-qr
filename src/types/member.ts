export interface Member {
  id: string;
  full_name: string;
  cpf_dni: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  birth_date: string | null;
  join_date: string | null;
  expiration_date: string | null;
  status: "active" | "inactive" | "pending" | "expired";
  owner_id: string;
  member_type: string;
  created_at: string;
  updated_at: string;
}
