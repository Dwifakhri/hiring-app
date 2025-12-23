import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { uuidv7 } from 'uuidv7';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Password123!', 10);

  // Admin user
  await prisma.user.upsert({
    where: { email: 'admin@mail.com' },
    update: {},
    create: {
      id: uuidv7(),
      role: 'admin',
      email: 'admin@mail.com',
      full_name: 'admin',
      password,
      phone: null,
      birth: null,
      domicile: null,
      country: null,
      country_code: null,
      gender: null,
      linkedin: null,
    },
  });

  // Candidate user
  await prisma.user.upsert({
    where: { email: 'candidate@mail.com' },
    update: {},
    create: {
      id: uuidv7(),
      role: 'candidate',
      email: 'candidate@mail.com',
      full_name: 'candidate',
      password,
      phone: null,
      birth: null,
      domicile: null,
      country: null,
      country_code: null,
      gender: null,
      linkedin: null,
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
