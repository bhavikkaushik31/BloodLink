import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useHelpRequestContext } from "@/context/HelpRequestContext";

// Add a type for help requests
interface HelpRequest {
  alertId: string;
  donorName: string;
}

interface Alert {
  id: string;
  urgency: "critical" | "high";
  bloodType: string;
  hospital: string;
  distance: string;
  timeAgo: string;
}

const demoAlerts: Alert[] = [
  {
    id: "1",
    urgency: "critical",
    bloodType: "O+",
    hospital: "AIIMS Delhi",
    distance: "2 km",
    timeAgo: "10 min ago",
  },
  {
    id: "2",
    urgency: "high",
    bloodType: "A-",
    hospital: "Safdarjung Hospital",
    distance: "5 km",
    timeAgo: "25 min ago",
  },
  {
    id: "3",
    urgency: "critical",
    bloodType: "B+",
    hospital: "Lok Nayak Hospital",
    distance: "7 km",
    timeAgo: "1 hr ago",
  },
];

export default function NearbyAlerts() {
  const [alerts] = useState<Alert[]>(demoAlerts);
  const { helpRequests, addHelpRequest } = useHelpRequestContext();
  const donorName = "Amit Sharma"; // Example Indian donor name

  const handleHelp = (alertId: string) => {
    addHelpRequest(alertId, donorName);
    alert("Your request to help has been sent!");
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nearby Alerts</h1>
          <p className="text-muted-foreground">
            Showing urgent blood requests near your location
          </p>
        </div>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-critical" />
            Active Alerts Near You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge
                      className={
                        alert.urgency === "critical"
                          ? "bg-critical"
                          : "bg-urgent-high"
                      }
                    >
                      {alert.urgency.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-blood-universal">
                      {alert.bloodType}
                    </Badge>
                  </div>
                  <h4 className="font-medium">{alert.hospital}</h4>
                  <p className="text-sm text-muted-foreground">
                    {alert.distance} away • {alert.timeAgo}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                  <Button
                    size="sm"
                    className="bg-success hover:bg-success/90"
                    onClick={() => handleHelp(alert.id)}
                  >
                    I Can Help
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demo: Show help requests below */}
      <Card>
        <CardHeader>
          <CardTitle>My Help Requests (Demo)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {helpRequests.map((req, idx) => (
              <li key={idx}>
                Alert ID: {req.alertId} — Donor: {req.donorName}
              </li>
            ))}
            {helpRequests.length === 0 && <li>No help requests yet.</li>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}