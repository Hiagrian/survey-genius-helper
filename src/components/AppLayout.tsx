import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Map, CheckSquare, Camera, BookOpen, Menu, X, Triangle, History, LogOut, User, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { AppFooter } from "./AppFooter";

const navItems = [
  { to: "/", icon: Map, label: "Dashboard" },
  { to: "/checklist", icon: CheckSquare, label: "Checklist" },
  { to: "/analisador", icon: Camera, label: "Analisador IA" },
  { to: "/historico", icon: History, label: "Histórico" },
  { to: "/conhecimento", icon: BookOpen, label: "Base de Dados" },
  { to: "/geohub", icon: Globe, label: "GeoHub" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-sidebar border-r border-sidebar-border fixed left-0 top-0 bottom-0 z-30">
        <SidebarContent currentPath={location.pathname} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 w-72 z-50 transform transition-transform duration-300 lg:hidden bg-sidebar border-r border-sidebar-border",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent currentPath={location.pathname} onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 gradient-primary rounded flex items-center justify-center">
              <Triangle className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground text-sm">TopoGIS</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
        <AppFooter />
      </div>
    </div>
  );
}

function SidebarContent({ currentPath, onClose }: { currentPath: string; onClose?: () => void }) {
  const { user, signOut } = useAuth();

  return (
    <div className="flex flex-col h-full p-4">
      {/* Logo */}
      <div className="flex items-center justify-between mb-8 px-2 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center animate-pulse-glow">
            <Triangle className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-display font-bold text-sidebar-foreground text-base leading-tight">TopoGIS</p>
            <p className="text-xs text-muted-foreground font-mono-custom">v1.0</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        <p className="text-xs font-mono-custom text-muted-foreground uppercase tracking-widest mb-3 px-2">
          Módulos
        </p>
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = to === "/" ? currentPath === "/" : currentPath.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className={cn("w-4.5 h-4.5 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-accent-foreground")} />
              <span className="font-medium text-sm">{label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-sidebar-border pt-4 mt-4 space-y-2">
        {user && (
          <div className="px-2 py-2 rounded-lg bg-sidebar-accent">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-sidebar-foreground font-medium truncate">{user.email}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-success">Conectado</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </div>
  );
}
