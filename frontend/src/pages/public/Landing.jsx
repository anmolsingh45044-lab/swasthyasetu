import React from 'react';
import { Link } from 'react-router-dom';
import {
  Droplet,
  BedDouble,
  Wind,
  Building2,
  Pill,
  Compass,
  HeartHandshake,
  Search,
  MapPinned,
  Send,
  CheckCircle2,
  Clock3
} from 'lucide-react';

const resourceCards = [
  { icon: Droplet, title: 'Blood', desc: 'Available blood units and blood requests, matched by group and location.' },
  { icon: BedDouble, title: 'Beds', desc: 'Find available hospital beds by type — General, ICU, Emergency and more.' },
  { icon: Wind, title: 'Oxygen', desc: 'Locate oxygen cylinder availability at nearby facilities.' },
  { icon: Building2, title: 'Hospitals', desc: 'Discover nearby facilities suited to the care you need.' },
  { icon: Pill, title: 'Diagnostics & Medicines', desc: 'Check availability where supported by the facility.' },
  { icon: Compass, title: 'Smart Navigation', desc: 'Find the nearest suitable facility based on distance and availability.' },
  { icon: HeartHandshake, title: 'Care Continuity', desc: 'Track requests and follow-up so care doesn\u2019t fall through the cracks.' }
];

const steps = [
  { icon: Search, title: 'Check Availability', desc: 'Search blood, beds or oxygen near you.' },
  { icon: MapPinned, title: 'Find Nearby Facility', desc: 'See the closest suitable facility with live inventory.' },
  { icon: Send, title: 'Request & Connect', desc: 'Send a request directly to the facility or a donor.' },
  { icon: CheckCircle2, title: 'Confirmation', desc: 'Get confirmed and matched with a resource.' },
  { icon: Clock3, title: 'Timely Care', desc: 'Track delivery and follow-up until care is complete.' }
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface to-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="mb-4 text-sm font-semibold text-rose-500">Smart India Hackathon 2026</p>
            <h1 className="font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
              Right Care. <span className="text-rose-500">Right Place.</span> Right Time.
            </h1>
            <p className="mt-5 max-w-md text-ink/60">
              One connected platform to discover healthcare resources, find suitable facilities, request critical
              support and track care — built for rural and underserved communities.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <Link to="/blood" className="btn-primary">
                <Droplet size={16} /> Find Blood
              </Link>
              <Link to="/beds" className="btn-secondary">
                <BedDouble size={16} /> Find Beds
              </Link>
              <Link to="/oxygen" className="btn-secondary">
                <Wind size={16} /> Find Oxygen
              </Link>
              <Link to="/facilities" className="btn-secondary">
                <Building2 size={16} /> Explore Facilities
              </Link>
            </div>
          </div>

          {/* Illustrative dashboard mockup instead of a stock image */}
          <div className="relative">
            <div className="card rotate-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">Live snapshot · demo</p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-mist py-4">
                  <Droplet className="mx-auto mb-1 text-rose-500" size={18} />
                  <p className="text-xl font-semibold">312</p>
                  <p className="text-xs text-ink/50">Blood units</p>
                </div>
                <div className="rounded-xl bg-mist py-4">
                  <BedDouble className="mx-auto mb-1 text-rose-500" size={18} />
                  <p className="text-xl font-semibold">148</p>
                  <p className="text-xs text-ink/50">Beds free</p>
                </div>
                <div className="rounded-xl bg-mist py-4">
                  <Wind className="mx-auto mb-1 text-rose-500" size={18} />
                  <p className="text-xl font-semibold">96</p>
                  <p className="text-xs text-ink/50">O₂ cylinders</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-black/5 px-4 py-2.5 text-sm">
                  <span>District General Hospital</span>
                  <span className="text-xs font-medium text-rose-500">2.1 km</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-black/5 px-4 py-2.5 text-sm">
                  <span>Metro Care Multispeciality</span>
                  <span className="text-xs font-medium text-rose-500">4.6 km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Everything connected */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-10 max-w-xl">
          <h2 className="text-3xl font-semibold">Everything you need, connected</h2>
          <p className="mt-2 text-ink/60">
            Swasthya Setu unifies the resources that matter most in an emergency into one searchable layer.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resourceCards.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-sm text-ink/60">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="mb-12 text-center text-3xl font-semibold">How it works</h2>
          <div className="grid gap-8 md:grid-cols-5">
            {steps.map(({ icon: Icon, title, desc }, idx) => (
              <div key={title} className="relative text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-rose-500 shadow-soft">
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-sm text-ink/60">{desc}</p>
                {idx < steps.length - 1 && (
                  <div className="absolute right-[-1rem] top-7 hidden h-px w-8 bg-rose-200 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20 text-center">
        <h2 className="text-3xl font-semibold">Get connected to care, right now</h2>
        <p className="mx-auto mt-2 max-w-md text-ink/60">
          Create an account to request resources, track your care, or become a donor.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/register" className="btn-primary">
            Get Started
          </Link>
          <Link to="/login" className="btn-secondary">
            Login
          </Link>
        </div>
      </section>
    </div>
  );
}
