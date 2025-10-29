import { UserRole } from '@/database/userService';
import { DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

interface User extends DefaultUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone: string;
  birth: string;
  domicile: string;
  country: string;
  country_code: string;
  gender: string;
  linkedin: string;
}

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    phone: string;
    birth: string;
    domicile: string;
    country: string;
    country_code: string;
    gender: string;
    linkedin: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      full_name: string;
      role: UserRole;
      phone: string;
      birth: string;
      domicile: string;
      country: string;
      country_code: string;
      gender: string;
      linkedin: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    user?: {
      id: string;
      email: string;
      full_name: string;
      role: UserRole;
      phone: string;
      birth: string;
      domicile: string;
      country: string;
      country_code: string;
      gender: string;
      linkedin: string;
    };
  }
}
