import React from 'react';
import { Info } from 'lucide-react';
import { DEMO_DATA_NOTE } from '../../constants';

export default function DemoDataNote() {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-mist px-4 py-3 text-xs text-ink/60">
      <Info size={15} className="mt-0.5 shrink-0" />
      <p>{DEMO_DATA_NOTE}</p>
    </div>
  );
}
