'use client';

import { cn } from '@/lib/utils';
import { Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import React, { type MouseEvent, memo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  title?: string;
  isOpen: boolean;
  center?: boolean;
  className?: string;
  onDismiss?: () => void;
  children?: React.ReactNode;
  size?: 'small' | 'normal' | 'large' | 'xlarge';
  showClose?: boolean;
}

const sizeClasses = {
  small: 'w-96 max-w-sm',
  normal: 'w-[560px] max-w-lg',
  large: 'w-[700px] max-w-2xl',
  xlarge: 'w-[900px] max-w-4xl',
};

function Modal({
  title,
  isOpen,
  center = true,
  size = 'normal',
  className,
  onDismiss,
  children,
  showClose = true,
}: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      if (!onDismiss) return;
      if (ref.current && !ref.current.contains(event.target as Element)) {
        onDismiss();
      }
    },
    [onDismiss]
  );

  const wrapperClasses = cn(
    'fixed flex flex-col items-center inset-0 z-50 bg-black/50 backdrop-blur-sm',
    {
      'justify-center': center,
      'justify-start pt-20': !center,
    }
  );

  const modalClasses = cn(
    'flex flex-col overflow-hidden transform bg-background border border-border shadow-2xl rounded-xl',
    sizeClasses[size],
    className
  );

  if (!mounted) return null;

  const modal = (
    <Transition show={isOpen}>
      <div onClick={handleBackdropClick} className={wrapperClasses}>
        <Transition.Child
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div ref={ref} className={modalClasses}>
            {title && (
              <div className="flex items-center justify-between w-full px-6 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">{title}</h2>
                {showClose && onDismiss && (
                  <button
                    type="button"
                    onClick={onDismiss}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">{children}</div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );

  return createPortal(modal, document.body);
}

export default memo(Modal);
