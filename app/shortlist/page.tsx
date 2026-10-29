import { ShortlistExperience } from '@/components/discovery/ShortlistExperience';
import { listCafePresentations } from '@/src/server/cafe-repository';

export const dynamic = 'force-dynamic';

export default async function ShortlistPage() {
  const cafes = await listCafePresentations();
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <ShortlistExperience cafes={cafes} />
    </main>
  );
}
