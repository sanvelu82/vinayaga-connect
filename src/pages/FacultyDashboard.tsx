import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookText, FileSignature, ClipboardCheck } from "lucide-react";

export default function FacultyDashboard() {
  const location = useLocation();
  const { isPrincipal } = location.state || { isPrincipal: false };

  const facultyOptions = [
    { title: "Lesson Plan Entry", icon: <BookText className="w-6 h-6" /> },
    { title: "Marks Entry", icon: <FileSignature className="w-6 h-6" /> },
  ];

  const principalOptions = [
    ...facultyOptions,
    { title: "Report Entry", icon: <ClipboardCheck className="w-6 h-6" /> },
  ];

  const options = isPrincipal ? principalOptions : facultyOptions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-950 p-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            {isPrincipal ? "Principal Dashboard" : "Faculty Dashboard"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {options.map((option, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4 text-purple-600">
                  {option.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{option.title}</h3>
                <Button className="bg-purple-600 hover:bg-purple-700">Go to {option.title}</Button>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}