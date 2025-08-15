import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, AlertTriangle, Users, Activity } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }
  let stats;
  // Demo dashboard data
  if (user.role == 'donor') {
  stats = [
    { title: "Active Alerts", value: "3", icon: AlertTriangle, color: "text-critical" },
    { title: "Units in Stock", value: "156", icon: Heart, color: "text-success" },
    { title: "Response Rate", value: "94%", icon: Activity, color: "text-urgent-normal" },
  ];
}
else{   stats = [
    { title: "Active Alerts", value: "3", icon: AlertTriangle, color: "text-critical" },
    { title: "Available Donors", value: "1,247", icon: Users, color: "text-primary" },
    { title: "Units in Stock", value: "156", icon: Heart, color: "text-success" },
    { title: "Response Rate", value: "94%", icon: Activity, color: "text-urgent-normal" },
  ];
}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.name}
        </h1>
        <p className="text-muted-foreground">
          {user.role === 'donor' ? 'Thank you for being a life-saving donor' : 'Monitor blood shortage alerts and donor responses'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-critical" />
            BloodLink Platform
          </CardTitle>
          <CardDescription>
            Real-time blood shortage alerts and donor mobilization system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Crossmatch Confidence Score</Badge>
            <Badge variant="outline">Geospatial Matching</Badge>
            <Badge variant="outline">Multi-channel Notifications</Badge>
            <Badge variant="outline">Unit Swap Ledger</Badge>
            <Badge variant="outline">Real-time Updates</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
