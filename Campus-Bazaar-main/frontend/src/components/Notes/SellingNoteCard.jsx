import React from 'react';
import { motion } from 'framer-motion';


export default function SellingNoteCard({ note, onPurchase, user, isPurchased }) {
  const isOwner = user && note.uploader && (user._id === note.uploader._id || user.email === note.uploader.email);
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition flex flex-col justify-between relative"
    >
      {/* Purchased badge in top-right corner */}
      {isPurchased && (
        <div className="absolute top-2 right-2 z-10">
          <span className="px-3 py-1 text-xs rounded-full bg-green-500 text-white font-bold shadow-lg" title="You have already purchased this note">Purchased</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate flex items-center gap-2">
          {note.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
          {note.description}
        </p>
        <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg mb-2">
          ₹{note.price}
        </p>
      </div>
      <div className="p-4 pt-0 flex items-center justify-between">
        {!isOwner ? (
          isPurchased ? (
            <button
              className="px-5 py-2 rounded-lg bg-gray-400 text-white font-bold w-full cursor-not-allowed opacity-70"
              disabled
              title="You have already purchased this note"
            >
              Purchased
            </button>
          ) : (
            <button
              onClick={onPurchase}
              className="px-5 py-2 rounded-lg bg-green-600 text-white font-bold shadow hover:bg-green-700 transition w-full"
            >
              Purchase
            </button>
          )
        ) : (
          <span className="text-xs text-gray-400">You are the owner</span>
        )}
      </div>
    </motion.div>
  );
}
