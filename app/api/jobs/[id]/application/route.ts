import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/prisma/db';
import { uuidv7 } from 'uuidv7';
import { checkSessionToken } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkSessionToken(req);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (user?.role !== 'candidate') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const jobId = (await params).id;
    const body = await req.json();
    const job = await db.job.findFirst({
      where: { id: jobId },
      include: { profile_config: true },
    });

    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    const config = job.profile_config;

    // Validate mandatory fields
    const configMap = {
      full_name: config.full_name,
      email: config.email,
      photo_profile: config.photo_profile,
      gender: config.gender,
      domicile: config.domicile,
      phone: config.phone,
      linkedin: config.linkedin,
      birth: config.birth,
    };

    for (const [key, requirement] of Object.entries(configMap)) {
      if (requirement === 'mandatory' && !body[key]) {
        return NextResponse.json(
          { message: `${key} is required` },
          { status: 400 }
        );
      }
    }

    const existed = await db.jobApplication.findFirst({
      where: {
        job_id: jobId,
        user_id: user.id,
      },
    });

    if (existed) {
      return NextResponse.json({ message: 'Already applied' }, { status: 400 });
    }

    await db.$transaction(async (tx) => {
      const application = await tx.jobApplication.create({
        data: {
          id: uuidv7(),
          job_id: jobId,
          user_id: user.id,
        },
      });

      await tx.jobApplicationAnswer.create({
        data: {
          id: uuidv7(),
          application_id: application.id,
          email: body.email,
          full_name: body.full_name,
          photo_profile:
            'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png',
          gender: body.gender,
          domicile: body.domicile,
          birth: new Date(body.birth),
          country_code: body.country_code,
          phone: body.phone,
          linkedin: body.linkedin,
        },
      });
    });

    return NextResponse.json(
      { message: 'Your application was sent!' },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
