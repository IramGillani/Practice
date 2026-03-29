import { Button } from "./ui/button";
export const DeleteModal = ({ taskText, onConfirm, onCancel }: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white p-6 rounded-xl shadow-xl max-w-xs w-full">
      <h3 className="font-bold text-lg">Delete Task?</h3>
      <p className="text-sm text-gray-500 mt-1">"{taskText}"</p>
      <div className="flex gap-3 mt-6">
        <Button
          variant="outline"
          className="flex-1 px-1 py-4"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          className="flex-1 px-1 py-4"
          onClick={onConfirm}
        >
          Delete
        </Button>
      </div>
    </div>
  </div>
);
