"use client"

import { Home, ArrowLeftRight, HandCoins, Clock, MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../../../packages/lib/util";
import { useState } from "react";
import { Button } from "@repo/ui/button";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isCollapsed: boolean;
}

const SidebarItem = ({ href, icon, title, isCollapsed }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
        "hover:bg-purple-50 dark:hover:bg-purple-950",
        "text-gray-700 dark:text-gray-200",
        isActive && "bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-50"
      )}
    >
      <div className={cn(
        "h-6 w-6 flex-shrink-0",
        isActive ? "text-purple-600 dark:text-purple-400" : "text-gray-400 dark:text-gray-500"
      )}>
        {icon}
      </div>
      {!isCollapsed && <span className="transition-opacity duration-300">{title}</span>}
    </Link>
  );
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 h-screen pt-20 pb-4 px-4 border-r border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg transition-all duration-300",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <Button
          variant="ghost"
          //@ts-ignore
          size="icon"
          className="absolute top-20 -right-4 h-8 w-8 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? 
            <MenuIcon className="h-4 w-4" /> : 
            <X className="h-4 w-4" />
          }
        </Button>

        <nav className="space-y-1">
         
          <SidebarItem 
            href="/dashboard" 
            icon={<ArrowLeftRight />} 
            title="Home" 
            isCollapsed={isCollapsed}
          />
          <SidebarItem 
            href="/transactions" 
            icon={<Clock />} 
            title="Transactions" 
            isCollapsed={isCollapsed}
          />
          <SidebarItem 
            href="/p2ptransfer" 
            icon={<HandCoins/>} 
            title="P2P Transfer" 
            isCollapsed={isCollapsed}
          />
        </nav>
      </aside>

      <main 
        className={cn(
          "transition-all duration-300 w-full pt-20 pb-4 px-8",
          isCollapsed ? "pl-20" : "pl-72"
        )}
      >
        {children}
      </main>
    </div>
  );
}