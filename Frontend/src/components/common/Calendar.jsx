import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getMonthMatrix = (year, month) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const matrix = [];
  let week = [];
  let day = new Date(firstDayOfMonth);
  day.setDate(day.getDate() - day.getDay()); // Start from Sunday before the 1st

  for (let i = 0; i < 6 * 7; i++) {
    week.push(new Date(day));
    day.setDate(day.getDate() + 1);
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  return matrix;
};

const initialEvents = [
  {
    title: 'Client Presentation Preparation',
    start: new Date(2024, 5, 24, 8, 0),
    end: new Date(2024, 5, 24, 9, 0),
    color: '#d6b4fa',
  },
  {
    title: 'Client Meeting Planning',
    start: new Date(2024, 5, 24, 9, 0),
    end: new Date(2024, 5, 24, 10, 30),
    color: '#b7e3fa',
  },
  {
    title: 'Design Revisions',
    start: new Date(2024, 5, 25, 9, 0),
    end: new Date(2024, 5, 25, 10, 0),
    color: '#e4d2fa',
  },
  {
    title: 'New Project Kickoff Meeting',
    start: new Date(2024, 5, 25, 8, 0),
    end: new Date(2024, 5, 25, 9, 0),
    color: '#b7e3fa',
  },
  {
    title: 'Meetup with UI8 internal Team',
    start: new Date(2024, 5, 24, 11, 0),
    end: new Date(2024, 5, 24, 12, 0),
    color: '#d2f7e4',
  },
  {
    title: 'Design Team Stand-up Meeting',
    start: new Date(2024, 5, 28, 8, 30),
    end: new Date(2024, 5, 28, 9, 30),
    color: '#b7e3fa',
  },
  // Add more events as needed
];

function formatTime(date) {
  const h = date.getHours();
  const m = date.getMinutes();
  return `${h % 12 === 0 ? 12 : h % 12}:${m.toString().padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

const initialClasses = [
  {
    title: 'Yoga Class',
    start: new Date(2024, 5, 25, 17, 0),
    end: new Date(2024, 5, 25, 18, 0),
    color: '#f9e79f',
    type: 'class',
  },
  {
    title: 'HIIT Group',
    start: new Date(2024, 5, 27, 10, 0),
    end: new Date(2024, 5, 27, 11, 0),
    color: '#fad7a0',
    type: 'class',
  },
];

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  // Helper to filter out past initial events/classes
  const todayDate = new Date();
  todayDate.setHours(0,0,0,0);
  const filteredInitialEvents = initialEvents.filter(ev => ev.end >= todayDate);
  const filteredInitialClasses = initialClasses.filter(cl => cl.end >= todayDate);

  const [events, setEvents] = useState(filteredInitialEvents);
  const [classes, setClasses] = useState(filteredInitialClasses);
  const [showModal, setShowModal] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [form, setForm] = useState({ title: '', startTime: '', endTime: '', color: '#b7e3fa', type: 'event' });

  const monthMatrix = getMonthMatrix(currentYear, currentMonth);

  const handlePrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const openModal = (date) => {
    setModalDate(date);
    setShowModal(true);
    setForm({ title: '', startTime: '', endTime: '', color: '#b7e3fa', type: 'event' });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    const startParts = form.startTime.split(":");
    const endParts = form.endTime.split(":");
    const start = new Date(modalDate);
    start.setHours(parseInt(startParts[0]), parseInt(startParts[1]));
    const end = new Date(modalDate);
    end.setHours(parseInt(endParts[0]), parseInt(endParts[1]));
    if (form.type === 'class') {
      setClasses([
        ...classes,
        { title: form.title, start, end, color: form.color || '#f9e79f', type: 'class' },
      ]);
    } else {
      setEvents([
        ...events,
        { title: form.title, start, end, color: form.color, type: 'event' },
      ]);
    }
    setShowModal(false);
  };

  React.useEffect(() => {
    console.log('classes updated:', classes);
    console.log('events updated:', events);
  }, [classes, events]);


  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-6xl mx-auto my-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="p-2 rounded hover:bg-gray-100">
            <ChevronLeft />
          </button>
          <span className="font-semibold text-lg">{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}</span>
          <button onClick={handleNext} className="p-2 rounded hover:bg-gray-100">
            <ChevronRight />
          </button>
        </div>
        <button
          className="flex items-center gap-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          onClick={() => openModal(today)}
        >
          <Plus size={18} /> Add Event
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {daysOfWeek.map((d) => (
          <div key={d} className="font-medium text-gray-500 pb-2">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 min-h-[420px]">
        {monthMatrix.map((week, i) =>
          week.map((date, j) => {
            const isCurrentMonth = date.getMonth() === currentMonth;
            const isToday = date.toDateString() === today.toDateString();
            const dayEvents = events.filter(
              (ev) =>
                ev.start.toDateString() === date.toDateString()
            );
            const dayClasses = classes.filter(
              (cl) =>
                cl.start.toDateString() === date.toDateString()
            );
            return (
              <div
                key={i + '-' + j}
                className={`relative rounded-lg p-1 min-h-[64px] cursor-pointer transition border ${isCurrentMonth ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'} ${isToday ? 'ring-2 ring-black' : ''}`}
                onClick={() => openModal(date)}
              >
                <div className="text-xs font-semibold text-gray-700 mb-1">{date.getDate()}</div>
                <div className="flex flex-col gap-1">
                  {dayEvents.map((ev, idx) => (
                    <motion.div
                      key={ev.title + idx}
                      className="truncate px-2 py-1 rounded text-xs font-medium shadow"
                      style={{ background: ev.color, color: '#222' }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {ev.title}
                      <div className="text-[10px] text-gray-700 font-normal">
                        {formatTime(ev.start)} - {formatTime(ev.end)}
                      </div>
                    </motion.div>
                  ))}
                  {dayClasses.map((cl, idx) => (
                    <motion.div
                      key={cl.title + idx}
                      className="truncate px-2 py-1 rounded text-xs font-bold shadow border border-yellow-300"
                      style={{ background: cl.color, color: '#7a5a00' }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {cl.title} <span className="ml-1 text-[10px] bg-yellow-200 px-1 rounded">Class</span>
                      <div className="text-[10px] text-gray-700 font-normal">
                        {formatTime(cl.start)} - {formatTime(cl.end)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xs"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="font-bold mb-4">Add Event</h3>
            <form onSubmit={handleAddEvent} className="flex flex-col gap-3">
              <input
                name="title"
                value={form.title}
                onChange={handleFormChange}
                placeholder={form.type === 'class' ? "Class Name" : "Event Title"}
                required
                className="border rounded px-2 py-1"
              />
              <div className="flex gap-2">
                <input
                  name="startTime"
                  type="time"
                  value={form.startTime}
                  onChange={handleFormChange}
                  required
                  className="border rounded px-2 py-1 flex-1"
                />
                <input
                  name="endTime"
                  type="time"
                  value={form.endTime}
                  onChange={handleFormChange}
                  required
                  className="border rounded px-2 py-1 flex-1"
                />
              </div>
              <select
                name="type"
                value={form.type}
                onChange={handleFormChange}
                className="border rounded px-2 py-1"
              >
                <option value="event">Event</option>
                <option value="class">Class</option>
              </select>
              <select
                name="color"
                value={form.color}
                onChange={handleFormChange}
                className="border rounded px-2 py-1"
              >
                <option value="#b7e3fa">Blue</option>
                <option value="#d6b4fa">Purple</option>
                <option value="#d2f7e4">Green</option>
                <option value="#e4d2fa">Lavender</option>
                <option value="#f9e79f">Yellow (Class)</option>
                <option value="#fad7a0">Orange (Class)</option>
              </select>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  className="flex-1 px-3 py-1 rounded border border-gray-300 hover:bg-gray-100"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-1 rounded bg-black text-white hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
