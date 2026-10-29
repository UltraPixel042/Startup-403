import { FieldNoteExperience } from '@/components/discovery/FieldNoteExperience';
import { listCafePresentations } from '@/src/server/cafe-repository';

export const dynamic = 'force-dynamic';

export default async function FieldNotesPage() {
  const cafes = await listCafePresentations();
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <FieldNoteExperience cafes={cafes} />
    </main>
  );
}
