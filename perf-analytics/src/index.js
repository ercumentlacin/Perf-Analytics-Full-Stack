function TTFB() {
  const { responseStart, requestStart } = window.performance.timing;
  const diff = Math.round(responseStart - requestStart);

  return diff;
}

function FCP() {
  const paint = window.performance.getEntriesByType('paint');
  const fcp_performances = paint.find(
    (p) => p.name === 'first-contentful-paint',
  );

  if (fcp_performances) {
    return Math.round(fcp_performances.startTime);
  }
  return 0;
}

function DOMLoad() {
  const { domContentLoadedEventEnd, navigationStart } =
    window.performance.timing;
  const diff = Math.round(domContentLoadedEventEnd - navigationStart);

  return Math.abs(diff);
}

function WindowLoad() {
  const { loadEventStart, navigationStart } = window.performance.timing;
  const diff = Math.round(loadEventStart - navigationStart);

  return Math.abs(diff);
}

function ResourcesLoad() {
  const resources = window.performance.getEntriesByType('resource');
  const result = resources.reduce((acc, resource) => {
    const { responseEnd, responseStart } = resource;
    const diff = responseEnd - responseStart;
    return acc + diff;
  }, 0);

  return Math.round(result);
}

const measure = {
  TTFB,
  FCP,
  DOMLoad,
  WindowLoad,
  ResourcesLoad,
};

async function sendData(url, data) {
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    keepalive: true,
  });
}

export default async function perfAnalytics(options = {}) {
  const {
    TTFB = true,
    FCP = true,
    DOMLoad = true,
    WindowLoad = true,
    ResourcesLoad = true,
    url = 'http://localhost:9000/api/v1/perf-analytics',
  } = options;

  const data = {
    TTFB: TTFB ? measure.TTFB() : 0,
    FCP: FCP ? measure.FCP() : 0,
    DOMLoad: DOMLoad ? measure.DOMLoad() : 0,
    WindowLoad: WindowLoad ? measure.WindowLoad() : 0,
    ResourcesLoad: ResourcesLoad ? measure.ResourcesLoad() : 0,
  };

  return await sendData(url, data)
    .then(() => {
      console.log('Analytics sent');
    })
    .catch((err) => {
      console.log('Analytics error', err);
    });
}
