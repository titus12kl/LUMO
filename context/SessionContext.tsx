import React, { createContext, useContext, useState } from "react";

export type Session = {
  id: string;
  stationName: string;
  time: number;
  energy: number;
  cost: number;
  date: string;
};

type SessionContextType = {
  sessions: Session[];
  addSession: (session: Session) => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);

  const addSession = (session: Session) => {
    setSessions((prev) => [session, ...prev]);
  };

  return (
    <SessionContext.Provider value={{ sessions, addSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessions() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessions must be used within SessionProvider");
  }
  return context;
}
