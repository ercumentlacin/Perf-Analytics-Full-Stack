import { Line } from '@ant-design/charts';

function Chart(props) {
  const { data } = props;
  const config = {
    data,
    xField: 'createdAt',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
    interactions: [
      {
        type: 'marker-active',
      },
    ],
  };

  return (
    <div className='chart__list-item'>
      <h3>{data[0].label}</h3>
      <Line
        {...config}
        onReady={(plot) => {
          plot.on('plot:click', (evt) => {
            const { x, y } = evt;
            const tooltipData = plot.chart.getTooltipItems({ x, y });
          });
        }}
      />
    </div>
  );
}

export default Chart;
