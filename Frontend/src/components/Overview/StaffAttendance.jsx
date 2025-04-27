import React from 'react';

const staffToday = [
  { id: 1, name: "Sara Benali", role: "Coach", present: true },
  { id: 2, name: "Omar Hachem", role: "Coach", present: false },
  { id: 3, name: "Lina Sassi", role: "Secretary", present: true },
  { id: 4, name: "Rami Toumi", role: "Secretary", present: false },
];

const roleColors = {
  Coach: "bg-blue-100 text-blue-700",
  Secretary: "bg-emerald-100 text-emerald-700"
};

const StaffAttendance = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 min-w-[180px] max-w-xs">
      <h2 className="text-lg font-bold text-gray-800 mb-3 tracking-tight">Staff Attendance</h2>
      <div className="flex flex-col gap-3">
        {staffToday.map(staff => (
          <div key={staff.id} className="flex items-center gap-3 bg-gray-100 rounded-lg border border-gray-100 p-3">
            <span className="block text-base font-medium text-gray-900 min-w-[90px]">{staff.name}</span>
            <div className="flex flex-col items-end gap-1 ml-auto">
              <div className={`px-2 py-1 rounded text-xs font-semibold border ${roleColors[staff.role]} border-opacity-30 border-gray-300 w-20 text-center`}>
                {staff.role}
              </div>
              {staff.present ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold border border-green-200">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  Present
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold border border-red-200">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  Absent
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StaffAttendance;
