'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--md-sys-color-surface-container)] rounded-2xl shadow-2xl border border-[var(--md-sys-color-outline-variant)] animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container)]/95 backdrop-blur">
                    <h2 className="text-xl font-bold text-[var(--md-sys-color-on-surface)]">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-[var(--md-sys-color-surface-container-high)] transition-colors text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div className="p-6 text-[var(--md-sys-color-on-surface-variant)]">
                    {children}
                </div>
                <div className="sticky bottom-0 z-10 px-6 py-4 border-t border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container)]/95 backdrop-blur flex justify-end">
                    <Button onClick={onClose} variant="secondary">
                        Close
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}
