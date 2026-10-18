import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import { useDashboardStats } from '../../services/useLibraryQueries';

export const MonthlyFeeChart: React.FC = () => {
  const { data: stats } = useDashboardStats();
  const currentCollection = stats?.financials?.monthlyCollection ?? 11600;

  const chartData = [
    { month: 'May', collection: 4000, isCurrent: false },
    { month: 'Jun', collection: 6000, isCurrent: false },
    { month: 'Jul', collection: 8500, isCurrent: false },
    { month: 'Aug', collection: 9200, isCurrent: false },
    { month: 'Sep', collection: 10400, isCurrent: false },
    { month: 'Oct', collection: currentCollection, isCurrent: true }
  ];

  const formatYAxis = (tickItem: number) => {
    if (tickItem === 0) return '0';
    if (tickItem >= 1000) return `${Math.round(tickItem / 1000)}K`;
    return `${tickItem}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white px-3 py-2 rounded-xl border border-[#EDF1F7] shadow-lg text-center">
          <div className="text-[10px] text-[#8F9BB3] font-bold uppercase">{data.month} 2026</div>
          <div className="text-xs font-black text-[#00A97A]">
            ₹{data.collection.toLocaleString('en-IN')}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-[#EDF1F7] shadow-xs flex flex-col justify-between h-[260px] sm:h-[300px]">
      {/* Header with Dropdown */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-extrabold text-[#192038] m-0">
          Monthly Fee Collection
        </h3>
        <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#EDF1F7] text-xs font-semibold text-[#6B778C] hover:bg-[#F7F9FC] transition-colors cursor-pointer">
          <span>This Year</span>
          <ChevronDown size={14} className="text-[#8F9BB3]" />
        </button>
      </div>

      {/* Bar Chart Container */}
      <div className="w-full flex-1 relative pt-2">
        {/* Dynamic Highlight Badge for Oct 2026 */}
        <div className="absolute top-0 right-14 sm:right-16 z-10 bg-white px-3 py-1.5 rounded-xl border border-[#EDF1F7] shadow-md text-center hidden sm:block pointer-events-none">
          <div className="text-[10px] text-[#8F9BB3] font-semibold">Oct 2026</div>
          <div className="text-xs font-extrabold text-[#00A97A]">
            ₹{currentCollection.toLocaleString('en-IN')}
          </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8F9BB3', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8F9BB3', fontSize: 11 }}
              tickFormatter={formatYAxis}
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="collection" radius={[6, 6, 0, 0]} maxBarSize={22}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isCurrent ? '#00A97A' : '#C7F2E5'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
