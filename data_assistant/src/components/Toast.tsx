import { Info } from "lucide-react";

type ToastProps = {
  message: string;
  onClose: () => void;
};

export function Toast({ message, onClose }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed right-6 top-6 z-50 flex max-w-sm items-center gap-3 border border-[#E0E6EE] bg-white px-4 py-3 text-sm shadow-[0_14px_34px_rgba(35,43,55,0.12)] [border-radius:8px]">
      <Info className="h-4 w-4 text-[#1B84B7]" />
      <span>{message}</span>
      <button
        className="ml-auto text-[#7D8999] hover:text-[#27313F]"
        onClick={onClose}
        type="button"
      >
        Close
      </button>
    </div>
  );
}
