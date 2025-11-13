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
  qr_code_token: string;
  last_qr_validation: string | null;
  created_at: string;
  updated_at: string;
}
