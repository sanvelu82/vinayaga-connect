import { LoginCard } from "@/components/ui/login-card"
import { GraduationCap, Users, BookOpen, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function LoginSection() {
  const { toast } = useToast()

  const handleLogin = (role: string) => {
    toast({
      title: `${role} Login`,
      description: `Welcome to Sri Vinayaga Vidyalaya School ${role} Portal`,
      duration: 3000,
    })
  }

  const loginRoles = [
    {
      role: "Student",
      icon: <GraduationCap />,
      description: "Access your assignments, grades, and academic resources",
      delay: "0s"
    },
    {
      role: "Parent",
      icon: <Users />,
      description: "Monitor your child's progress and communicate with teachers",
      delay: "0.1s"
    },
    {
      role: "Faculty",
      icon: <BookOpen />,
      description: "Manage classes, assignments, and student assessments",
      delay: "0.2s"
    },
    {
      role: "Admin",
      icon: <Shield />,
      description: "Administrative dashboard and school management tools",
      delay: "0.3s"
    }
  ]

  return (
    <section id="login-section" className="py-20 bg-background">
      <div className="school-container">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Welcome to Our School Portal
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your role to access the appropriate dashboard and resources tailored for your needs
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {loginRoles.map((login, index) => (
            <LoginCard
              key={login.role}
              role={login.role}
              icon={login.icon}
              description={login.description}
              onClick={() => handleLogin(login.role)}
              className="animate-slide-in-right"
              style={{ animationDelay: login.delay }}
            />
          ))}
        </div>
        
        <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-sm text-muted-foreground">
            Need help accessing your account? Contact our IT support team
          </p>
        </div>
      </div>
    </section>
  )
}