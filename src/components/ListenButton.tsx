import { useEffect, useState } from "react";
import { speak, stopSpeak, type SpeakStatus } from "../lib/speech";

export function ListenButton({
  text,
  times = 2,
  label = "Play audio",
}: {
  text: string;
  times?: number;
  label?: string;
}) {
  const [status, setStatus] = useState<SpeakStatus>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => () => stopSpeak(), [text]);

  return (
    <div className="listen-wrap">
      <button
        className={`listen ${status === "playing" ? "playing" : ""}`}
        type="button"
        onClick={() => {
          setMessage("");
          setStatus("playing");
          speak(text, times, (next, detail) => {
            setStatus(next);
            setMessage(detail ?? "");
          });
        }}
      >
        <span className="listen-icon" aria-hidden="true">
          {status === "playing" ? "●" : "▶"}
        </span>
        {status === "playing" ? "Playing…" : label}
      </button>
      {status === "error" && <p className="audio-error">{message}</p>}
    </div>
  );
}
