import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function FacilityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      
      <button
        onClick={() => navigate('/facilities')}
        className="mb-6 text-sm font-medium text-rose-500"
      >
        ← Back to Facilities
      </button>

      <div className="card">
        <h1 className="text-3xl font-semibold text-ink">
          Hospital Details
        </h1>

        <p className="mt-2 text-ink/60">
          Facility ID: {id}
        </p>

        <div className="mt-6">
          <p>
            Hospital details will be loaded here.
          </p>
        </div>
      </div>

    </div>
  );
}