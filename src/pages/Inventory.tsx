import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Droplets, AlertTriangle, TrendingDown, Calendar, Plus, Package } from "lucide-react";

interface InventoryUnit {
  id: string;
  bloodType: string;
  component: 'whole_blood' | 'red_cells' | 'plasma' | 'platelets';
  quantity: number;
  expiryDate: Date;
  status: 'available' | 'reserved' | 'expired';
  location: string;
}

interface BloodTypeInventory {
  bloodType: string;
  available: number;
  reserved: number;
  threshold: number;
  expiringSoon: number;
}

// Demo inventory data
const demoInventory: BloodTypeInventory[] = [
  { bloodType: 'O-', available: 2, reserved: 3, threshold: 10, expiringSoon: 1 },
  { bloodType: 'O+', available: 15, reserved: 5, threshold: 20, expiringSoon: 3 },
  { bloodType: 'A-', available: 8, reserved: 2, threshold: 12, expiringSoon: 0 },
  { bloodType: 'A+', available: 22, reserved: 8, threshold: 25, expiringSoon: 2 },
  { bloodType: 'B-', available: 5, reserved: 1, threshold: 8, expiringSoon: 1 },
  { bloodType: 'B+', available: 18, reserved: 4, threshold: 20, expiringSoon: 0 },
  { bloodType: 'AB-', available: 3, reserved: 0, threshold: 5, expiringSoon: 0 },
  { bloodType: 'AB+', available: 12, reserved: 3, threshold: 15, expiringSoon: 1 },
];

const demoUnits: InventoryUnit[] = [
  { id: '1', bloodType: 'O-', component: 'red_cells', quantity: 1, expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), status: 'available', location: 'Refrigerator A1' },
  { id: '2', bloodType: 'A+', component: 'platelets', quantity: 1, expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), status: 'available', location: 'Agitator B2' },
  { id: '3', bloodType: 'O+', component: 'plasma', quantity: 2, expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), status: 'reserved', location: 'Freezer C1' },
];

const getStockStatus = (available: number, threshold: number) => {
  const percentage = (available / threshold) * 100;
  if (percentage <= 25) return 'critical';
  if (percentage <= 50) return 'low';
  if (percentage <= 75) return 'medium';
  return 'good';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'critical': return 'bg-critical text-critical-foreground';
    case 'low': return 'bg-urgent-high text-white';
    case 'medium': return 'bg-urgent-normal text-white';
    case 'good': return 'bg-success text-white';
    default: return 'bg-muted text-muted-foreground';
  }
};

const formatComponent = (component: string) => {
  return component.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const formatExpiry = (date: Date) => {
  const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Expired';
  if (days === 1) return '1 day';
  return `${days} days`;
};

export default function Inventory() {
  const [inventory, setInventory] = useState<BloodTypeInventory[]>(demoInventory);
  const [units, setUnits] = useState<InventoryUnit[]>(demoUnits);
  const [selectedBloodType, setSelectedBloodType] = useState<string | null>(null);

  const criticalStock = inventory.filter(item => getStockStatus(item.available, item.threshold) === 'critical');
  const expiringSoon = units.filter(unit => {
    const daysToExpiry = Math.ceil((unit.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysToExpiry <= 3 && unit.status === 'available';
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blood Inventory</h1>
          <p className="text-muted-foreground">Monitor stock levels and manage blood unit inventory</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Units
        </Button>
      </div>

      {/* Alerts */}
      {(criticalStock.length > 0 || expiringSoon.length > 0) && (
        <div className="space-y-3">
          {criticalStock.length > 0 && (
            <Alert className="border-critical bg-critical/5">
              <AlertTriangle className="h-4 w-4 text-critical" />
              <AlertDescription className="text-critical">
                Critical stock levels: {criticalStock.map(item => item.bloodType).join(', ')} below minimum threshold
              </AlertDescription>
            </Alert>
          )}
          
          {expiringSoon.length > 0 && (
            <Alert className="border-urgent-high bg-urgent-high/5">
              <Calendar className="h-4 w-4 text-urgent-high" />
              <AlertDescription className="text-urgent-high">
                {expiringSoon.length} unit{expiringSoon.length > 1 ? 's' : ''} expiring within 3 days
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Blood Type Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Droplets className="h-5 w-5 mr-2 text-blood-universal" />
            Blood Type Overview
          </CardTitle>
          <CardDescription>
            Current stock levels across all blood types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {inventory.map((item) => {
              const status = getStockStatus(item.available, item.threshold);
              const percentage = Math.min((item.available / item.threshold) * 100, 100);
              
              return (
                <Card 
                  key={item.bloodType} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedBloodType === item.bloodType ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedBloodType(selectedBloodType === item.bloodType ? null : item.bloodType)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-blood-universal font-semibold">
                        {item.bloodType}
                      </Badge>
                      <Badge className={getStatusColor(status)}>
                        {status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Available</span>
                        <span className="font-semibold">{item.available}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Threshold: {item.threshold}</span>
                        {item.expiringSoon > 0 && (
                          <span className="text-urgent-high">
                            {item.expiringSoon} expiring
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Units Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Unit Details
            {selectedBloodType && (
              <Badge variant="outline" className="ml-2">
                Filtered: {selectedBloodType}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Blood Type</TableHead>
                <TableHead>Component</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units
                .filter(unit => !selectedBloodType || unit.bloodType === selectedBloodType)
                .map((unit) => {
                  const daysToExpiry = Math.ceil((unit.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  const isExpiringSoon = daysToExpiry <= 3;
                  
                  return (
                    <TableRow key={unit.id}>
                      <TableCell>
                        <Badge variant="outline" className="text-blood-universal">
                          {unit.bloodType}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatComponent(unit.component)}</TableCell>
                      <TableCell>{unit.quantity}</TableCell>
                      <TableCell className="text-muted-foreground">{unit.location}</TableCell>
                      <TableCell className={isExpiringSoon ? 'text-urgent-high font-medium' : ''}>
                        {formatExpiry(unit.expiryDate)}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={unit.status === 'available' ? 'default' : 'secondary'}
                          className={unit.status === 'reserved' ? 'bg-urgent-normal text-white' : ''}
                        >
                          {unit.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          {unit.status === 'available' && (
                            <Button size="sm" variant="outline">
                              Reserve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          
          {units.filter(unit => !selectedBloodType || unit.bloodType === selectedBloodType).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No units found for the selected criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}