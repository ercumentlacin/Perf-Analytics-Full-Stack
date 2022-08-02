import { useEffect, useState } from 'react';
import { DatePicker, Space } from 'antd';
import moment from 'moment';
import Chart from './components/Chart';

const { RangePicker } = DatePicker;

const INITIAL_STATE = {
  data: {},
  error: null,
  loading: true,
  chartList: [],
};

const INITIAL_TIME_PERIOD = {
  from: '',
  to: '',
};

function App() {
  const [state, setState] = useState(INITIAL_STATE);
  const [timPeriod, setTimPeriod] = useState(INITIAL_TIME_PERIOD);
  const [timePeriodMoment, setTimePeriodMoment] = useState([
    moment(),
    moment(),
  ]);

  function timePeriodChnage(dates, dateStrings) {
    setTimePeriodMoment(dates);

    setTimPeriod({
      from: dateStrings[0],
      to: dateStrings[1],
    });
  }

  useEffect(() => {
    const params = {
      from: timPeriod.from,
      to: timPeriod.to,
    };
    let query = Object.keys(params)
      .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&');
    const host = 'http://localhost:9000/api/v1/perf-analytics';
    const url = timPeriod.from || timPeriod.to ? `${host}?${query}` : host;

    setState((prev) => ({ ...prev, loading: true }));
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const FCP = data.map((item) => ({
          createdAt: item.createdAt,
          value: item.FCP,
          label: 'First Contentful Paint',
          request: item.request,
        }));
        const TTFB = data.map((item) => ({
          createdAt: item.createdAt,
          value: item.TTFB,
          label: 'Time to First Byte',
          request: item.request,
        }));
        const DOMLoad = data.map((item) => ({
          createdAt: item.createdAt,
          value: item.DOMLoad,
          label: 'DOM Load',
          request: item.request,
        }));
        const WindowLoad = data.map((item) => ({
          createdAt: item.createdAt,
          value: item.WindowLoad,
          label: 'Window Load',
          request: item.request,
        }));
        setState((prev) => ({
          ...prev,
          data,
          loading: false,
          chartList: [FCP, TTFB, DOMLoad, WindowLoad],
        }));
      })
      .catch((error) => {
        setState((prev) => ({ ...prev, error, loading: false }));
      });
  }, [timPeriod.from, timPeriod.to]);

  if (state.loading) {
    return <div>Loading...</div>;
  }

  if (state.error) {
    return <div>Error: {state.error.message}</div>;
  }

  if (state.data < 1) {
    return <div>No data</div>;
  }

  return (
    <div className='App'>
      <Space direction='vertical' size={12}>
        <RangePicker onChange={timePeriodChnage} value={timePeriodMoment} />
        <div className='chart__list'>
          {state.chartList.map((chart, index) => (
            <Chart key={index} data={chart} />
          ))}
        </div>
      </Space>
    </div>
  );
}

export default App;
