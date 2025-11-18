import { NextResponse } from 'next/server';
import { db } from '@/prisma/db';
import bcrypt from 'bcryptjs';
import { uuidv7 } from 'uuidv7';
import { registerBackendSchema } from '@/validations/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const safeParse = registerBackendSchema.safeParse(body);

    if (!safeParse.success) {
      const firstError = safeParse.error?.issues?.[0]?.message;

      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    const { email, password, full_name, role } = body;

    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        id: uuidv7(),
        full_name,
        role: role ?? 'candidate',
        email,
        password: hashedPassword,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;
    return NextResponse.json(
      { message: 'User registered successfully', data: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
