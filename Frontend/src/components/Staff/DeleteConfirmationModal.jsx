import React from 'react';
import { AlertCircle } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, staffName, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-75 backdrop-blur-sm backdrop-brightness-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto">
        <h3 className="text-lg font-bold mb-4 flex items-center text-red-600">
          <AlertCircle className="mr-2" size={24} />
          Confirm Deletion
        </h3>
        <p className="mb-6">
          Are you sure you want to delete <span className="font-semibold">{staffName}</span>?
          This action cannot be undone.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex justify-center items-center"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
