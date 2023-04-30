export interface UserData {
  username: string;
  email: string;
  token: string;
  phone: string;
  avatar?: string;
}

export interface UserRO {
  user: UserData;
}