import { ChartLine, CurrencyCircleDollar } from 'phosphor-react';
import React from 'react';

// Tabs is generic container composition component
// as children, you put another generic component - Tab, which handles headers. Tab as children takes the content.

export function Tabs() {
  return (
    <div>
      <ul className="flex cursor-pointer mt-8">
        <li className="py-2 px-6 bg-white rounded-t-lg shadow-sm w-2/4 inline-flex">
          <span className="inline-flex">
            <CurrencyCircleDollar
              size={24}
              color="#44D382"
              weight="duotone"
              className="mr-2"
            />
            Convert
          </span>
        </li>
        <li className="py-2 px-6 bg-white rounded-t-lg text-gray-500 bg-gray-200 w-2/4 inline-flex">
          <span className="inline-flex">
            <ChartLine
              size={24}
              // color="#44D382" only if active
              weight="duotone"
              className="mr-2"
            />
            Charts
          </span>
        </li>
      </ul>
    </div>
  );
}
