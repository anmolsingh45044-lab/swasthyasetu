const API_URL = import.meta.env.VITE_API_URL;

const pingBackend = async () => {
  try {
    await fetch(`${API_URL}/health`);
    console.log("Backend ping successful");
  } catch (error) {
    console.log("Backend is waking up...");
  }
};

pingBackend();

setInterval(pingBackend, 5 * 60 * 1000);