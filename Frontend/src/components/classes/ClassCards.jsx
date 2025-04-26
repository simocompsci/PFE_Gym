import React from "react";
import { User, Users, Info, Clock, Users2 } from "lucide-react";

// Dummy data for demonstration; replace with API data later
const classData = [
  {
    id: 1,
    name: "Yoga Flow",
    description: "A relaxing yoga class for all levels.",
    coach: "Sarah Lee",
    max_capacity: 20,
    duration_minutes: 60,
    color_code: "#f9e79f",
  },
  {
    id: 2,
    name: "HIIT Blast",
    description: "High-intensity interval training to get your heart pumping!",
    coach: "Mike Tyson",
    max_capacity: 15,
    duration_minutes: 45,
    color_code: "#fad7a0",
  },
  {
    id: 3,
    name: "Pilates Core",
    description: "Strengthen your core and improve flexibility.",
    coach: "Anna Smith",
    max_capacity: 18,
    duration_minutes: 50,
    color_code: "#b7e3fa",
  },
];

const statusColors = [
  { label: "Active", color: "bg-green-100 text-green-700" },
  { label: "Inactive", color: "bg-gray-100 text-gray-500" },
];

const ClassCards = ({ classes = classData }) => {
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-6 justify-start">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="rounded-2xl shadow-lg bg-white border border-gray-100 p-6 max-w-xs min-w-[320px] flex flex-col gap-3 relative"
            style={{ borderTop: `6px solid ${cls.color_code || '#e5e7eb'}` }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                style={{ background: cls.color_code || '#e5e7eb', color: '#222' }}
              >
                {cls.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="font-semibold text-lg text-gray-900">{cls.name}</div>
                <div className="text-xs text-gray-500">Coach: <span className="font-medium text-gray-700">{cls.coach}</span></div>
              </div>
            </div>
            <div className="text-sm text-gray-700 mb-2 min-h-[40px]">{cls.description}</div>
            <div className="flex flex-col gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Users2 size={16} className="text-gray-400" />
                Max Capacity: <span className="font-semibold text-gray-800 ml-1">{cls.max_capacity}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock size={16} className="text-gray-400" />
                Duration: <span className="font-semibold text-gray-800 ml-1">{cls.duration_minutes} min</span>
              </div>
            </div>
            {/* Status badge (optional) */}
            {/* <div className="absolute top-4 right-4 text-xs px-2 py-1 rounded-lg bg-green-100 text-green-700 font-semibold">Active</div> */}
            <button className="mt-2 w-full bg-black text-white rounded-lg py-2 hover:bg-gray-800 transition">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassCards;
