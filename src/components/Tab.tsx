import React from 'react';

const activeProps = 'bg-white shadow-sm';
const inactiveProps = 'text-gray-500 bg-gray-200';

type Tab = 'convet' | 'charts';

type TabProps = {
  activeTab: Tab;
  label: Tab;
  setActiveTab: (type: string) => void;
  icon: any;
};

export function Tab({ activeTab, label, setActiveTab, icon }: TabProps) {
  const Icon = icon;

  return (
    <li
      className={`py-2 px-6 rounded-t-lg w-2/4 inline-flex ${
        activeTab === label ? activeProps : inactiveProps
      }`}
      onClick={() => setActiveTab(label)}
    >
      <span className="inline-flex capitalize">
        <Icon
          size={24}
          weight="duotone"
          className="mr-2"
          {...(activeTab === label && { color: '#44D382' })}
        />
        {label}
      </span>
    </li>
  );
}
