import React from 'react';

interface TastingNoteCardProps {
  title: string;
  icon: React.ElementType;
  description: string;
  metrics: string[];
}

export function TastingNoteCard({ title, icon: Icon, description, metrics }: TastingNoteCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-ambrosia-pink/50 transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-ambrosia-pink/20 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-ambrosia-pink" />
      </div>
      <h3 className="font-heading text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/60 text-sm mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {metrics.map((metric) => (
          <span key={metric} className="px-2 py-1 bg-white/10 text-white/70 rounded text-xs font-manrope border border-white/10">
            {metric}
          </span>
        ))}
      </div>
    </div>
  );
}
