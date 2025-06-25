export interface UserData {
  uid: string;
  name: string;
  document: string;
  phone: string;
  email: string;
  role: string;
  state: 'active' | 'inactive';
  createdAt: Date;
  creator: { name: string; rol: string };
  updatedAt: Date;
  updater: { name: string; rol: string };
}
