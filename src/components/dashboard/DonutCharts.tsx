import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useDashboardStats } from '../../services/useLibraryQueries';

export const DonutCharts: React.FC = () => {
  const { data: stats } = useDashboardStats();

  const totalSeats = stats?.seats?.total ?? 164;
  const occupiedSeats = stats?.seats?.occupied ?? 5;
  const availableSeats = stats?.seats?.available ?? 159;
  const maintenanceSeats = stats?.seats?.maintenance ?? 0;

  const seatOccupancyData = [
    {
      name: 'Occupied',
      value: occupiedSeats,
      percentage: `${totalSeats > 0 ? ((occupiedSeats / totalSeats) * 100).toFixed(1) : 0}%`,
      color: '#00A97A'
    },
    {
      name: 'Available',
      value: availableSeats,
      percentage: `${totalSeats > 0 ? ((availableSeats / totalSeats) * 100).toFixed(1) : 0}%`,
      color: '#E4E9F2'
    },
    ...(maintenanceSeats > 0 ? [{
      name: 'Maintenance',
      value: maintenanceSeats,
      percentage: `${totalSeats > 0 ? ((maintenanceSeats / totalSeats) * 100).toFixed(1) : 0}%`,
      color: '#FA8C16'
    }] : [])
  ];

  const totalStudents = stats?.students?.total ?? 5;
  const insideStudents = stats?.students?.inside ?? 0;
  const absentStudents = Math.max(0, totalStudents - insideStudents);

  const attendanceData = [
    {
      name: 'Present',
      value: insideStudents,
      percentage: `${totalStudents > 0 ? Math.round((insideStudents / totalStudents) * 100) : 0}%`,
      color: '#2F80ED'
    },
    {
      name: 'Absent',
      value: absentStudents,
      percentage: `${totalStudents > 0 ? Math.round((absentStudents / totalStudents) * 100) : 0}%`,
      color: '#E4E9F2'
    }
  ];

  return (
    <>
      {/* 1. Seat Occupancy */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-[#EDF1F7] shadow-xs flex flex-col justify-between min-h-[250px] sm:h-[300px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#192038] m-0">
            Seat Occupancy
          </h3>
          <span className="text-[11px] font-bold text-[#00A97A] bg-[#E8F8F3] px-2.5 py-0.5 rounded-full">
            {totalSeats > 0 ? ((occupiedSeats / totalSeats) * 100).toFixed(1) : 0}% Occupied
          </span>
        </div>

        {/* Content: Donut + Legend */}
        <div className="flex items-center justify-between gap-2 flex-1">
          {/* Donut Chart with Centered Number */}
          <div className="relative w-36 h-36 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={seatOccupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={62}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {seatOccupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xl font-black text-[#192038] leading-none">{totalSeats}</span>
              <span className="text-[10px] text-[#8F9BB3] font-semibold mt-0.5">Total Seats</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3 flex-1 pl-2">
            {seatOccupancyData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="text-xs">
                  <div className="font-bold text-[#192038] leading-tight">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-[#8F9BB3]">
                    {item.value} ({item.percentage})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Today's Attendance */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-[#EDF1F7] shadow-xs flex flex-col justify-between min-h-[250px] sm:h-[300px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#192038] m-0">
            Today's Attendance
          </h3>
          <span className="text-[11px] font-bold text-[#2F80ED] bg-[#EAF2FE] px-2.5 py-0.5 rounded-full">
            {insideStudents} Checked In
          </span>
        </div>

        {/* Content: Donut + Legend */}
        <div className="flex items-center justify-between gap-2 flex-1">
          {/* Donut Chart with Centered Number */}
          <div className="relative w-36 h-36 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={62}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xl font-black text-[#192038] leading-none">{insideStudents}</span>
              <span className="text-[10px] text-[#8F9BB3] font-semibold mt-0.5">Present</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-3 flex-1 pl-2">
            {attendanceData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="text-xs">
                  <div className="font-bold text-[#192038] leading-tight">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-[#8F9BB3]">
                    {item.value} ({item.percentage})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
