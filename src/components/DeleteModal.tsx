export const DeleteModal = ({ taskText, onConfirm, onCancel }: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white p-6 rounded-xl shadow-xl max-w-xs w-full">
      <h3 className="font-bold text-lg">Delete Task?</h3>
      <p className="text-sm text-gray-500 mt-1">"{taskText}"</p>
      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          className="flex-1 py-2 bg-gray-100 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2 bg-red-600 text-white rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);
