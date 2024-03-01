import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Canvas from "./Canvas/Canvas";
import HomePage from "./Home/HomePage";
import { useEffect, useState } from "react";
import io from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const socketInstance = io("http://localhost:5000");
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to server");
    });

    socketInstance.on("message", (data) => {
      console.log(`Received message: ${data}`);
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage socket={socket} />,
    },
    {
      path: "/:id",
      element: <Canvas socket={socket} />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
