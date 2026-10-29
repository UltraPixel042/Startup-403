import { DiscoverExperience } from '@/components/discovery/DiscoverExperience';
import { listCafePresentations } from '@/src/server/cafe-repository';

export const dynamic = 'force-dynamic';

export default async function DiscoverPage() {
  const cafes = await listCafePresentations();
  return <DiscoverExperience cafes={cafes} />;
}
