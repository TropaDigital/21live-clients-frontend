import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { decodeToken } from "react-jwt";
import { useAuth } from "../contexts/AuthContext";

interface SessionTimerState {
  timeLeft: number; // em segundos
  countdown: string; // mm:ss
  isExpired: boolean;
  showWarningModal: boolean;
  percentage: number; // 0 a 100
}

export function useSessionTimer(): SessionTimerState {
  const { token } = useAuth();

  const [expiresAt, setExpiresAt] = useState("");

  const initialTimeRef = useRef<number>(0); // total seconds

  const [state, setState] = useState<SessionTimerState>({
    timeLeft: 1000,
    countdown: "00:00",
    isExpired: false,
    showWarningModal: false,
    percentage: 0,
  });

  const calculateState = (expiryTime: number) => {
    const now = new Date().getTime();
    const diffInSeconds = Math.floor((expiryTime - now) / 1000);

    if (diffInSeconds <= 0) {
      return {
        timeLeft: 0,
        countdown: "00:00",
        isExpired: true,
        showWarningModal: false,
        percentage: 100,
      };
    } else {
      const minutes = Math.floor(diffInSeconds / 60);
      const seconds = diffInSeconds % 60;
      const total = 120; // apenas os 2 últimos minutos

      // só começa a contar a porcentagem se estiver abaixo de 2 minutos
      const percentage =
        diffInSeconds <= total
          ? Math.min(100, Math.round(((total - diffInSeconds) / total) * 100))
          : 0;

      return {
        timeLeft: diffInSeconds,
        countdown: `${String(minutes).padStart(2, "0")}:${String(
          seconds
        ).padStart(2, "0")}`,
        isExpired: false,
        showWarningModal: diffInSeconds <= total,
        percentage,
      };
    }
  };

  useEffect(() => {
    if (token) {
      const myDecodedToken: any = decodeToken(token);
      setExpiresAt(myDecodedToken.expires);
    }
  }, [token]);

  useEffect(() => {
    if (!expiresAt) return;

    const expiryTime = moment(expiresAt, "YYYY-MM-DD HH:mm:ss")
      .toDate()
      .getTime();
    const initialDiff = Math.floor((expiryTime - new Date().getTime()) / 1000);
    initialTimeRef.current = initialDiff;

    const update = () => {
      setState(calculateState(expiryTime));
    };

    update(); // primeira execução imediata

    const interval = setInterval(update, 1000);

    // Adiciona listener para revalidar quando voltar para a aba
    const handleVisibilityChange = () => {
      if (!document.hidden) update();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [expiresAt]);

  return state;
}
