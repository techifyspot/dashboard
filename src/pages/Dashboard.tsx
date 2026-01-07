import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Bot, 
  FolderKanban, 
  Workflow, 
  BarChart3, 
  Code2, 
  GitBranch, 
  Users, 
  Settings, 
  Menu,
  X,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Zap,
  LogOut,
  Loader2
} from 'lucide-react';
import { useUser, UserButton, useClerk, useAuth } from '@clerk/clerk-react';
import { useAppStore } from '@/store/appStore';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
  { path: '/dashboard/ai-assistant', icon: Bot, label: 'AI Coding Assistant' },
  { path: '/dashboard/code-tools', icon: Code2, label: 'Code Tools' },
  { path: '/dashboard/code-optimization', icon: Zap, label: 'Code Optimization' },
  { path: '/dashboard/projects', icon: FolderKanban, label: 'Project Management' },
  { path: '/dashboard/automation', icon: Workflow, label: 'Code Automations' },
  { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/dashboard/version-control', icon: GitBranch, label: 'Version Control' },
  { path: '/dashboard/collaboration', icon: Users, label: 'Collaboration' },
  { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

const Dashboard = () => {
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const { isLoaded: isAuthLoaded } = useAuth();
  const { signOut } = useClerk();
  const { sidebarCollapsed, toggleSidebar, notifications, markNotificationRead } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);

  // Ensure user data is loaded before rendering sidebar
  useEffect(() => {
    if (isUserLoaded && isAuthLoaded) {
      // Small delay to ensure all data is ready
      const timer = setTimeout(() => {
        setIsInitialized(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isUserLoaded, isAuthLoaded]);

  // Scroll to top when route changes
  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Show loading state while initializing
  if (!isInitialized || !isUserLoaded || !isAuthLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex w-full overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-sidebar border-r border-sidebar-border z-40 overflow-hidden"
      >
        {/* Logo */}
        <div className="p-3 flex items-center justify-between h-20 lg:h-24 border-b border-sidebar-border flex-shrink-0">
          <div className={`flex items-center gap-2 ${sidebarCollapsed ? 'justify-center w-full' : 'flex-1 min-w-0'}`}>
            {sidebarCollapsed ? (
              <img 
                src="/Logo.png" 
                alt="Logo" 
                className="w-16 h-16 lg:w-20 lg:h-20 object-contain flex-shrink-0"
              />
            ) : (
              <img 
                src="/Logo.png" 
                alt="Logo" 
                className="h-16 lg:h-20 object-contain max-w-full"
              />
            )}
          </div>
          {!sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors flex-shrink-0"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors absolute right-2 top-2"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 lg:p-3 space-y-1 overflow-y-auto scrollbar-dark min-w-0">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-all duration-200 group min-w-0 ${
                  sidebarCollapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-primary/10 text-primary border-l-2 border-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`
              }
            >
              <item.icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="text-xs lg:text-sm font-medium truncate min-w-0">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="p-2 lg:p-3 border-t border-sidebar-border flex-shrink-0">
          <button
            onClick={async () => {
              try {
                // Clear local storage and state before sign out
                localStorage.removeItem('techifyspot-storage');
                await signOut({ redirectUrl: '/login' });
                // Force reload to clear all state
                window.location.href = '/login';
              } catch (error) {
                console.error('Sign out error:', error);
                // Fallback: redirect anyway
                window.location.href = '/login';
              }
            }}
            className={`w-full flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-2.5 rounded-lg transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="text-xs lg:text-sm font-medium truncate">Logout</span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-sidebar-border z-50 lg:hidden flex flex-col"
            >
              <div className="p-4 flex items-center justify-between h-20 border-b border-sidebar-border flex-shrink-0">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <img 
                    src="/Logo.png" 
                    alt="Logo" 
                    className="h-12 object-contain max-w-full"
                  />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/10 text-primary border-l-2 border-primary'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="p-3 border-t border-sidebar-border">
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <button
                    onClick={async () => {
                      try {
                        localStorage.removeItem('techifyspot-storage');
                        await signOut({ redirectUrl: '/login' });
                        window.location.href = '/login';
                      } catch (error) {
                        console.error('Sign out error:', error);
                        window.location.href = '/login';
                      }
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ml-0 transition-all duration-300 w-full ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'
      }`}>
        {/* Top Navbar */}
        <header className="h-16 bg-card/50 backdrop-blur-xl border-b border-border flex items-center justify-between px-3 sm:px-4 lg:px-6 sticky top-0 z-30 w-full overflow-hidden">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary text-muted-foreground flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Search */}
            <div className="relative hidden sm:block flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    // Navigate to search results or filter
                    toast.info(`Searching for: ${searchQuery}`);
                  }
                }}
                placeholder="Search..."
                className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-72 sm:w-80 glass-panel p-4 max-h-96 overflow-y-auto z-50"
                  >
                    <h3 className="font-semibold text-foreground mb-3">Notifications</h3>
                    {notifications.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No notifications</p>
                    ) : (
                      <div className="space-y-3">
                        {notifications.slice(0, 5).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              n.read ? 'bg-transparent' : 'bg-primary/5'
                            } hover:bg-secondary`}
                          >
                            <p className="text-sm font-medium text-foreground">{n.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{n.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-border">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                    userButtonPopoverCard: "bg-card border-border text-foreground",
                    userButtonPopoverActions: "bg-card",
                    userButtonPopoverActionButton: "text-foreground hover:bg-secondary hover:text-foreground",
                    userButtonPopoverActionButtonText: "text-foreground",
                    userButtonPopoverFooter: "hidden",
                    userButtonPopoverHeader: "text-foreground",
                    userButtonPopoverMain: "text-foreground",
                  },
                  variables: {
                    colorPrimary: "hsl(270, 70%, 59%)",
                    colorBackground: "hsl(0, 0%, 8%)",
                    colorText: "hsl(0, 0%, 100%)",
                    colorTextSecondary: "hsl(0, 0%, 100%)",
                  },
                }}
                afterSignOutUrl="/login"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto w-full max-w-full overflow-x-hidden bg-background min-h-0 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/90 backdrop-blur-xl border-t border-border flex items-center justify-around z-30">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Dashboard;
