import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export const MainNavigation = () => {
  const isMobile = useIsMobile();

  const links = [
    { to: "/", label: "Home" },
    { to: "/ship", label: "Ship" },
    { to: "/calendar", label: "Calendar" },
    { to: "/order-for-me", label: "Order for Me" },
    { to: "/inquire", label: "Contact" },
  ];

  return (
    <nav className={cn(
      "flex gap-2",
      isMobile ? "flex-col items-stretch" : "items-center"
    )}>
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "transition-colors",
              isActive
                ? "text-primary hover:text-primary/90"
                : "text-muted-foreground hover:text-primary"
            )
          }
        >
          <Button
            variant="ghost"
            className={cn("w-full", isMobile && "justify-start")}
          >
            {label}
          </Button>
        </NavLink>
      ))}
    </nav>
  );
};