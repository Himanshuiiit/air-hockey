import { useState } from "react";
import "../styles.css";
import Modal from "./components/Modal";
import uuid4 from "uuid4";
import { useNavigate } from "react-router-dom";

const HomePage = ({ socket }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (roomId) => {
    socket.emit("join-room", roomId);
    navigate(roomId);
    setIsOpen(false);
  };
  const createRoom = () => {
    const id = uuid4();
    socket.emit("join-room", id);
    navigate(id);
  };

  return (
    <>
      <div className="w-full h-screen flex flex-col justify-center items-center align-middle">
        <div className="button create" onClick={createRoom}>
          Create a new room
        </div>
        Or
        <div className="button join" onClick={() => setIsOpen(true)}>
          Join a room
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default HomePage;
