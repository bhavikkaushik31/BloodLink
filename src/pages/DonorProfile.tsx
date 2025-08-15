import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Calendar, MapPin, Bell, Settings, Trophy, CheckCircle } from "lucide-react";

interface DonorProfile {
  id: string;
  name: string;
  email: string;
  bloodType: string;
  lastDonation: Date;
  totalDonations: number;
  nextEligibleDate: Date;
  location: string;
  onCallNow: boolean;
  notifications: {
    sms: boolean;
    email: boolean;
    push: boolean;
  };
  healthStatus: {
    recentIllness: boolean;
    medications: boolean;
    recentTravel: boolean;
  };
  reliability: number;
}

// Demo donor profile
const demoProfile: DonorProfile = {
  id: '1',
  name: 'John Smith',
  email: 'john.smith@email.com',
  bloodType: 'O-',
  lastDonation: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000), // 95 days ago
  totalDonations: 24,
  nextEligibleDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Eligible now
  location: 'Downtown District',
  onCallNow: true,
  notifications: {
    sms: true,
    email: true,
    push: false
  },
  healthStatus: {
    recentIllness: false,
    medications: false,
    recentTravel: false
  },
  reliability: 92
};

const demoAlerts = [
  {
    id: '1',
    hospital: 'AIIMS Delhi',
    bloodType: 'O-',
    urgency: 'critical',
    distance: '2.5 km',
    timeAgo: '15 min ago',
    status: 'active'
  },
  {
    id: '2',
    hospital: 'Safdarjung Hospital',
    bloodType: 'O-',
    urgency: 'high',
    distance: '4.2 km',
    timeAgo: '1 hour ago',
    status: 'active'
  }
];

export default function DonorProfile() {
  const [profile, setProfile] = useState<DonorProfile>(demoProfile);

  const updateNotificationSetting = (channel: keyof typeof profile.notifications, enabled: boolean) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [channel]: enabled
      }
    }));
  };

  const toggleOnCall = () => {
    setProfile(prev => ({
      ...prev,
      onCallNow: !prev.onCallNow
    }));
  };

  const daysSinceLastDonation = Math.floor((Date.now() - profile.lastDonation.getTime()) / (1000 * 60 * 60 * 24));
  const isEligible = profile.nextEligibleDate <= new Date();
  const daysUntilEligible = Math.max(0, Math.ceil((profile.nextEligibleDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const getBloodTypeInfo = (bloodType: string) => {
    if (bloodType === 'O-') return { label: 'Universal Donor', color: 'text-critical' };
    if (bloodType === 'AB+') return { label: 'Universal Recipient', color: 'text-blood-rare' };
    return { label: 'Compatible Types Available', color: 'text-blood-common' };
  };

  const bloodTypeInfo = getBloodTypeInfo(profile.bloodType);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Donor Profile</h1>
          <p className="text-muted-foreground">Manage your donation profile and preferences</p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
              
              <div className="flex items-center space-x-4 mt-3">
                <Badge variant="outline" className={`${bloodTypeInfo.color} border-current`}>
                  {profile.bloodType} - {bloodTypeInfo.label}
                </Badge>
                <Badge variant="outline" className="text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  {profile.location}
                </Badge>
                <Badge className={profile.onCallNow ? 'bg-success' : 'bg-muted'}>
                  {profile.onCallNow ? 'On Call Now' : 'Standby'}
                </Badge>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{profile.totalDonations}</div>
              <div className="text-sm text-muted-foreground">Total Donations</div>
              <div className="flex items-center mt-2">
                <Trophy className="h-4 w-4 text-urgent-normal mr-1" />
                <span className="text-sm">{profile.reliability}% Reliability</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Eligibility Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Donation Eligibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEligible ? (
            <Alert className="border-success bg-success/5">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                You are eligible to donate now! Last donation was {daysSinceLastDonation} days ago.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                You can donate again in {daysUntilEligible} days (90-day minimum interval for whole blood).
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{daysSinceLastDonation}</div>
              <div className="text-sm text-muted-foreground">Days Since Last Donation</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{Math.max(0, 90 - daysSinceLastDonation)}</div>
              <div className="text-sm text-muted-foreground">Days Until Eligible</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{Math.round((daysSinceLastDonation / 90) * 100)}%</div>
              <div className="text-sm text-muted-foreground">Recovery Progress</div>
              <Progress value={Math.min((daysSinceLastDonation / 90) * 100, 100)} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* On-Call Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Emergency On-Call Status
          </CardTitle>
          <CardDescription>
            Enable this to receive priority notifications for critical blood shortages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="on-call-toggle" className="text-base font-medium">
                On-Call Now
              </Label>
              <p className="text-sm text-muted-foreground">
                You'll receive immediate alerts for emergency situations in your area
              </p>
            </div>
            <Switch
              id="on-call-toggle"
              checked={profile.onCallNow}
              onCheckedChange={toggleOnCall}
            />
          </div>
        </CardContent>
      </Card>


      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose how you'd like to receive blood shortage alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-notifications" className="text-base">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive text messages for urgent alerts</p>
            </div>
            <Switch
              id="sms-notifications"
              checked={profile.notifications.sms}
              onCheckedChange={(checked) => updateNotificationSetting('sms', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive detailed email alerts</p>
            </div>
            <Switch
              id="email-notifications"
              checked={profile.notifications.email}
              onCheckedChange={(checked) => updateNotificationSetting('email', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Browser and mobile app notifications</p>
            </div>
            <Switch
              id="push-notifications"
              checked={profile.notifications.push}
              onCheckedChange={(checked) => updateNotificationSetting('push', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}