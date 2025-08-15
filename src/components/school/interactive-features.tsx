import { useState, useEffect } from "react"
import { Clock, Calendar, Star, TrendingUp, Users, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function InteractiveFeatures() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [stats, setStats] = useState({
    students: 400,
    teachers: 20,
    achievements: 150,
    satisfaction: 95.5
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Animate stats on mount
    const animateStats = () => {
      const targets = { students: 400, teachers: 20, achievements: 10, satisfaction: 95.5 }
      let current = { students: 0, teachers: 0, achievements: 0, satisfaction: 0 }
      
      const increment = () => {
        const speed = 50
        if (current.students < targets.students) current.students += Math.ceil(targets.students / speed)
        if (current.teachers < targets.teachers) current.teachers += Math.ceil(targets.teachers / speed)
        if (current.achievements < targets.achievements) current.achievements += Math.ceil(targets.achievements / speed)
        if (current.satisfaction < targets.satisfaction) current.satisfaction += targets.satisfaction / speed
        
        setStats({ ...current })
        
        if (current.students < targets.students || current.teachers < targets.teachers || 
            current.achievements < targets.achievements || current.satisfaction < targets.satisfaction) {
          requestAnimationFrame(increment)
        } else {
          setStats(targets)
        }
      }
      requestAnimationFrame(increment)
    }

    const timeout = setTimeout(animateStats, 500)
    return () => {
      clearInterval(timer)
      clearTimeout(timeout)
    }
  }, [])

  const achievements = [
    { title: "Well Traning", icon: Star, color: "text-yellow-600" },
    { title: "Best Growing ", icon: TrendingUp, color: "text-blue-600" },
    { title: "Academic Excellence", icon: BookOpen, color: "text-green-600" }
  ]

  return (
    <div className="space-y-6">
      {/* Live Clock */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Clock className="h-5 w-5" />
            Current Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-mono font-bold text-foreground">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <Calendar className="h-4 w-4" />
            {currentTime.toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </CardContent>
      </Card>

      {/* Live Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-all duration-300 hover:scale-105">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-foreground">{Math.floor(stats.students)}</div>
            <div className="text-sm text-muted-foreground">Students</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-300 hover:scale-105">
          <CardContent className="p-4 text-center">
            <BookOpen className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-foreground">{Math.floor(stats.teachers)}</div>
            <div className="text-sm text-muted-foreground">Faculty</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-300 hover:scale-105">
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold text-foreground">{Math.floor(stats.achievements)}</div>
            <div className="text-sm text-muted-foreground">Awards</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-300 hover:scale-105">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-foreground">{stats.satisfaction.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Satisfaction</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card className="bg-gradient-to-br from-secondary to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Star className="h-5 w-5" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.map((achievement, index) => (
            <div 
              key={achievement.title}
              className="flex items-center gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-all duration-300 hover:scale-[1.02] animate-slide-in-right"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
              <span className="flex-1 text-sm font-medium">{achievement.title}</span>
              <Badge variant="secondary" className="text-xs">
                {2024 - index}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}