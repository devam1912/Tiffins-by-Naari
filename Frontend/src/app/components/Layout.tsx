import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Search, 
  CalendarCheck, 
  User, 
  LogOut, 
  MapPin, 
  Bell, 
  Menu as MenuIcon, 
  X,
  ChefHat
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { USER_INFO } from '../data/mockData';

const SidebarItem = ({ to, icon: Icon, label, onClick }: { to: string, icon: any, label: string, onClick?: () => void }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
      ${isActive 
        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
        : 'text-muted-foreground hover:bg-muted hover:text-primary'}
    `}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </NavLink>
);

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/browse', icon: Search, label: 'Browse Tiffins' },
    { to: '/subscriptions', icon: CalendarCheck, label: 'My Subscriptions' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-border h-full p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-primary p-2 rounded-lg">
            <ChefHat className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-primary tracking-tight">Tiffins by Naari</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <SidebarItem key={item.to} {...item} />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4 lg:gap-0">
            <button 
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <MenuIcon size={24} />
            </button>
            
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full cursor-pointer hover:bg-muted/80 transition-colors">
              <MapPin size={18} className="text-primary" />
              <span className="text-sm font-medium">{USER_INFO.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:bg-muted rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none">{USER_INFO.name}</p>
                <p className="text-xs text-muted-foreground mt-1">Free Plan</p>
              </div>
              <img 
                src={USER_INFO.avatar} 
                alt={USER_INFO.name} 
                className="w-10 h-10 rounded-full border-2 border-primary/20"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10 px-2">
                <div className="flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-lg">
                    <ChefHat className="text-white" size={24} />
                  </div>
                  <h1 className="text-xl font-bold text-primary tracking-tight">Tiffins</h1>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-muted rounded-full">
                  <X size={24} />
                </button>
              </div>
              
              <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                  <SidebarItem 
                    key={item.to} 
                    {...item} 
                    onClick={() => setIsMobileMenuOpen(false)} 
                  />
                ))}
              </nav>

              <div className="mt-auto pt-6 border-t border-border">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
