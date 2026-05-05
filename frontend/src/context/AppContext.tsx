import {
  createContext,
  type ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";
import type { AppContextType, LocationData } from "../types";
import axios from "axios";
import { AuthService } from "../main";
const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [city, setCity] = useState("Fetching Location ..............");

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${AuthService}/api/auth/me`, {
        withCredentials: true,
      });
      setUser(data.user);
      setIsAuth(true);
    } catch (error) {
      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation)
      return alert("Please allow location to continue");
    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1}`,
          );
          const data = await response.json();
          // const components = data.results?.[0]?.components;
          // const city =
          //   components?.city ||
          //   components?.town ||
          //   components?.suburb ||
          //   "Unknown";
          setCity(
            data.address.city ||
              data.address.town ||
              data.address.village ||
              "Your Location",
          );
          setLocation({ latitude, longitude });
          formattedAddress: data.display_name || "Current Location";
        } catch (error) {
          setLocation({
            latitude,
            longitude,
            formattedAddress: "Current Location",
          });
          setCity("Failed to load");
          console.error("Error fetching location:", error);
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setLoadingLocation(false);
      },
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAuth,
        loading,
        setIsAuth,
        setLoading,
        setUser,
        user,
        fetchUser,
        city,
        location,
        loadingLocation,
        setLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppProvider");
  }
  return context;
};
