import React from 'react';
import { LucideIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModulePlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
}

export const ModulePlaceholderPage: React.FC<ModulePlaceholderPageProps> = ({
  title,
  description,
  icon: Icon,
  badge = 'Management Module'
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00A97A]/15 text-[#00A97A] flex items-center justify-center font-bold">
              <Icon size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-[#192038] m-0">
                  {title}
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#00A97A]/10 text-[#00A97A] border border-[#00A97A]/20">
                  {badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#8F9BB3] mt-0.5 m-0">
                {description}
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/admin"
          className="px-3.5 py-2 rounded-xl text-xs font-bold border border-[#EDF1F7] bg-white text-[#192038] hover:bg-[#F8FAFD] shadow-xs inline-flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft size={14} className="text-[#00A97A]" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Feature Preview Card */}
      <div className="bg-white rounded-2xl border border-[#EDF1F7] p-8 shadow-xs text-center max-w-2xl mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-[#E8F8F3] text-[#00A97A] flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Icon size={32} />
        </div>
        <h3 className="text-lg font-bold text-[#192038] m-0">
          {title} Module
        </h3>
        <p className="text-xs text-[#8F9BB3] mt-2 max-w-md mx-auto leading-relaxed">
          This section is rendered seamlessly inside the <strong>AdminLayout</strong> via React Router's <code>&lt;Outlet /&gt;</code>. You can manage full {title.toLowerCase()} records here in subsequent steps.
        </p>

        <div className="mt-6 pt-6 border-t border-[#EDF1F7] flex items-center justify-center gap-3">
          <Link
            to="/admin"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00A97A] text-white hover:bg-[#008f67] transition-all"
          >
            Go to Main Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};
