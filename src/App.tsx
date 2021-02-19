import React, { useState } from 'react';
import NumberInput from './components/NumberInput';
import { Tabs } from './components/Tabs';
import { ArrowCircleDown } from 'phosphor-react';
import { Line } from 'react-chartjs-2';
import './App.css';
import { useQuery } from 'react-query';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/entry.nostyle';

function getLocaleOptions(currency: string) {
  return {
    maximumFractionDigits: 2,
    currency,
    style: 'currency',
    currencyDisplay: 'narrowSymbol',
  };
}

function getDataForChart(canvas, rates) {
  console.log('🚀 ~ file: App.tsx ~ line 61 ~ getDataForChart ~ rates', rates);
  // const _dates = Object.keys(rates);
  let _dates = [];
  for (let date in rates) {
    if (rates.hasOwnProperty(date)) {
      _dates.push(date);
    }
  }
  let dates = [];
  for (let i = 0; i < _dates.length; i += 1) {
    dates.push(_dates[i]);
  }
  dates.sort((a, b) => a.localeCompare(b));
  console.log('dates', dates);
  const trans = dates.map((date) => ({
    group: 'Dataset 1',
    date: new Date(date),
    value: rates[date].USD,
  }));
  const evt = {
    toCurrency: 'USD',
    fromCurrency: 'SEK',
  };
  // const detja = dates.map((key) => rates[key][evt.toCurrency]);
  const detja = dates.map((dat) => ({
    x: new Date(dat),
    y: rates[dat][evt.toCurrency],
  }));
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(68, 211, 130, 0.8)');
  gradient.addColorStop(1, 'rgba(89, 235, 189, 0)');
  const lineGraphData = {
    labels: dates,
    datasets: [
      {
        data: detja,
        label: `${evt.fromCurrency} to ${evt.toCurrency}`,
        borderColor: '#44D382',
        backgroundColor: gradient,
        type: 'line',
        pointRadius: 0,
        fill: 'start',
        tension: 0,
        borderWidth: 2,
      },
    ],
  };

  console.log('trans', lineGraphData);
  return lineGraphData;
  // return [
  //   { group: 'Dataset 1', date: new Date(2015, 3, 26), value: 0.1176729223 },
  //   { group: 'Dataset 1', date: new Date(2015, 3, 27), value: 0.1165081886 },
  //   { group: 'Dataset 1', date: new Date(2015, 3, 28), value: 0.1165081886 },
  // ];
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
function Tab({ children }) {
  return (
    <div className="p-8  bg-white  shadow-sm rounded-b-lg">{children}</div>
  );
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
  const [dateRange, onChange] = useState([new Date(), new Date()]);
  //March 26th, 2015 and June 13th, 2017
  const start = dateRange?.[0].toISOString().substring(0, 10);
  const end = dateRange?.[1].toISOString().substring(0, 10);
  const historicalQuery = useQuery(
    ['historical', start, end],
    () =>
      fetch(
        `https://api.exchangeratesapi.io/history?start_at=${start}&end_at=${end}&base=SEK&symbols=USD,GBP,SGD`
      ).then((res) => res.json()),
    { keepPreviousData: true }
  );

  if (error) console.error('API ERROR:', error);
  if (isLoading) return <h1>hi</h1>;
  // if (historicalQuery.isLoading) return <h1>hi</h1>;
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
        {/* Possible Improvement: Use Composition API and pass children to Tabs instead of managing it by props */}
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'convert' ? (
          <Tab>
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
          </Tab>
        ) : (
          <Tab>
            <div className="flex items-center ">
              {console.log('historical', historicalQuery.data)}
              Between{' '}
              <DateRangePicker
                className="mx-1 shadow-sm"
                onChange={onChange}
                value={dateRange}
                returnValue="range"
              />
              the evaluation changed:{' '}
              {historicalQuery.data.rates?.[end]?.[targetCurrency] -
                historicalQuery.data.rates?.[start]?.[targetCurrency]}
            </div>

            <div className="mt-4">
              <Line
                width={300}
                data={(canvas) =>
                  getDataForChart(canvas, historicalQuery.data.rates)
                }
                options={{
                  legend: {
                    display: false,
                  },
                  scales: {
                    xAxes: [
                      {
                        type: 'time',
                        ticks: {
                          source: 'auto',
                        },
                        time: {
                          minUnit: 'day',
                          // unit: 'month'
                        },
                      },
                    ],
                    yAxes: [
                      {
                        type: 'linear',
                        gridLines: {
                          display: false,
                        },
                        scaleLabel: {
                          display: true,
                        },
                      },
                    ],
                  },
                }}
              />
            </div>
          </Tab>
        )}
      </div>
    </main>
  );
}

export default App;
