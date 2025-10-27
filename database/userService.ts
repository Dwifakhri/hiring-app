import fs from 'fs';
import path from 'path';

// Types
export type UserRole = 'admin' | 'applicant';

export type User = {
  role: UserRole;
  full_name: string;
  email: string;
  phone: string;
  birth: string;
  domicile: string;
  country: string;
  country_code: string;
  gender: string;
  linkedin: string;
  password: string;
};

export type UserDB = Record<string, User>;

// Path to JSON database (Next.js compatible)
const dbPath = path.join(process.cwd(), 'database', 'users.json');

// Load JSON database
function loadDB(): UserDB {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data) as UserDB;
}

// User service
export const UserService = {
  getUserById(id: string): User | null {
    const db = loadDB();
    return db[id] || null;
  },

  getUserByEmailAndPassword(
    email: string,
    password: string
  ): (Omit<User, 'password'> & { id: string }) | null {
    const db = loadDB(); // Load JSON-based dummy DB

    // Find user entry by matching email + password
    const entry = Object.entries(db).find(
      ([, user]) => user.email === email && user.password === password
    );

    if (!entry) return null;

    const [id, user] = entry;

    // Remove password before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    // Return user with its ID attached
    return { id, ...userWithoutPassword };
  },
};
