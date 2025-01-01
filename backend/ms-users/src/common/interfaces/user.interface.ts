export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  googlePassword: string;
  institution: string;
  /* activationToken: string; */
  color: string;
  type: string;
}
