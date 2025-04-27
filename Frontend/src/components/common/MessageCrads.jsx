import { motion } from "framer-motion";

const MessageCards = ({ type, icon: Icon, color, quote, author, eventTitle, eventTime, eventType }) => {
  return (
    <motion.div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[110px] flex flex-col justify-center"
      whileHover={{ y: -3 }}
    >
      <div className="px-5 py-5 flex flex-col gap-2">
        {/* Motivational Quote Card */}
        {type === 'quote' && (
          <>
            <div className="flex items-center mb-1">
              {Icon && <Icon size={20} className="mr-2" style={{ color }} />}
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Today's Quote</span>
            </div>
            <blockquote className="text-sm text-gray-800 italic leading-snug">“{quote}”</blockquote>
            <span className="text-xs text-gray-500 font-medium mt-1 text-right">— {author}</span>
          </>
        )}
        {/* Today's Event Card */}
        {type === 'event' && (
          <>
            <div className="flex items-center mb-1">
              {Icon && <Icon size={20} className="mr-2" style={{ color }} />}
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Today's {eventType}</span>
            </div>
            <span className="text-base font-semibold text-gray-800">{eventTitle || 'No {eventType} today.'}</span>
            {eventTime && <span className="text-xs text-gray-500">at {eventTime}</span>}
          </>
        )}
      </div>
    </motion.div>
  );
};
export default MessageCards;