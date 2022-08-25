import React from 'react';

export type CalloutType = 'tip' | 'info' | 'warning' | 'danger';

export interface CalloutProps {
  type: CalloutType;
  title?: React.ReactNode;
  children?: React.ReactNode;
}

export function Callout({
  type,
  title = type.toUpperCase(),
  children,
}: CalloutProps) {
  return (
    <div className="my-5 p-4 rounded-lg bg-gray-100">
      <div className="text-lg font-semibold">{title}</div>
      {children && <div className="mt-1 ml-0.5">{children}</div>}
    </div>
  );
}
