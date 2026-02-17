"use client";

import { getSocket } from "@/lib/socket";
import { useEffect } from "react";

const GeoUpdater = ({ userId }: { userId: string }) => {
  useEffect(() => {
    if (!userId) return;

    const socket = getSocket();

    // Send identity once
    socket.emit("identity", userId);

    if (!navigator.geolocation) return;

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        socket.emit("update-location", {
          userId,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        console.log(err);
      },
      {
        enableHighAccuracy: true,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, [userId]);

  return null; // ✅ Required for React
};

export default GeoUpdater;
