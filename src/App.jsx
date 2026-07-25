import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

const SIZE = 220;
const SPEED = 3;
const SITE = "https://https://qrception.vercel.app"; 

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

const randomColor = () =>
  COLORS[Math.floor(Math.random() * COLORS.length)];

export default function App() {
  const qrRef = useRef(null);

  const params = new URLSearchParams(window.location.search);
  const count = Number(params.get("count") || 0);

  const nextURL = `${SITE}/?count=${count + 1}`;

  const [color, setColor] = useState(randomColor());

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
        setColor(randomColor());
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
      <div
        ref={qrRef}
        style={styles.qr}
      >
        <QRCode
          value={nextURL}
          size={SIZE}
          fgColor={color}
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
  },

  qr: {
    position: "absolute",
    width: SIZE,
    height: SIZE,
  },
};