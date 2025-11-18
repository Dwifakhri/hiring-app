import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/prisma/db';
import { checkSessionToken } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await checkSessionToken(req);

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const job = await db.job.findUnique({
      where: { id },
      include: {
        profile_config: true,
        applicants: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    //  Check if current user has applied
    const alreadyApplied = await db.jobApplication.findFirst({
      where: {
        job_id: id,
        user_id: user.id,
      },
    });

    // Base response structure
    const responseData = {
      ...job,
      has_applied: Boolean(alreadyApplied),
    };

    if (user.role !== 'admin') {
      return NextResponse.json(
        { ...responseData, applicants: [] },
        { status: 200 }
      );
    }

    const flattened = {
      ...job,
      applicants: job.applicants.flatMap((app) => app.answers),
    };

    return NextResponse.json(flattened, { status: 200 });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
