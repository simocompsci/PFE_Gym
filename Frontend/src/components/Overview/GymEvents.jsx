import React from 'react';

const mockEvents = [
  {
    id: 1,
    name: "Yoga Masterclass",
    date: "2025-05-01",
    time: "18:00",
    description: "Join our special yoga session with guest instructor Maria.",
    color: "#34d399"
  },
  {
    id: 2,
    name: "HIIT Challenge",
    date: "2025-05-03",
    time: "16:00",
    description: "High-Intensity Interval Training for all levels.",
    color: "#60a5fa"
  },
  {
    id: 3,
    name: "Nutrition Talk",
    date: "2025-05-05",
    time: "19:00",
    description: "Learn about healthy eating habits with our expert.",
    color: "#fbbf24"
  }
];

const GymEvents = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 min-w-[180px] max-w-xs">
      <h2 className="text-lg font-bold text-gray-800 mb-3 tracking-tight">Upcoming Events</h2>
      <div className="flex flex-col gap-3">
        {mockEvents.map(event => (
          <div
            key={event.id}
            className="flex items-center gap-3 bg-gray-100 rounded-lg border border-gray-100 p-3"
          >
            <div className="flex flex-col items-center mr-2">
              <span className="bg-gray-200 text-gray-700 text-xs font-semibold rounded px-2 py-1 mb-1 border border-gray-300">
                {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
              <span className="block w-1 h-8 rounded-full" style={{ background: event.color }}></span>
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-base font-medium text-gray-900 mb-0.5">{event.name}</span>
              <span className="text-xs text-gray-500 mb-0.5">
                {event.time}
              </span>
              <span className="text-xs text-gray-600 leading-tight">{event.description}</span>
            </div>
          </div>
        ))}
        {mockEvents.length === 0 && (
          <div className="text-center text-gray-500 py-8">No upcoming events.</div>
        )}
      </div>
    </div>
  );
}

export default GymEvents;
