import React from 'react';
import CountUp from 'react-countup';

const stats = [
  { label: 'Years of Excellence', value: new Date().getFullYear() - 2016, suffix: '+' },
  { label: 'Students Enrolled', value: 500, suffix: '+' },
  { label: 'Dedicated Teachers', value: 40, suffix: '+' },
  { label: 'Graduates', value: 1000, suffix: '+' },
];

const StatItem = ({ label, value, suffix }) => (
  <div className="text-center">
    <p className="text-4xl sm:text-5xl font-black text-primary">
      <CountUp end={value} duration={3} enableScrollSpy scrollSpyOnce />
      {suffix}
    </p>
    <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-text-light">
      {label}
    </p>
  </div>
);

export default function StatsBanner() {
  return (
    <section className="bg-background-alt py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map(stat => (
            <StatItem
              key={stat.label}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
            />
          ))}
        </div>
      </div>
    </section>
  );
}