import { DefaultSession } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      full_name: string;
      role: string;
      phone: string | null;
      birth: string | null;
      domicile: string | null;
      country: string | null;
      country_code: string | null;
      gender: string | null;
      linkedin: string | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    email: string;
    sub: string;
    user: {
      id: string;
      role: string;
      email: string;
      full_name: string;
      phone: string | null;
      birth: string | null;
      domicile: string | null;
      country: string | null;
      country_code: string | null;
      gender: string | null;
      linkedin: string | null;
    };
    iat: number;
    exp: number;
    jti: string;
  }
}
