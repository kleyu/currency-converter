import { ChartLine, CurrencyCircleDollar } from 'phosphor-react';
import React from 'react';

// Tabs is generic container composition component
// as children, you put another generic component - Tab, which handles headers. Tab as children takes the content.

export function Tabs({ activeTab, setActiveTab }) {
  const activeProps = 'bg-white shadow-sm';
  const inactiveProps = 'text-gray-500 bg-gray-200';

  return (
    <div>
      <ul className="flex cursor-pointer mt-8">
        <li
          className={`py-2 px-6 rounded-t-lg w-2/4 inline-flex ${
            activeTab === 'convert' ? activeProps : inactiveProps
          }`}
          onClick={() => setActiveTab('convert')}
        >
          <span className="inline-flex">
            <CurrencyCircleDollar
              size={24}
              weight="duotone"
              className="mr-2"
              {...(activeTab === 'convert' && { color: '#44D382' })}
            />
            Convert
          </span>
        </li>
        <li
          className={`py-2 px-6 rounded-t-lg w-2/4 inline-flex ${
            activeTab === 'charts' ? activeProps : inactiveProps
          }`}
          onClick={() => setActiveTab('charts')}
        >
          <span className="inline-flex">
            <ChartLine
              size={24}
              {...(activeTab === 'charts' && { color: '#44D382' })}
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
