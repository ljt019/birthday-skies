// src/hooks/useOpenSpace.js
import { useState, useEffect } from "react";

const useOpenSpace = (host = "localhost", port = 4682) => {
  const [openspace, setOpenspace] = useState<any>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ensure the OpenSpace API is available
    if (!window.openspaceApi) {
      setError("OpenSpace API not loaded.");
      return;
    }

    // Initialize the API
    const api = window.openspaceApi(host, port);

    // Handle successful connection
    api.onConnect(async () => {
      try {
        const library = await api.library();
        setOpenspace(library);
        setConnected(true);
        console.log("Connected to OpenSpace.");
      } catch (err) {
        console.error("Failed to load OpenSpace library:", err);
        setError("Failed to load OpenSpace library.");
      }
    });

    // Handle disconnection
    api.onDisconnect(() => {
      console.log("Disconnected from OpenSpace.");
      setConnected(false);
      setOpenspace(null);
    });

    // Attempt to connect
    api.connect();

    // Cleanup on unmount
    return () => {
      api.disconnect();
    };
  }, [host, port]);

  return { openspace, connected, error };
};

export default useOpenSpace;
