import React, { useState } from 'react';
import { Tabs } from './components/Tabs';
import { Tab } from './components/Tab';
import { Container } from './components/Container';
import {
  ArrowCircleDown,
  ChartLine,
  CurrencyCircleDollar,
} from 'phosphor-react';
import './App.css';
import { useQuery } from 'react-query';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
//@ts-ignore
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/entry.nostyle';
import { CurrencyChart } from './components/CurrencyChart';
import { CurrencyInput } from './components/CurrencyInput';
import { getLocaleOptions } from './utils/locale';
import { useLocalStorage } from './utils/hooks';

/* I was looking for currencyCode => emoji map to display them in the dropdown. Then I found this gist: https://gist.github.com/avaleriani/fc28b62d9a1a5c6092e7435d4fdc909d which I filtered to have only all currencies that the API returns.

Some possible improvements:
- write a script (or cron) that fetches daily the api and checks if they have added any new currency
- instead of storing it as json, one could also write a small utility that translates currencyCode to emoji.
 */
import { currencies } from './utils/currencies.json';

// @TODO: maybe move to utils
const toApiDate = (date: Date) => date.toISOString().substring(0, 10);

function useCurrency(defaultCurrency = 'SEK', storageName = 'NONE') {
  // TODO: check why useLocalStorage breaks types and adjust (looks like it can return a fn)
  const [currency, setCurrency] = useLocalStorage(storageName, defaultCurrency);
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
  } = useCurrency('SEK', 'base');
  const {
    currency: targetCurrency,
    setCurrency: setTargetCurrency,
  } = useCurrency('USD', 'target');
  const [activeTab, setActiveTab] = useState<'convert' | 'charts'>('convert');

  /* most likely we could have some smart caching (persists saved data in storage, checks if data exists, updates data, etc...) (I think React Query is working on something like that)
   */
  // @TODO: type the return value
  const { isLoading, error, data } = useQuery(
    ['latest', baseCurrency],
    () =>
      fetch(
        `https://api.exchangeratesapi.io/latest?base=${baseCurrency}`
      ).then((res) => res.json()),
    { keepPreviousData: true }
  );

  // @TODO: add useLocalStorage hook if possible
  const [dateRange, onChange] = useState([new Date(), new Date()]);

  // if user clears the date, fallback to new Date()
  const start = toApiDate(dateRange?.[0] ?? new Date());
  const end = toApiDate(dateRange?.[1] ?? new Date());

  // TODO: use URLSearchParams to construct the url
  // TODO: type the return value
  const historicalQuery = useQuery(
    ['historical', start, end, baseCurrency, targetCurrency],
    () =>
      fetch(
        `https://api.exchangeratesapi.io/history?start_at=${start}&end_at=${end}&base=${baseCurrency}&symbols=${targetCurrency}`
      ).then((res) => res.json()),
    { keepPreviousData: true }
  );

  const getEvaluationDifference = (
    // TODO: get types from one source instead of re-defining
    rates: Record<string, { [rate: string]: number }>
  ) => {
    // NOTE: this is pretty naive as the API doesnt always return correct dates (thats why optional chaining is used)
    // @TODO: check last available date and first start date instead blind property access.
    const difference =
      rates?.[end]?.[targetCurrency] - rates?.[start]?.[targetCurrency];
    // @TODO: show difference as % with styling, depedning if positive or negative (green font, red font) + bold

    return Number.isNaN(difference)
      ? 'no data, select different range'
      : difference;
  };

  // @TODO: show toast notifiaction if there is an error
  if (error) console.error('API ERROR:', error);

  return (
    <main className="bg-pacific-50 h-screen">
      <header>
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl text-center">
          <span className="block xl:inline">Online currency</span>
          <span className="block text-limegreen-500 xl:inline">converter</span>
        </h1>
      </header>

      <div>
        {/* probably would be better to restructure so Tab takes children. */}
        <Tabs>
          <Tab
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            label="convert"
            icon={CurrencyCircleDollar}
          />
          <Tab
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            label="charts"
            icon={ChartLine}
          />
        </Tabs>
        {activeTab === 'convert' ? (
          <Container>
            <h3 className="text-center mb-3">
              {/* TODO: make a separate component to make it look cleaner */}1{' '}
              {baseCurrency} ={' '}
              {`${(data?.rates[targetCurrency] * 1).toLocaleString(
                undefined,
                getLocaleOptions(targetCurrency)
              )}`}
            </h3>
            {/* In future, add other supported currencies and rewrite 
        component to be a ComboBox (select with filtering) */}
            <CurrencyInput
              label="base"
              currency={baseCurrency}
              setCurrency={setBaseCurrency}
              setValue={setBaseValue}
            >
              {currencies.map((currency) => (
                <option value={currency.code} key={currency.code}>
                  {currency.code} {currency.emoji}
                </option>
              ))}
            </CurrencyInput>
            <div className="flex justify-center pt-6">
              {/* @TODO: instead of just this icon, we should add 'switch currencies' functionality
                  (top goes to bottom, bottom goes to top)
              */}
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
            <CurrencyInput
              label="target"
              currency={targetCurrency}
              setCurrency={setTargetCurrency}
              defaultValue={value * data?.rates[targetCurrency]}
              disabled
            >
              {currencies.map((currency) =>
                currency.code === baseCurrency ? null : (
                  <option value={currency.code} key={currency.code}>
                    {currency.code} {currency.emoji}
                  </option>
                )
              )}
            </CurrencyInput>
          </Container>
        ) : (
          <Container>
            <div className="flex items-center">
              Between{' '}
              {/* @TODO: I'd like to improve styling of date picker in the future. */}
              <DateRangePicker
                className="mx-1 shadow-sm"
                onChange={onChange}
                value={dateRange}
                returnValue="range"
              />
              the evaluation changed:{' '}
              {getEvaluationDifference(historicalQuery.data?.rates)}
            </div>

            <CurrencyChart
              rates={historicalQuery.data?.rates}
              baseCurrency={baseCurrency}
              targetCurrency={targetCurrency}
            />
          </Container>
        )}
      </div>
    </main>
  );
}

export default App;
