export interface UserData {
  uid: string;
  name: string;
  document: string;
  phone: string;
  email: string;
  role: string;
  state: 'active' | 'inactive';
}