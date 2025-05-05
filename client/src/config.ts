const environmentType = "dev";

const environment = {
  API_URL:
    environmentType === "dev"
      ? "http://localhost:3000"
      : "https://planning-poker-gjur.onrender.com",
  WSS_URL:
    environmentType === "dev"
      ? "ws://localhost:3000"
      : "wss://planning-poker-gjur.onrender.com",
};

export default environment;
