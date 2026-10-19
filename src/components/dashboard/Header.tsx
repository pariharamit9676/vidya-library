import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, ChevronDown, LogOut, Settings, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenAddStudent: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  searchQuery,
  setSearchQuery,
  onLogout
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  return (
    <header className="h-18 px-5 sm:px-8 bg-white border-b border-[#EDF1F7] flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Mobile Menu Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-[#6B778C] hover:bg-[#F7F9FC] lg:hidden cursor-pointer"
          title="Toggle Navigation"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Right: Notifications, Admin Profile */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Notification Bell */}
        <div className="relative">
          <button
            className="w-9 h-9 rounded-xl border border-[#EDF1F7] bg-[#F7F9FC] text-[#6B778C] hover:text-[#192038] hover:bg-white flex items-center justify-center transition-colors cursor-pointer relative"
            title="Notifications"
          >
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              1
            </span>
          </button>
        </div>

        {/* Admin Profile Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            className={`flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl transition-all cursor-pointer border border-transparent ${
              isDropdownOpen
                ? 'bg-[#F7F9FC] border-[#EDF1F7] shadow-xs'
                : 'hover:bg-[#F7F9FC] border-l-[#EDF1F7]'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#544bec] text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
              A
            </div>
            <span className="hidden md:inline text-xs font-bold text-[#192038]">
              Admin
            </span>
            <ChevronDown
              size={14}
              className={`text-[#8F9BB3] transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180 text-[#544bec]' : ''
              }`}
            />
          </button>

          {/* Interactive Dropdown Menu */}
          {isDropdownOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-[#EDF1F7] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              role="menu"
            >
              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-[#EDF1F7] bg-[#F7F9FC]/70 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#544bec] text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                    A
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#192038] truncate">Admin User</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#EEF0FD] text-[#544bec]">
                        Active
                      </span>
                    </div>
                    <div className="text-[11px] text-[#8F9BB3] truncate">
                      admin@vidyalibrary.com
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Links */}
              <div className="py-1">
                <Link
                  to="/admin/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#192038] hover:bg-[#F7F9FC] hover:text-[#544bec] transition-colors"
                >
                  <Settings size={15} className="text-[#8F9BB3]" />
                  <span>Library Settings</span>
                </Link>
                <Link
                  to="/admin/reports"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-[#192038] hover:bg-[#F7F9FC] hover:text-[#544bec] transition-colors"
                >
                  <ShieldCheck size={15} className="text-[#8F9BB3]" />
                  <span>Admin Reports</span>
                </Link>
              </div>

              {/* Divider */}
              <div className="my-1 border-t border-[#EDF1F7]" />

              {/* Logout Action */}
              <div className="px-2 py-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onLogout?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-left group"
                >
                  <LogOut size={15} className="text-rose-500 group-hover:translate-x-0.5 transition-transform" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
