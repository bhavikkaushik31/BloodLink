import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreateAlertDialog } from "@/components/CreateAlertDialog";
import { AlertTriangle, Clock, Users, MapPin, Plus, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BloodAlert {
  id: string;
  bloodType: string;
  unitsNeeded: number;
  urgency: 'critical' | 'high' | 'normal';
  hospital: string;
  location: string;
  createdAt: Date;
  status: 'open' | 'partially_fulfilled' | 'resolved';
  respondingDonors: number;
  matchedDonors: number;
}

// Demo data
const demoAlerts: BloodAlert[] = [
  {
    id: '1',
    bloodType: 'O-',
    unitsNeeded: 5,
    urgency: 'critical',
    hospital: 'AIIMS Delhi',
    location: '2.5 km away',
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    status: 'open',
    respondingDonors: 12,
    matchedDonors: 28
  },
  {
    id: '2',
    bloodType: 'A+',
    unitsNeeded: 3,
    urgency: 'high',
    hospital: 'Safdarjung Hospital',
    location: '5.1 km away',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'partially_fulfilled',
    respondingDonors: 8,
    matchedDonors: 45
  }
];

// Map of hospital to demo matches
const hospitalMatches: Record<string, string[]> = {
  "AIIMS Delhi": [
    "Amit Sharma",
    "Priya Singh",
    "Rahul Verma",
    "Neha Gupta",
    "Vikram Mehra"
  ],
  "Safdarjung Hospital": [
    "Sunita Yadav",
    "Rohit Saini",
    "Pooja Chauhan",
    "Anil Kumar",
    "Suman Joshi"
  ],
  // Add more hospitals as needed
};

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'critical': return 'bg-critical text-critical-foreground';
    case 'high': return 'bg-urgent-high text-white';
    case 'normal': return 'bg-urgent-normal text-white';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return 'bg-critical text-critical-foreground';
    case 'partially_fulfilled': return 'bg-urgent-high text-white';
    case 'resolved': return 'bg-success text-white';
    default: return 'bg-muted text-muted-foreground';
  }
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<BloodAlert[]>(demoAlerts);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  // State to track which alert's matches are open
  const [openMatchesId, setOpenMatchesId] = useState<string | null>(null);

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleCreateAlert = (alertData: any) => {
    const newAlert: BloodAlert = {
      id: Date.now().toString(),
      ...alertData,
      createdAt: new Date(),
      status: 'open' as const,
      respondingDonors: 0,
      matchedDonors: Math.floor(Math.random() * 50) + 10 // Simulated matches
    };

    setAlerts(prev => [newAlert, ...prev]);
    toast({
      title: "Alert Created",
      description: `Emergency alert for ${alertData.bloodType} blood type has been activated.`,
    });
  };

  const criticalAlerts = alerts.filter(alert => alert.urgency === 'critical');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blood Shortage Alerts</h1>
          <p className="text-muted-foreground">Manage emergency blood requests and donor mobilization</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-critical hover:bg-critical/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {criticalAlerts.length > 0 && (
        <Alert className="border-critical bg-critical/5">
          <AlertTriangle className="h-4 w-4 text-critical" />
          <AlertDescription className="text-critical">
            {criticalAlerts.length} critical alert{criticalAlerts.length > 1 ? 's' : ''} require immediate attention
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {alerts.map((alert) => (
          <Card key={alert.id} className="relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
              alert.urgency === 'critical' ? 'bg-critical' : 
              alert.urgency === 'high' ? 'bg-urgent-high' : 'bg-urgent-normal'
            }`} />
            
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Badge className={getUrgencyColor(alert.urgency)}>
                      {alert.urgency.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-blood-universal font-semibold">
                      {alert.bloodType}
                    </Badge>
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTimeAgo(alert.createdAt)}
                </div>
              </div>
              
              <CardTitle className="text-xl">{alert.hospital}</CardTitle>
              <CardDescription className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {alert.location}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{alert.unitsNeeded}</div>
                  <div className="text-sm text-muted-foreground">Units Needed</div>
                </div>
                
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-success">{alert.respondingDonors}</div>
                  <div className="text-sm text-muted-foreground">Responding</div>
                </div>
                
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary-glow">{alert.matchedDonors}</div>
                  <div className="text-sm text-muted-foreground">Matched Donors</div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      setOpenMatchesId(openMatchesId === alert.id ? null : alert.id)
                    }
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View Matches
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Activity className="h-4 w-4 mr-2" />
                    Monitor
                  </Button>
                </div>
              </div>
              {/* Show matches if this alert's matches are open */}
              {openMatchesId === alert.id && (
                <div className="mt-4 p-4 border rounded bg-muted">
                  <div className="font-semibold mb-2">Matched Donors:</div>
                  <ul className="list-disc pl-5">
                    {(hospitalMatches[alert.hospital] || []).slice(
                      0,
                      alert.matchedDonors > (hospitalMatches[alert.hospital]?.length || 0)
                        ? hospitalMatches[alert.hospital]?.length
                        : alert.matchedDonors
                    ).map((name, idx) => (
                      <li key={idx}>{name}</li>
                    ))}
                  </ul>
                  {alert.matchedDonors > (hospitalMatches[alert.hospital]?.length || 0) && (
                    <div className="text-xs text-muted-foreground mt-2">
                      +{alert.matchedDonors - (hospitalMatches[alert.hospital]?.length || 0)} more donors
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateAlertDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateAlert={handleCreateAlert}
      />
    </div>
  );
}