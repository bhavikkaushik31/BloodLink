import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { MapPin, Phone, Mail, AlertCircle, Droplet } from "lucide-react";
import { useHelpRequestContext } from "@/context/HelpRequestContext";

interface BloodBank {
  id: string;
  name: string;
  distance: number; // km
  location: string;
  unitsAvailable: number;
  unitsNeeded: number;
  phone: string;
  email: string;
  lastUpdated: Date;
  capabilityScore: number; // % rating for reliability
}

const demoBloodBanks: BloodBank[] = [
  {
    id: "1",
    name: "AIIMS Delhi",
    distance: 1.5,
    location: "Delhi",
    unitsAvailable: 18,
    unitsNeeded: 5,
    phone: "+1 555-1111",
    email: "contact@redcrosscentral.com",
    lastUpdated: new Date(),
    capabilityScore: 92
  },
  {
    id: "2",
    name: "Safdarjung Hospital",
    distance: 3.2,
    location: "Delhi",
    unitsAvailable: 10,
    unitsNeeded: 8,
    phone: "+1 555-2222",
    email: "bloodbank@citygeneral.com",
    lastUpdated: new Date(),
    capabilityScore: 85
  },
  {
    id: "3",
    name: "Lok Nayak Hospital",
    distance: 5.6,
    location: "Delhi",
    unitsAvailable: 25,
    unitsNeeded: 0,
    phone: "+1 555-3333",
    email: "info@metroregional.org",
    lastUpdated: new Date(),
    capabilityScore: 78
  }
];

const getStatusColor = (unitsAvailable: number, unitsNeeded: number) => {
  if (unitsNeeded === 0) return "bg-success text-white";
  if (unitsAvailable < unitsNeeded) return "bg-critical text-white";
  return "bg-urgent-normal text-white";
};

const getStatusText = (unitsAvailable: number, unitsNeeded: number) => {
  if (unitsNeeded === 0) return "Normal Stock";
  if (unitsAvailable < unitsNeeded) return "Critical Shortage";
  return "Low Stock";
};

export default function NearbyBloodBanks() {
  const [bloodBanks] = useState<BloodBank[]>(demoBloodBanks);
  const { helpRequests } = useHelpRequestContext();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nearby Blood Banks</h1>
          <p className="text-muted-foreground">
            Showing available stock and urgent shortages in your area
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {bloodBanks.map((bank) => (
          <Card key={bank.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Bank Info */}
                <div className="lg:col-span-4 flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {bank.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{bank.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {bank.location} ({bank.distance.toFixed(1)} km)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Units Info */}
                <div className="lg:col-span-3 text-center">
                  <div className="flex justify-center space-x-6">
                    <div>
                      <div className="text-muted-foreground text-xs">Available Units</div>
                      <div className="text-xl font-bold text-success">{bank.unitsAvailable}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">Units Needed</div>
                      <div className="text-xl font-bold text-critical">{bank.unitsNeeded}</div>
                    </div>
                  </div>
                </div>

                {/* Capability */}
                <div className="lg:col-span-2 text-center">
                  <div className="text-xl font-bold text-primary">{bank.capabilityScore}%</div>
                  <div className="text-xs text-muted-foreground">Capability Score</div>
                  <Progress value={bank.capabilityScore} className="mt-1 h-2" />
                </div>

                {/* Status & Actions */}
                <div className="lg:col-span-3 flex items-center justify-between">
                  <Badge className={getStatusColor(bank.unitsAvailable, bank.unitsNeeded)}>
                    {getStatusText(bank.unitsAvailable, bank.unitsNeeded)}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer Info */}
              <div className="mt-4 pt-4 border-t text-xs text-muted-foreground flex justify-between">
                <span className="flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> Last Updated:{" "}
                  {bank.lastUpdated.toLocaleString()}
                </span>
                <span className="flex items-center">
                  <Droplet className="h-3 w-3 mr-1" /> Covers {Math.ceil(5 - bank.distance)} km radius
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Requests Section */}
      <Card>
        <CardHeader>
          <CardTitle>Donor Help Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {helpRequests.length === 0 && <li>No help requests yet.</li>}
            {helpRequests.map((req, idx) => (
              <li key={idx}>
                Alert ID: {req.alertId} — Donor: {req.donorName}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
