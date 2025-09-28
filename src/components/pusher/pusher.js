import Pusher from "pusher-js";
const PUSHER_CLUSTER_NAME = import.meta.env.VITE_PUSHER_CLUSTER;
const PUSHER_PUBLIC_KEY = import.meta.env.VITE_PUSHER_PUBLIC_KEY;

// Initialize Pusher
const pusher = new Pusher(PUSHER_PUBLIC_KEY, {
  cluster: PUSHER_CLUSTER_NAME,
  authEndpoint: "https://freelancegobackend.onrender.com/api/chat/pusher/auth", // Your backend endpoint for auth
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  },
});

export default pusher;
