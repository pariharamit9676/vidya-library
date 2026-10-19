import React from 'react';
import {
  LayoutDashboard,
  Users,
  Armchair,
  CreditCard,
  Calendar,
  BookOpen,
  FileText,
  BarChart2,
  Settings,
  X,
  Gift
} from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onLogout
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'students', label: 'Students', icon: Users, path: '/admin/students' },
    { id: 'seats', label: 'Seat Management', icon: Armchair, path: '/admin/seats', hideOnMobile: true },
    { id: 'fees', label: 'Fees & Payments', icon: CreditCard, path: '/admin/fees' },
    { id: 'attendance', label: 'Attendance', icon: Calendar, path: '/admin/attendance' },
    { id: 'referrals', label: 'Refer & Earn', icon: Gift, path: '/admin/referrals' },
    { id: 'receipts', label: 'Receipts', icon: FileText, path: '/admin/receipts' },
    { id: 'reports', label: 'Reports', icon: BarChart2, path: '/admin/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#EDF1F7] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Logo */}
        <div>
          <div className="h-18 px-6 flex items-center justify-between border-b border-[#EDF1F7]">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/vidya-library-logo.png"
                alt="Vidya Library Logo"
                className="h-9 w-auto object-contain shrink-0"
              />
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-[#192038] m-0 leading-tight">
                  Vidya Library
                </h1>
                <p className="text-[11px] text-[#8F9BB3] m-0 font-medium">
                  Your Space to Grow
                </p>
              </div>
            </Link>

            {/* Close Button on Mobile */}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 lg:hidden"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3.5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin' || location.pathname === '/admin/'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={onClose}
                  className={`w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    item.hideOnMobile ? 'hidden lg:flex' : 'flex'
                  } ${
                    isActive
                      ? 'bg-[#EEF0FD] text-[#544bec] font-bold shadow-xs'
                      : 'text-[#6B778C] hover:bg-[#F7F9FC] hover:text-[#192038]'
                  }`}
                >
                  <Icon
                    size={17}
                    className={isActive ? 'text-[#544bec]' : 'text-[#8F9BB3]'}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

      </aside>
    </>
  );
};
