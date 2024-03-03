import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import React from 'react';

type ToastDescriptionProps = {
  children: React.ReactNode;
  variant: 'default' | 'success' | 'destructive';
};

export default function ToastDescription({ variant, children }: ToastDescriptionProps) {
  return (
    <p className="flex items-center gap-2">
      {variant === 'success' ? (
        <CheckCircledIcon className="size-8" />
      ) : variant === 'destructive' ? (
        <CrossCircledIcon className="size-8" />
      ) : (
        ''
      )}{' '}
      {children}
    </p>
  );
}
