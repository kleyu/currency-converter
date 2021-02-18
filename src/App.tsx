import React, { useState } from 'react';
import NumberInput from './components/NumberInput';
import { Tabs } from './components/Tabs';
import {
  ArrowCircleDown,
  ChartLine,
  CurrencyCircleDollar,
} from 'phosphor-react';

import './App.css';
import { useQuery } from 'react-query';

function getLocaleOptions(currency: string) {
  return {
    maximumFractionDigits: 2,
    currency,
    style: 'currency',
    currencyDisplay: 'narrowSymbol',
  };
}

function useCurrency(defaultCurrency = 'SEK') {
  const [currency, setCurrency] = useState(defaultCurrency);
  const [value, setValue] = useState(1);

  return {
    currency,
    setCurrency,
    value,
    setValue,
  };
}

function App() {
  const {
    currency: baseCurrency,
    setCurrency: setBaseCurrency,
    value,
    setValue: setBaseValue,
  } = useCurrency('SEK');
  console.log('value 1', value);
  const {
    currency: targetCurrency,
    setCurrency: setTargetCurrency,
    setValue: setTargetValue,
  } = useCurrency('USD');
  const [activeTab, setActiveTab] = useState('convert');
  const { isLoading, error, data } = useQuery('latest', () =>
    fetch(
      'https://api.exchangeratesapi.io/latest?base=SEK&symbols=USD,GBP,SGD'
    ).then((res) => res.json())
  );

  if (error) console.error('API ERROR:', error);
  if (isLoading) return <h1>hi</h1>;
  console.log(data);

  return (
    <main className="bg-pacific-50 h-screen">
      <header>
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl text-center">
          <span className="block xl:inline">Online currency</span>
          <span className="block text-limegreen-500 xl:inline">converter</span>
        </h1>
      </header>

      <div>
        <Tabs></Tabs>
        <div className="p-8  bg-white  shadow-sm rounded-b-lg">
          <h3 className="text-center mb-3">
            {/* most likely should cut the to 2 fraction digits */}1{' '}
            {baseCurrency} ={' '}
            {`${(data.rates[targetCurrency] * 1).toLocaleString(
              undefined,
              getLocaleOptions(targetCurrency)
            )} ${targetCurrency}`}
          </h3>
          {/* In future, add other supported currencies and rewrite 
        component to be a ComboBox (select with filtering) */}
          <p className="text-gray-400">base</p>
          <div className="shadow appearance-none border rounded py-3 px-3 text-grey-darker bg-white">
            <select className="w-4/12 md:w-2/12">
              <option value="SEK">🇸🇪 SEK</option>
            </select>
            <div className="w-8/12 md:w-10/12 inline-flex justify-end">
              {/* the width of the input is a bit tricky if its on the right side of container */}
              <NumberInput
                defaultValue={1}
                onChange={({ value }) => {
                  setBaseValue(value);
                }}
                localeOptions={getLocaleOptions(baseCurrency)}
              />
            </div>
          </div>
          <div className="flex justify-center pt-6">
            <ArrowCircleDown size={36} color="#44D382" weight="duotone">
              {isLoading ? (
                <animate
                  attributeName="opacity"
                  values="0;1;0"
                  dur="4s"
                  repeatCount="indefinite"
                ></animate>
              ) : null}
            </ArrowCircleDown>
          </div>
          <p className="text-gray-400">target</p>
          <div className="shadow appearance-none border rounded py-3 px-3 text-grey-darker bg-white">
            <select
              className="w-4/12 md:w-2/12"
              onChange={(e) => setTargetValue(e.target.value)}
            >
              <option value="USD">🇺🇸 USD</option>
              <option value="GBP">🇬🇧 GBP</option>
              <option value="SGD">🇸🇬 SGD</option>
            </select>
            {/* <input className="w-10/12" type="number" min="1" step="any"></input> */}
            <div className="w-8/12 md:w-10/12 inline-flex justify-end">
              {/* the width of the input is a bit tricky if its on the right side of container */}
              <NumberInput
                disabled
                defaultValue={value * data.rates[targetCurrency]}
                localeOptions={getLocaleOptions(targetCurrency)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="p-16">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl text-center">
          Historical data
        </h1>
        <div className="flex justify-center mt-4">
          <input
            className="ml-2 rounded shadow px-2 py-1"
            type="date"
            id="from"
            name="domain-start"
            min="2018-01-01"
            max={new Date().toDateString()}
          ></input>
          <input
            className="ml-2 rounded shadow px-2 py-1"
            type="date"
            id="to"
            name="domain-end"
            min="2018-01-01"
            max={new Date().toDateString()}
          ></input>
        </div>
      </div>
    </main>
  );
}

export default App;
