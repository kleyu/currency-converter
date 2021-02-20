import React from 'react';

// @todo add React.FC or React.PropsWithChildren type
//@ts-expect-error
export function Container({ children }) {
  return (
    <div className="p-8  bg-white  shadow-sm rounded-b-lg">{children}</div>
  );
}
