'use client';

import type { CafePresentation, FieldNoteDraft } from '@/lib/discovery-presentation';
import { FieldNoteForm } from './FieldNoteForm';

interface FieldNoteExperienceProps {
  cafes: CafePresentation[];
}

export function FieldNoteExperience({ cafes }: FieldNoteExperienceProps) {
  async function submitFieldNote(draft: FieldNoteDraft) {
    const response = await fetch('/api/profile-change-requests', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(draft),
    });
    if (!response.ok) throw new Error('Could not submit the field note.');
  }

  return <FieldNoteForm cafes={cafes} onSubmit={submitFieldNote} />;
}
