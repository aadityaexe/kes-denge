"use client";

import { Modal } from "./Modal";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
}: ConfirmDialogProps) {
  const displayMessage =
    description || message || "Are you sure you want to delete this item? This action cannot be undone.";
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex flex-col items-center text-center p-2">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center mb-4">
          <AlertTriangle size={24} />
        </div>
        <p className="text-sm text-text-secondary leading-relaxed mb-6">{displayMessage}</p>

        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg border border-[var(--color-border)] text-text-secondary hover:bg-surface-2 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
