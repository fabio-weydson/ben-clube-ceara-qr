export interface Member {
  id: string;
  contract_number: number;
  full_name: string;
  cpf_dni: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  district: string;
  city: string;
  state: string;
  birth_date: string;
  join_date: string;
  expiration_date: string;
  status: "active" | "inactive" | "pending" | "expired";
  owner_id: string;
  member_type: string;
  profession: string;
  agent: string;
  created_at: string;
  updated_at: string;
  referral?: string | null;
}

export interface NewMember
  extends Omit<
    Member,
    "id" | "created_at" | "updated_at" | "owner_id" | "status"
  > {}

export interface Affiliate
  extends Omit<
    NewMember,
    | "id"
    | "owner_id"
    | "created_at"
    | "updated_at"
    | "address"
    | "district"
    | "city"
    | "state"
    | "postal_code"
    | "birth_date"
    | "expiration_date"
    | "join_date"
    | "status"
    | "profession"
    | "referral"
    | "agent"
  > {}

export interface MemberWithAffiliates extends Member {
  affiliates: Member[];
  isExpanded?: boolean;
}
