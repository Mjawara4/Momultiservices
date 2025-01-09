import { Phone, Info, Package, Menu, ShoppingCart } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

const navigationItems = [
  {
    title: "Services",
    url: "/ship",
    icon: Package,
  },
  {
    title: "Order for Me",
    url: "/order-for-me",
    icon: ShoppingCart,
  },
  {
    title: "Contact",
    url: "/inquire",
    icon: Phone,
  },
  {
    title: "About Us",
    url: "/about",
    icon: Info,
  },
];

export function MainNavigation() {
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex flex-col items-center p-4">
          <img 
            src="/lovable-uploads/4a704460-41a7-4da9-9823-4f82d1d02e7a.png" 
            alt="MQ Multiservices LLC" 
            className="h-12 w-auto mb-4 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}