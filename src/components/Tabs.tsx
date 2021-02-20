import React from 'react';

// Tabs is generic container composition component

type Tab = 'convert' | 'charts';

type TabsProps = {};

export function Tabs({ children }: React.PropsWithChildren<TabsProps>) {
  return (
    <div>
      <ul className="flex cursor-pointer mt-8">{children}</ul>
    </div>
  );
}
