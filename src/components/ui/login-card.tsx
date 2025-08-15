import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LoginCardProps {
  role: string
  icon: React.ReactNode
  description: string
  onClick: () => void
  className?: string
  style?: React.CSSProperties
}

export function LoginCard({ role, icon, description, onClick, className, style }: LoginCardProps) {
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden border-2 cursor-pointer transition-smooth hover-lift",
        "bg-card/50 backdrop-blur-sm hover:border-primary/50",
        "animate-fade-in-up",
        className
      )}
      style={style}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-smooth" />
      
      <CardHeader className="text-center space-y-4 relative z-10">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth group-hover:scale-110">
          <div className="text-primary text-2xl group-hover:scale-110 transition-smooth">
            {icon}
          </div>
        </div>
        
        <div className="space-y-2">
          <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-smooth">
            {role}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 pb-6">
        <Button 
          onClick={onClick}
          className="w-full group-hover:shadow-glow transition-smooth"
          variant="outline"
        >
          Login as {role}
        </Button>
      </CardContent>
    </Card>
  )
}