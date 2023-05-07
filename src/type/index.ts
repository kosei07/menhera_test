export interface PROFILE_TYPE {
  name: string;
  icon: File | null;
  birthOfDate: string;
  gender: string;
}

export interface USER_TYPE extends PROFILE_TYPE {
  id: string;
}
