import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetDriveSessionsByTripQuery,
  useStartDriveSessionMutation,
  useEndDriveSessionMutation,
} from "./driveSessionsApi";
import { Table, Button, Badge, Spinner, Modal } from "react-bootstrap";
import moment from "moment";
import { toast } from "react-toastify";

const DriveSessionList = () => {
  const { tripId } = useParams();
  const { data: sessions = [], isLoading } =
    useGetDriveSessionsByTripQuery(tripId);
  const [startDriveSession] = useStartDriveSessionMutation();
  const [endDriveSession] = useEndDriveSessionMutation();

  const [endConfirmModal, setEndConfirmModal] = useState(false);
  const [sessionToEnd, setSessionToEnd] = useState(null);

  const handleStart = async () => {
    try {
      await startDriveSession(tripId).unwrap();
      toast.success("Drive session started successfully");
    } catch (err) {
      toast.error(err.data?.message || "Error starting drive session");
    }
  };

  const handleEnd = async () => {
    try {
      await endDriveSession(sessionToEnd._id).unwrap();
      toast.success("Drive session ended successfully");
    } catch (err) {
      toast.error(err.data?.message || "Error ending drive session");
    } finally {
      setEndConfirmModal(false);
      setSessionToEnd(null);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-3">
        <Button variant="success" size="sm" onClick={handleStart}>
          Start Drive Session
        </Button>
      </div>

      <Table responsive bordered hover size="sm">
        <thead>
          <tr>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session._id}>
              <td>{moment(session.startTime).format("MMM DD, YYYY HH:mm")}</td>
              <td>
                {session.endTime
                  ? moment(session.endTime).format("MMM DD, YYYY HH:mm")
                  : "Ongoing"}
              </td>
              <td>
                {session.endTime
                  ? moment
                      .duration(
                        moment(session.endTime).diff(moment(session.startTime))
                      )
                      .humanize()
                  : "Ongoing"}
              </td>
              <td>
                <Badge
                  bg={session.status === "active" ? "success" : "secondary"}
                >
                  {session.status}
                </Badge>
              </td>
              <td>
                {session.status === "active" && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSessionToEnd(session);
                      setEndConfirmModal(true);
                    }}
                  >
                    End
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* End Confirmation Modal */}
      <Modal show={endConfirmModal} onHide={() => setEndConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>End Drive Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to end this session started at{" "}
          {moment(sessionToEnd?.startTime).format("MMM DD, YYYY HH:mm")}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEndConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleEnd}>
            End Session
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DriveSessionList;
