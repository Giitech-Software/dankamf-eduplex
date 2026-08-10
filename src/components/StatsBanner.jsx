import React from 'react';
import CountUp from 'react-countup';

const stats = [
  { label: 'Years of Excellence', value: new Date().getFullYear() - 2016, suffix: '+' },
  { label: 'Students Enrolled', value: 500, suffix: '+' },
  { label: 'Dedicated Staff', value: 30, suffix: '+' },
  { label: 'Graduates', value: 1000, suffix: '+' },
];

const StatItem = ({ label, value, suffix }) => (
  <div className="group rounded-2xl border border-white/25 bg-white/10 px-3 py-5 text-center shadow-xl shadow-[#001b36]/20 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:bg-white/15 sm:px-5">
    <p className="text-4xl font-black text-white drop-shadow-sm sm:text-5xl">
      <CountUp end={value} duration={3} enableScrollSpy scrollSpyOnce />
      {suffix}
    </p>
    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-sky-100 sm:text-xs sm:tracking-wider">
      {label}
    </p>
  </div>
);

export default function StatsBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#001b36] via-[#003153] to-[#007BA7] py-12 sm:py-16">
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#7DF9FF]/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
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
