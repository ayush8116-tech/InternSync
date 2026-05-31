"use client";

interface Props {
  title: string;
  toastKey: number;
  onUndo: () => void;
}

export default function UndoToast({ title, toastKey, onUndo }: Props) {
  return (
    <div
      className="bg-slate-900 rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
    >
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-white">Post deleted</p>
          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{title}</p>
        </div>
        <button
          onClick={onUndo}
          className="ml-6 text-sm font-bold px-4 py-2 rounded-xl transition-all flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #6366F1 0%, #A855F7 100%)",
            color: "white",
          }}
        >
          Undo
        </button>
      </div>

      {/* Progress bar — grows left → right over 10s */}
      <div className="h-0.5 bg-slate-700 w-full">
        <div
          key={toastKey}
          className="h-full"
          style={{
            background: "linear-gradient(90deg, #6366F1, #A855F7)",
            animation: "undoProgress 10s linear forwards",
          }}
        />
      </div>

      <style>{`
        @keyframes undoProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
