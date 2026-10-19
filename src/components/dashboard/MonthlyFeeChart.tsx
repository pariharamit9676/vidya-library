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
import { useFeeReceipts } from '../../services/useLibraryQueries';

export const MonthlyFeeChart: React.FC = () => {
  const { data: rawReceipts = [] } = useFeeReceipts();

  const chartData = React.useMemo(() => {
    const receiptsList = Array.isArray(rawReceipts) ? rawReceipts : [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const currentMonthIdx = now.getMonth();
    const currentYear = now.getFullYear();

    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonthIdx - i, 1);
      const mIdx = d.getMonth();
      const y = d.getFullYear();
      const mName = months[mIdx];

      const total = receiptsList.reduce((sum: number, r: any) => {
        const rd = r.date ? new Date(r.date) : (r.createdAt ? new Date(r.createdAt) : null);
        if (rd && !isNaN(rd.getTime()) && rd.getMonth() === mIdx && rd.getFullYear() === y) {
          return sum + (Number(r.amount) || 0);
        }
        return sum;
      }, 0);

      data.push({
        month: mName,
        collection: total,
        isCurrent: i === 0
      });
    }
    return data;
  }, [rawReceipts]);

  const currentMonthData = chartData[chartData.length - 1];
  const currentCollection = currentMonthData?.collection || 0;
  const currentMonthLabel = `${currentMonthData?.month || ''} ${new Date().getFullYear()}`;

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
          <div className="text-xs font-black text-[#544bec]">
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
        {/* Dynamic Highlight Badge for Current Month */}
        <div className="absolute top-0 right-14 sm:right-16 z-10 bg-white px-3 py-1.5 rounded-xl border border-[#EDF1F7] shadow-md text-center hidden sm:block pointer-events-none">
          <div className="text-[10px] text-[#8F9BB3] font-semibold">{currentMonthLabel}</div>
          <div className="text-xs font-extrabold text-[#544bec]">
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
                  fill={entry.isCurrent ? '#544bec' : '#dcd8fb'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
