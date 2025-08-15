import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { MapPin, Phone, Mail, Clock, TrendingUp, AlertCircle } from "lucide-react";

interface DonorMatch {
  id: string;
  name: string;
  bloodType: string;
  distance: number;
  ccs: number; // Crossmatch Confidence Score
  lastDonation: Date;
  reliability: number;
  status: 'available' | 'contacted' | 'responded_yes' | 'responded_no' | 'en_route' | 'arrived';
  phone: string;
  email: string;
  eligibleDate: Date;
}

// Demo donor matches with CCS calculation
const demoMatches: DonorMatch[] = [
  {
    id: '1',
    name: 'Virat Kohli',
    bloodType: 'O-',
    distance: 1.2,
    ccs: 95,
    lastDonation: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000), // 95 days ago
    reliability: 92,
    status: 'responded_yes',
    phone: '+1 555-0123',
    email: 'sarah.m@email.com',
    eligibleDate: new Date()
  },
  {
    id: '2',
    name: 'Rohit Sharma',
    bloodType: 'O-',
    distance: 2.8,
    ccs: 88,
    lastDonation: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
    reliability: 85,
    status: 'contacted',
    phone: '+1 555-0124',
    email: 'mike.chen@email.com',
    eligibleDate: new Date()
  },
  {
    id: '3',
    name: 'Anil Kapoor',
    bloodType: 'O-',
    distance: 4.1,
    ccs: 82,
    lastDonation: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000), // 105 days ago
    reliability: 78,
    status: 'available',
    phone: '+1 555-0125',
    email: 'j.taylor@email.com',
    eligibleDate: new Date()
  }
];

const getCCSColor = (score: number) => {
  if (score >= 90) return 'text-success';
  if (score >= 75) return 'text-urgent-normal';
  if (score >= 60) return 'text-urgent-high';
  return 'text-critical';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'responded_yes': return 'bg-success text-white';
    case 'en_route': return 'bg-primary text-primary-foreground';
    case 'arrived': return 'bg-success text-white';
    case 'contacted': return 'bg-urgent-normal text-white';
    case 'responded_no': return 'bg-muted text-muted-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

export default function Matches() {
  const [matches, setMatches] = useState<DonorMatch[]>(demoMatches);

  const updateDonorStatus = (donorId: string, newStatus: DonorMatch['status']) => {
    setMatches(prev => prev.map(match => 
      match.id === donorId ? { ...match, status: newStatus } : match
    ));
  };

  const formatDistance = (distance: number) => `${distance.toFixed(1)} km`;
  const formatReliability = (reliability: number) => `${reliability}%`;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Donor Matches</h1>
          <p className="text-muted-foreground">Eligible donors ranked by Crossmatch Confidence Score</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Active Alert: <span className="font-semibold text-critical">O- Blood Type</span>
          </div>
          <Badge variant="outline" className="text-critical">
            5 units needed
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Crossmatch Confidence Score Explanation
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>CCS factors: Blood compatibility (30%), Donation eligibility (20%), Distance (20%), Historical reliability (20%), Health status (10%)</p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {matches.map((match) => (
          <Card key={match.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Donor Info */}
                <div className="lg:col-span-4 flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {match.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{match.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-blood-universal">
                        {match.bloodType}
                      </Badge>
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {formatDistance(match.distance)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CCS Score */}
                <div className="lg:col-span-2 text-center">
                  <div className={`text-3xl font-bold ${getCCSColor(match.ccs)}`}>
                    {match.ccs}
                  </div>
                  <div className="text-xs text-muted-foreground">CCS Score</div>
                  <Progress value={match.ccs} className="mt-1 h-2" />
                </div>

                {/* Stats */}
                <div className="lg:col-span-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Last Donation</div>
                    <div className="font-medium">
                      {Math.floor((Date.now() - match.lastDonation.getTime()) / (1000 * 60 * 60 * 24))} days ago
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Reliability</div>
                    <div className="font-medium">{formatReliability(match.reliability)}</div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="lg:col-span-3 flex items-center justify-between">
                  <Badge className={getStatusColor(match.status)}>
                    {match.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  
                  <div className="flex space-x-2">
                    {match.status === 'available' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateDonorStatus(match.id, 'contacted')}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Contact
                      </Button>
                    )}
                    {match.status === 'responded_yes' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateDonorStatus(match.id, 'arrived')}
                      >
                        Mark Arrived
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Phone className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* CCS Breakdown */}
              <div className="mt-4 pt-4 border-t">
                <details className="text-sm">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    View CCS Breakdown
                  </summary>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                    <div>
                      <div className="text-muted-foreground">Blood Match</div>
                      <div className="font-medium text-success">30/30</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Eligibility</div>
                      <div className="font-medium text-success">20/20</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Distance</div>
                      <div className="font-medium text-success">{Math.floor(20 * (5 - match.distance) / 5)}/20</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Reliability</div>
                      <div className="font-medium text-urgent-normal">{Math.floor(match.reliability * 0.2)}/20</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Health</div>
                      <div className="font-medium text-success">10/10</div>
                    </div>
                  </div>
                </details>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}