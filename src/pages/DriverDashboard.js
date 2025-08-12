import React, { useState, useEffect } from 'react';
import {
  useGetDriverTripsQuery,
  useStartTripMutation,
  useCompleteTripMutation,
  useGetDriveSessionsQuery,
  useCreateDriveSessionMutation,
  useEndDriveSessionMutation,
  useEndRestAndStartDriveMutation,
  useGetRefuelLogsQuery,
  useAddRefuelEventMutation,
} from '../redux/apiSlice';

export default function DriverDashboard() {
  const { data: trips = [], refetch: refetchTrips } = useGetDriverTripsQuery();
  const [startTrip] = useStartTripMutation();
  const [completeTrip] = useCompleteTripMutation();
  const [selectedTrip, setSelectedTrip] = useState(null);

  const { data: sessions = [], refetch: refetchSessions } = useGetDriveSessionsQuery(selectedTrip?._id, { skip: !selectedTrip });
  const [createDriveSession] = useCreateDriveSessionMutation();
  const [endDriveSession] = useEndDriveSessionMutation();
  const [endRestAndStartDrive] = useEndRestAndStartDriveMutation();

  const { data: refuelLogs = [], refetch: refetchRefuels } = useGetRefuelLogsQuery(selectedTrip?._id, { skip: !selectedTrip });
  const [addRefuelEvent] = useAddRefuelEventMutation();

  const handleStartTrip = async (tripId) => {
    await startTrip(tripId);
    refetchTrips();
  };

  const handleCompleteTrip = async (tripId) => {
    await completeTrip(tripId);
    refetchTrips();
  };

  const handleCreateSession = async () => {
    const now = new Date().toISOString();
    await createDriveSession({ tripId: selectedTrip._id, startTime: now, endTime: now, fuelUsed: 0, kmCovered: 0 });
    refetchSessions();
  };

  const handleEndSession = async (sessionId) => {
    await endDriveSession({ sessionId, fuelLeft: 10 }); // example fuel left
    refetchSessions();
  };

  const handleEndRest = async (restId) => {
    await endRestAndStartDrive({ restId, fuelLeft: 10 });
    refetchSessions();
  };

  const handleAddRefuel = async () => {
    await addRefuelEvent({
      tripId: selectedTrip._id,
      refuelData: {
        event_time: new Date().toISOString(),
        fuel_before: 20,
        fuel_added: 30,
        fuel_after: 50,
        payment_mode: 'cash',
      }
    });
    refetchRefuels();
  };

  return (
    <div>
      <h2>My Trips</h2>
      {trips.map(trip => (
        <div key={trip._id}>
          <h4>{trip.start_city} → {trip.end_city} ({trip.status})</h4>
          {trip.status === 'scheduled' && <button onClick={() => handleStartTrip(trip._id)}>Start Trip</button>}
          {trip.status === 'ongoing' && <button onClick={() => handleCompleteTrip(trip._id)}>Complete Trip</button>}
          <button onClick={() => setSelectedTrip(trip)}>View Trip Details</button>
        </div>
      ))}

      {selectedTrip && (
        <>
          <h3>Drive Sessions</h3>
          <button onClick={handleCreateSession}>Start New Drive Session</button>
          {sessions.map(session => (
            <div key={session._id}>
              Session started at {new Date(session.start_time).toLocaleString()}
              {!session.end_time && <button onClick={() => handleEndSession(session._id)}>End Session</button>}
            </div>
          ))}

          <h3>Refuel Logs</h3>
          <button onClick={handleAddRefuel}>Add Refuel</button>
          {refuelLogs.map(refuel => (
            <div key={refuel._id}>
              {new Date(refuel.event_time).toLocaleString()} — {refuel.fuel_added}L added
            </div>
          ))}
        </>
      )}
    </div>
  );
}
