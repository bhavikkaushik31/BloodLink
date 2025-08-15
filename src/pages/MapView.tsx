import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, Circle, InfoWindow } from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { MapPin, Users, Layers } from "lucide-react";

// Real coordinates for demo (replace with real hospital/donor coords later)
interface Location {
  id: string;
  name: string;
  type: "hospital" | "donor";
  lat: number;
  lng: number;
  status?: string;
  bloodType?: string;
  ccs?: number;
}

const demoLocations: Location[] = [
  { id: "hospital_1", name: "City General Hospital", type: "hospital", lat: 28.6139, lng: 77.2090 },
  { id: "donor_1", name: "Amit Sharma", type: "donor", lat: 28.6239, lng: 77.2190, status: "responded_yes", bloodType: "O-", ccs: 95 },
  { id: "donor_2", name: "Priya Singh", type: "donor", lat: 28.6339, lng: 77.2020, status: "contacted", bloodType: "O-", ccs: 88 },
  { id: "donor_3", name: "Neha Gupta", type: "donor", lat: 28.6050, lng: 77.2200, status: "UnAvailable", bloodType: "O-", ccs: 82 },
  { id: "donor_4", name: "Vikram Mehra", type: "donor", lat: 28.6180, lng: 77.1950, status: "UnAvailable", bloodType: "O-", ccs: 78 },
  { id: "donor_5", name: "Rohit Sharma", type: "donor", lat: 28.5900, lng: 77.2150, status: "responded_no", bloodType: "O-", ccs: 85 },
  { id: "donor_6", name: "Virat Kohli", type: "donor", lat: 28.6400, lng: 77.2300, status: "UnAvailable", bloodType: "O-", ccs: 92 },
  { id: "donor_7", name: "Anil Kapoor", type: "donor", lat: 28.5800, lng: 77.2050, status: "en_route", bloodType: "O-", ccs: 88 },
];

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "0.5rem",
};

export default function MapView() {
  const [radius, setRadius] = useState([10]); // km
  const [selected, setSelected] = useState<Location | null>(null);
  const [showDonors, setShowDonors] = useState(true);

  const hospital = demoLocations.find((loc) => loc.type === "hospital");
  const donors = demoLocations.filter((loc) => loc.type === "donor");

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "" // API key from .env (Vite)
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "responded_yes":
        return "green";
      case "en_route":
        return "blue";
      case "contacted":
        return "orange";
      case "responded_no":
        return "gray";
      case "UnAvailable":
        return "black";
      default:
        return "red";
    }
  };

  const onMapClick = useCallback(() => setSelected(null), []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Map View</h1>
          <p className="text-muted-foreground">Visualize donor locations and search radius</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-critical">
            O- Emergency Alert
          </Badge>
          <Badge variant="outline">
            {donors.length} donors in area
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Layers className="h-5 w-5 mr-2" />
              Map Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Radius</label>
              <Slider
                value={radius}
                onValueChange={setRadius}
                max={25}
                min={1}
                step={1}
                className="mb-2"
              />
              <div className="text-sm text-muted-foreground">
                {radius[0]} km radius
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant={showDonors ? "default" : "outline"}
                size="sm"
                onClick={() => setShowDonors(!showDonors)}
                className="w-full"
              >
                <Users className="h-4 w-4 mr-2" />
                {showDonors ? 'Hide' : 'Show'} Donors
              </Button>
            </div>

            {/* ----- LEGEND (ADDED) ----- */}
            <div className="space-y-2">
              <h4 className="font-medium">Legend</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-critical rounded-full mr-2"></div>
                  Hospital
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-success rounded-full mr-2"></div>
                  Responded Yes
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                  En Route
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-urgent-normal rounded-full mr-2"></div>
                  Contacted
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-black rounded-full mr-2"></div>
                   UnAvailable
                   </div>

              </div>
              <div className="mt-4 p-2 bg-gray-100 rounded-md text-sm">
    <span className="font-medium">Alert Radius:</span>{" "}
    <span className="text-gray-700">{radius} km</span>
  </div>
            </div>
            {/* ----- END LEGEND ----- */}
          </CardContent>
        </Card>

        {/* Map */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Live Donor Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoaded && hospital && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{ lat: hospital.lat, lng: hospital.lng }}
                zoom={13}
                onClick={onMapClick}
              >
                {/* Hospital Marker */}
                <Marker
                  position={{ lat: hospital.lat, lng: hospital.lng }}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "red",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "white",
                  }}
                  onClick={() => setSelected(hospital)}
                />

                {/* Search Radius Circle */}
                <Circle
                  center={{ lat: hospital.lat, lng: hospital.lng }}
                  radius={radius[0] * 1000}
                  options={{
                    fillColor: "#FF0000",
                    fillOpacity: 0.08,
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.35,
                    strokeWeight: 1,
                  }}
                />

                {/* Donor Markers */}
                {showDonors && donors.map((donor) => (
                  <Marker
                    key={donor.id}
                    position={{ lat: donor.lat, lng: donor.lng }}
                    icon={{
                      path: window.google.maps.SymbolPath.CIRCLE,
                      scale: 6,
                      fillColor: getStatusColor(donor.status),
                      fillOpacity: Math.max(0.3, (donor.ccs ?? 100) / 100),
                      strokeWeight: 1,
                      strokeColor: "white",
                    }}
                    onClick={() => setSelected(donor)}
                  />
                ))}

                {/* Info Window */}
                {selected && (
                  <InfoWindow
                    position={{ lat: selected.lat, lng: selected.lng }}
                    onCloseClick={() => setSelected(null)}
                  >
                    <div>
                      <h4 className="font-medium">{selected.name}</h4>
                      {selected.type === "donor" && (
                        <p className="text-sm text-muted-foreground">
                          {selected.bloodType} • CCS: {selected.ccs}
                        </p>
                      )}
                      {selected.type === "hospital" && (
                        <p className="text-sm text-muted-foreground">Emergency Hospital</p>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            )}

            {!isLoaded && (
              <div className="w-full h-96 flex items-center justify-center text-sm text-muted-foreground">
                Loading map...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
