import { useState } from "react"
import { GraduationCap, Users, BookOpen, Shield, Award, Bell, Home, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import schoolLogo from "@/assets/school-logo.png"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const loginRoles = [
  {
    role: "Student",
    icon: GraduationCap,
    description: "Access assignments, grades & resources",
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
    notifications: 3
  },
  {
    role: "Parent",
    icon: Users,
    description: "Monitor progress & communicate",
    color: "text-green-600", 
    bgColor: "bg-green-50 hover:bg-green-100",
    notifications: 1
  },
  {
    role: "Faculty",
    icon: BookOpen,
    description: "Manage classes & assessments",
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-100",
    notifications: 5
  },
  {
    role: "Admin",
    icon: Shield,
    description: "Administrative dashboard",
    color: "text-red-600",
    bgColor: "bg-red-50 hover:bg-red-100",
    notifications: 2
  }
]

const quickActions = [
  { icon: Home, label: "Home", href: "#hero-section" },
  { icon: Award, label: "Results", href: "#results-section" },
  { icon: MapPin, label: "Location", href: "https://maps.app.goo.gl/nqKhc4gGPuBKybdw7" },
  { icon: Bell, label: "News", href: "#footer" }
]

export function AppSidebar() {
  const { state, isMobile } = useSidebar()
  const collapsed = state === "collapsed"
  const { toast } = useToast()
  const navigate = useNavigate()
  const [activeRole, setActiveRole] = useState<string | null>(null)

  const handleLogin = (role: string) => {
    setActiveRole(role)
    navigate(`/login/${role.toLowerCase()}`)
    toast({
      title: `${role} Login`,
      description: `Redirecting to ${role} Portal`,
      duration: 2000,
    })  }

  const handleQuickAction = (label: string, href: string) => {
    if (label === "Results") {
      window.open("https://google.com", "_blank")
    } else if (label === "Location") {
      window.open(href, "_blank")
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
    }
    toast({
      title: label,
      description: `${label === "Location" ? "Opening location in maps" : `Navigating to ${label}`}`,
      duration: 2000,
    })
  }

  return (
    <Sidebar className="border-r bg-gradient-to-b from-sidebar-background to-sidebar-accent/20" collapsible="icon">
      <SidebarHeader className="border-b bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center gap-3 p-4">
          <Avatar className="h-10 w-10 shadow-md">
            <AvatarImage src={schoolLogo} alt="School Logo" />
            <AvatarFallback className="bg-primary text-primary-foreground">SV</AvatarFallback>
          </Avatar>
          {(isMobile || !collapsed) && (
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-foreground">Sri Vinayaga</h2>
              <p className="text-sm text-muted-foreground">Vidyalaya School</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold">
            Quick Access
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((action) => (
                <SidebarMenuItem key={action.label}>
                  <SidebarMenuButton
                    onClick={() => handleQuickAction(action.label, action.href)}
                    className="hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105"
                  >
                    <action.icon className="mr-2 h-4 w-4" />
                    {(isMobile || !collapsed) && <span>{action.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Login Portals */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-primary font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Login Portals
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {loginRoles.map((login) => (
                <SidebarMenuItem key={login.role}>
                  <SidebarMenuButton
                    onClick={() => handleLogin(login.role)}
                    className={`
                      relative h-auto p-4 flex-col items-start gap-2 transition-all duration-300
                      ${login.bgColor} ${login.color} hover:shadow-md hover:scale-[1.02]
                      ${activeRole === login.role ? 'ring-2 ring-primary shadow-lg scale-[1.02]' : ''}
                      group animate-slide-in-right
                    `}
                    style={{ animationDelay: `${loginRoles.indexOf(login) * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <login.icon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                        {(isMobile || !collapsed) && (
                          <div className="flex flex-col">
                            <span className="font-semibold text-base">{login.role}</span>
                            <span className="text-xs opacity-80 font-normal">
                              {login.description}
                            </span>
                          </div>
                        )}
                      </div>
                      {(isMobile || !collapsed) && login.notifications > 0 && (
                        <Badge 
                          variant="secondary" 
                          className="ml-2 bg-accent text-accent-foreground animate-pulse"
                        >
                          {login.notifications}
                        </Badge>
                      )}
                    </div>
                    {activeRole === login.role && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-md animate-fade-in" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Help Section */}
        {(isMobile || !collapsed) && (
          <SidebarGroup className="mt-auto">
            <div className="p-4 bg-gradient-to-r from-muted to-accent/10 rounded-md mx-2 mb-2">
              <p className="text-sm text-muted-foreground text-center">
                Need help? Contact IT support for assistance with your account.
              </p>
            </div>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}