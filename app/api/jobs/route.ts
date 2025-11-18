import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/prisma/db';
import { uuidv7 } from 'uuidv7';
import { jobsBackendSchema } from '@/validations/jobs';
import { checkSessionToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = await checkSessionToken(req);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (user?.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const safeParse = jobsBackendSchema.safeParse(body);

    if (!safeParse.success) {
      const firstError = safeParse.error?.issues?.[0]?.message;

      return NextResponse.json({ message: firstError }, { status: 400 });
    }

    const {
      salary_min,
      salary_max,
      job_name,
      job_type,
      job_description,
      number_candidates,
      company,
      location,
      profile_config,
      status = 'active',
    } = body;

    const existingJob = await db.job.findFirst({
      where: {
        job_name,
        company,
        location,
        job_type,
      },
    });

    if (existingJob) {
      return NextResponse.json(
        {
          message:
            'Job (same name, company, location, and type) already exists',
        },
        { status: 400 }
      );
    }

    // Create ProfileConfiguration first
    const profileConfigId = uuidv7();
    await db.profileConfiguration.create({
      data: {
        id: profileConfigId,
        full_name: 'mandatory',
        email: 'mandatory',
        photo_profile: 'mandatory',
        gender: profile_config?.gender || 'optional',
        domicile: profile_config?.domicile || 'optional',
        phone: profile_config?.phone || 'optional',
        linkedin: profile_config?.linkedin || 'optional',
        birth: profile_config?.birth || 'optional',
      },
    });

    // Create Job with reference to ProfileConfiguration
    const job = await db.job.create({
      data: {
        id: uuidv7(),
        salary_min,
        salary_max,
        job_name,
        job_type,
        job_description,
        number_candidates,
        company,
        location,
        status,
        profile_config_id: profileConfigId,
      },
    });

    return NextResponse.json(
      { job, message: 'Job created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const user = await checkSessionToken(req);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const sortOrder = searchParams.get('sort') === 'asc' ? 'asc' : 'desc';
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      db.job.findMany({
        skip,
        take: limit,
        where: {
          OR: [
            { job_name: { contains: search, mode: 'insensitive' } },
            { company: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } },
          ],
        },
        orderBy: { created_date: sortOrder },
        select: {
          id: true,
          salary_min: true,
          salary_max: true,
          job_name: true,
          job_type: true,
          job_description: true,
          number_candidates: true,
          company: true,
          location: true,
          status: true,
          created_date: true,

          applicants: {
            where: { user_id: user?.id },
            select: { id: true },
          },
        },
      }),
      db.job.count(),
    ]);

    const formattedJobs = jobs.map((job) => ({
      ...job,
      has_applied: job.applicants.length > 0,
      applicants: undefined, // remove raw applicant data
    }));

    const meta = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return NextResponse.json({ data: formattedJobs, meta });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
