import React from 'react';
import { useLocation } from 'react-router-dom';
import { AppSidebar, type SidebarItem } from './AppSidebar';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../context/AuthContext';
import { ShieldCheck, UserCog, Stethoscope, ClipboardList, Package, Eye } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  brandName?: string;
  brandIcon?: LucideIcon;
  menuItems: SidebarItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  pageTitle: string;
  headerAction?: React.ReactNode;
}

const RoleIcon = ({ role, className }: { role: UserRole, className?: string }) => {
  switch (role) {
    case 'admin': return <ShieldCheck className={className} />;
    case 'doctor': return <Stethoscope className={className} />;
    case 'receptionist': return <ClipboardList className={className} />;
    case 'pharmacist': return <Package className={className} />;
    case 'viewer': return <Eye className={className} />;
    default: return <UserCog className={className} />;
  }
};

export function DashboardLayout({
  children,
  brandName,
  brandIcon,
  menuItems,
  activeTab,
  onTabChange,
  pageTitle,
  headerAction,
}: DashboardLayoutProps) {
  const { user, activeRole, logout, switchRole, isViewer } = useAuth();
  const location = useLocation();

  const effectiveRole: UserRole = activeRole || (user?.roles.includes('viewer') ? 'admin' : user?.roles[0] || 'admin');

  if (!user) return null;

  // Determine current active dashboard section from route
  const currentSection: UserRole = location.pathname.startsWith('/admin')
    ? 'admin'
    : location.pathname.startsWith('/doctor')
    ? 'doctor'
    : location.pathname.startsWith('/receptionist')
    ? 'receptionist'
    : location.pathname.startsWith('/pharmacist')
    ? 'pharmacist'
    : effectiveRole;

  // For a viewer, provide direct switcher across all 4 dashboards
  const showDashboardSwitcher = user.roles.length > 1 || isViewer;
  const switchableRoles: UserRole[] = isViewer
    ? ['admin', 'doctor', 'receptionist', 'pharmacist']
    : user.roles;

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar
        brandName={brandName}
        brandIcon={brandIcon}
        menuItems={menuItems}
        activeTab={activeTab}
        onTabChange={onTabChange}
        onLogout={logout}
      />
      
      <div className="pl-55">
        {/* Header */}
        <header className="h-16 border-b bg-card px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{pageTitle}</h1>
            {headerAction && (
              <div className="ml-4">
                {headerAction}
              </div>
            )}
            {showDashboardSwitcher && (
              <div className="ml-4 flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Switch Dashboard:</span>
                <Select 
                  value={currentSection} 
                  onValueChange={(val) => switchRole(val as UserRole)}
                >
                  <SelectTrigger className="w-[170px] h-9 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                    <SelectValue placeholder="Select Dashboard" />
                  </SelectTrigger>
                  <SelectContent>
                    {switchableRoles.map((role) => (
                      <SelectItem key={role} value={role} className="capitalize">
                        <div className="flex items-center gap-2">
                          <RoleIcon role={role} className="h-4 w-4 text-primary" />
                          <span>{role} Dashboard</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isViewer && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                <Eye className="h-3.5 w-3.5 text-amber-600" />
                <span>Viewer (Read-Only)</span>
              </div>
            )}

            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-slate-900 leading-none">{user.name}</span>
              <div className="flex items-center gap-1.5 mt-1">
                <RoleIcon role={isViewer ? 'viewer' : activeRole} className="h-3 w-3 text-primary" />
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tighter">
                  {isViewer ? 'Viewer' : activeRole}
                </span>
              </div>
            </div>
            <Separator orientation="vertical" className="h-8 mx-1" />
            <Avatar className="h-10 w-10 border-2 border-primary/10">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
              <AvatarFallback className="bg-primary/5 text-primary font-bold">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4">
          {isViewer && (
            <div className="mb-4 p-3 bg-amber-50/90 border border-amber-200 text-amber-900 rounded-lg text-xs flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Viewer Mode:</strong> You have full viewing access across all 4 dashboards (Admin, Doctor, Receptionist, Pharmacist). Creation, editing, and deletion are disabled.
                </span>
              </div>
              <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                Read-Only
              </span>
            </div>
          )}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export { type SidebarItem } from './AppSidebar';
