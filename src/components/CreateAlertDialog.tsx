import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAlert: (alertData: any) => void;
}

export function CreateAlertDialog({ open, onOpenChange, onCreateAlert }: CreateAlertDialogProps) {
  const [bloodType, setBloodType] = useState("");
  const [unitsNeeded, setUnitsNeeded] = useState("");
  const [urgency, setUrgency] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAlert({
      bloodType,
      unitsNeeded: parseInt(unitsNeeded),
      urgency,
      hospital: "Demo Hospital",
      location: "Demo Location"
    });
    onOpenChange(false);
    setBloodType("");
    setUnitsNeeded("");
    setUrgency("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Blood Alert</DialogTitle>
          <DialogDescription>Create an emergency blood shortage alert</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="bloodType">Blood Type</Label>
            <Select value={bloodType} onValueChange={setBloodType}>
              <SelectTrigger>
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="O-">O-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="units">Units Needed</Label>
            <Input
              id="units"
              type="number"
              value={unitsNeeded}
              onChange={(e) => setUnitsNeeded(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="urgency">Urgency</Label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Create Alert</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}