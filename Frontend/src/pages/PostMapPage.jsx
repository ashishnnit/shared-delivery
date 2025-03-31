import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const PostMapPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [postLocation, setPostLocation] = useState(null);
  const [distance, setDistance] = useState("Calculating...");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract post data from the URL state
  const post = location.state?.post;

  // Fetch user's current location
  useEffect(() => {
    if (!post) {
      toast.error("No post data found.");
      navigate("/"); // Redirect to home if no post data
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        setUserLocation([userLat, userLon]);

        // Set post location from the post data
        setPostLocation([post.latitude, post.longitude]);

        // Calculate distance
        const dist = haversineDistance(userLat, userLon, post.latitude, post.longitude);
        setDistance(`${dist.toFixed(2)} km`); // Round to 2 decimal places
      },
      (error) => {
        console.error("Error fetching user location:", error);
        toast.error("Failed to fetch your location.");
      }
    );
  }, [post, navigate]);

  // Haversine distance function
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  if (!userLocation || !postLocation) {
    return <div>Loading map...</div>;
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Distance Display on Top */}
      <div className="bg-white text-center py-4 shadow-md">
        <p className="text-gray-700 text-lg font-semibold">Distance: {distance}</p>
      </div>

      {/* Fullscreen Map */}
      <div className="flex-grow">
        <MapContainer center={userLocation} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* User Location Marker with Tooltip */}
          <Marker position={userLocation}>
            <Tooltip permanent direction="top">You are here</Tooltip>
          </Marker>

          {/* Post Location Marker with Tooltip */}
          <Marker position={postLocation}>
            <Tooltip permanent direction="top">{post.fullName}</Tooltip>
          </Marker>

          {/* Line Connecting Both Locations */}
          <Polyline positions={[userLocation, postLocation]} color="blue" />
        </MapContainer>
      </div>
    </div>
  );
};

export default PostMapPage;
