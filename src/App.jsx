import { useEffect, useMemo, useRef } from "react";
import QRCode from "react-qr-code";

const SIZE = 220;
const SPEED = 3;
const SITE = "https://qr-ception.vercel.app";

const COLORS = [
  "#ff0055",
  "#00ffff",
  "#39ff14",
  "#ffff00",
  "#ff8800",
  "#ff00ff",
  "#00ff99",
  "#00aaff",
];

const MESSAGES = [
  "You scanned it.",
  "Again?",
  "Still the same website.",
  "I promise nothing changed.",
  "This is becoming a habit.",
  "You're committed.",
  "Go on. Scan it again.",
  "I'm not stopping you.",
  "The QR is flattered.",
  "Your camera app knows this website by heart.",
  "One more won't hurt.",
  "This is the loop now.",
  "I respect the dedication.",
  "You came back.",
  "Interesting decision.",
  "I would've stopped by now.",
  "Apparently you wouldn't.",
  "Still scanning?",
  "Same QR. Different vibe.",
  "You're farming absolutely nothing.",
  "Achievement unlocked: No achievement.",
  "This website has one job.",
  "You keep helping it.",
  "There's no ending.",
  "There never was.",
  "The QR believes in you.",
  "Your phone saw this coming.",
  "You chose this.",
  "No one forced you.",
  "Excellent use of modern technology.",
];

const SPECIAL = {
  1: "Welcome to the loop.",
  5: "Five scans already?",
  10: "Double digits already?",
  25: "This is officially a hobby.",
  42: "The answer was QR.",
  69: "Nice.",
  100: "You actually made it.",
};

const randomColor = () =>
  COLORS[Math.floor(Math.random() * COLORS.length)];

export default function App() {
  const qrRef = useRef(null);

  const params = new URLSearchParams(window.location.search);
  const count = Number(params.get("count") || 0);

  const nextURL = `${SITE}/?count=${count + 1}`;

  const message = useMemo(() => {
    return (
      SPECIAL[count] ??
      MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
    );
  }, [count]);

  const color = useRef(randomColor());

  const pos = useRef({
    x: 100,
    y: 100,
  });

  const vel = useRef({
    dx: SPEED,
    dy: SPEED,
  });

  useEffect(() => {
    let frame;

    const animate = () => {
      pos.current.x += vel.current.dx;
      pos.current.y += vel.current.dy;

      let bounced = false;

      if (pos.current.x <= 0) {
        pos.current.x = 0;
        vel.current.dx *= -1;
        bounced = true;
      }

      if (pos.current.x >= window.innerWidth - SIZE) {
        pos.current.x = window.innerWidth - SIZE;
        vel.current.dx *= -1;
        bounced = true;
      }

      if (pos.current.y <= 0) {
        pos.current.y = 0;
        vel.current.dy *= -1;
        bounced = true;
      }

      if (pos.current.y >= window.innerHeight - SIZE) {
        pos.current.y = window.innerHeight - SIZE;
        vel.current.dy *= -1;
        bounced = true;
      }

      if (bounced) {
        color.current = randomColor();
      }

      if (qrRef.current) {
        qrRef.current.style.left = `${pos.current.x}px`;
        qrRef.current.style.top = `${pos.current.y}px`;
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.message}>
        {message}
      </div>

      <div
        ref={qrRef}
        style={{
          ...styles.qr,
        }}
      >
        <QRCode
          value={nextURL}
          size={SIZE}
          fgColor={color.current}
          bgColor="transparent"
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    inset: 0,
    overflow: "hidden",
    background: "#000",
    fontFamily: "'JetBrains Mono', monospace",
  },

  message: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#fff",
    fontSize: 15,
    zIndex: 100,
    pointerEvents: "none",
  },

  qr: {
    position: "absolute",
    width: SIZE,
    height: SIZE,
  },
};