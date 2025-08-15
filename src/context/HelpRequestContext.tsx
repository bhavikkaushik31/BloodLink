import React, { createContext, useContext, useState } from "react";

interface HelpRequest {
  alertId: string;
  donorName: string;
}

const HelpRequestContext = createContext<{
  helpRequests: HelpRequest[];
  addHelpRequest: (alertId: string, donorName: string) => void;
}>({
  helpRequests: [],
  addHelpRequest: () => {},
});

export function HelpRequestProvider({ children }: { children: React.ReactNode }) {
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);

  const addHelpRequest = (alertId: string, donorName: string) => {
    setHelpRequests((prev) => [...prev, { alertId, donorName }]);
  };

  return (
    <HelpRequestContext.Provider value={{ helpRequests, addHelpRequest }}>
      {children}
    </HelpRequestContext.Provider>
  );
}

export function useHelpRequestContext() {
  return useContext(HelpRequestContext);
}