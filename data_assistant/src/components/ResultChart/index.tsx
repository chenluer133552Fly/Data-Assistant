import { VegaEmbed } from 'react-vega';
import type { VisualizationSpec } from 'vega-embed';
import './ResultChart.css';

const chartSpec: VisualizationSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  autosize: { type: 'fit', contains: 'padding' },
  data: {
    values: [
      { category: 'Shanghai', channel: 'Online', customers: 38 },
      { category: 'Shanghai', channel: 'Branch', customers: 12 },
      { category: 'Beijing', channel: 'Online', customers: 25 },
      { category: 'Beijing', channel: 'Branch', customers: 9 },
      { category: 'Guangdong', channel: 'Online', customers: 21 },
      { category: 'Guangdong', channel: 'Branch', customers: 7 },
      { category: 'Other', channel: 'Online', customers: 13 },
      { category: 'Other', channel: 'Branch', customers: 2 },
    ],
  },
  mark: { type: 'bar', cornerRadiusEnd: 3 },
  encoding: {
    x: {
      field: 'category',
      type: 'nominal',
      axis: { title: null, labelColor: '#6b7280' },
    },
    y: {
      field: 'customers',
      type: 'quantitative',
      axis: { title: 'New customers', gridColor: '#eef0f4', labelColor: '#6b7280' },
    },
    color: {
      field: 'channel',
      type: 'nominal',
      scale: { range: ['#8fb8ff', '#ffc2a1'] },
      legend: { orient: 'top', title: null },
    },
    tooltip: [
      { field: 'category', type: 'nominal', title: 'Region' },
      { field: 'channel', type: 'nominal', title: 'Channel' },
      { field: 'customers', type: 'quantitative', title: 'Customers' },
    ],
  },
  config: {
    view: { stroke: null },
    axis: { labelFont: 'system-ui', titleFont: 'system-ui' },
    legend: { labelFont: 'system-ui' },
  },
};

export default function ResultChart() {
  return (
    <section className="result-chart">
      <div className="result-chart__header">
        <div>
          <h3 className="result-chart__title">CHART</h3>
          <p className="result-chart__subtitle">New customer distribution by region and channel</p>
        </div>
        <button className="result-chart__icon-btn" aria-label="Expand chart">
          []
        </button>
      </div>
      <div className="result-chart__body">
        <VegaEmbed spec={chartSpec} options={{ actions: false, renderer: 'svg' }} />
      </div>
    </section>
  );
}
