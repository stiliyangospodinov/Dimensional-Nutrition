export interface User {
  id?: string; // Опционален идентификатор на потребителя
  email: string;
  tel: string;
  username: string;
  password: string;
  rePassword: string;
}