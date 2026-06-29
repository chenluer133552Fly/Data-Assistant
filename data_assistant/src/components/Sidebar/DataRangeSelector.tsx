import { useAppStore } from '../../stores/appStore';

export default function DataRangeSelector() {
  const { selectedDataRange, setDataRange } = useAppStore();

  return (
    <div className="sidebar__data-range">
      <div className="sidebar__data-range-label">Data Range</div>
      <select
        className="sidebar__data-range-select"
        value={selectedDataRange}
        onChange={(e) => setDataRange(e.target.value)}
      >
        <option value="Finance DM">Finance DM</option>
        <option value="Customer Revenue">Customer Revenue</option>
        <option value="EUC-WPB Financial Deck">EUC-WPB Financial Deck</option>
        <option value="EUC-For WPB,GB,CMB">EUC-For WPB,GB,CMB</option>
        <option value="ISF">ISF</option>
      </select>
    </div>
  );
}
