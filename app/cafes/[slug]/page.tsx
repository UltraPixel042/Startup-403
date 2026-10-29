import { notFound } from 'next/navigation';

import { CafeProfileExperience } from '@/components/discovery/CafeProfileExperience';
import { findCafePresentation } from '@/src/server/cafe-repository';

export const dynamic = 'force-dynamic';

export default async function CafeProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cafe = await findCafePresentation(slug);
  if (!cafe) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <CafeProfileExperience cafe={cafe} />
    </main>
  );
}
