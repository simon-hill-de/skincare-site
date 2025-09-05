import React, { useMemo, useState, useEffect, useRef } from "react";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

function formatSeconds(total) {
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = Math.floor(total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function Timer({ defaultSeconds = 0, label = "Wartezeit" }) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  useEffect(() => {
    if (seconds === 0 && running) setRunning(false);
  }, [seconds, running]);

  useEffect(() => {
    if (seconds === 0 && navigator?.vibrate) {
      navigator.vibrate(40);
    }
  }, [seconds]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <span className="inline-flex items-center gap-2 text-base sm:text-sm text-gray-700">
        ⏱️ {label}:{" "}
        <span className="font-mono font-semibold text-gray-900">
          {formatSeconds(seconds)}
        </span>
      </span>
      <div className="flex gap-2 w-full sm:w-auto">
        <button
          className={classNames(
            "flex-1 sm:flex-none px-4 py-3 rounded-xl text-base sm:text-sm",
            running ? "bg-gray-200" : "bg-black text-white"
          )}
          onClick={() => setRunning((r) => !r)}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          className="flex-1 sm:flex-none px-4 py-3 rounded-xl text-base sm:text-sm bg-gray-100"
          onClick={() => {
            setRunning(false);
            setSeconds(defaultSeconds);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function StepCard({ step, onNext, onBack, isFirst, isLast }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step?.id]);

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border shadow-sm bg-white">
      <div className="p-4 sm:p-5 border-b">
        <div className="text-xs uppercase tracking-wider text-gray-500">
          {step.section}
        </div>
        <h2 className="text-lg sm:text-xl font-semibold mt-1">{step.title}</h2>
      </div>

      <div className="p-4 sm:p-5 space-y-3">
        {step.product && (
          <div className="text-base sm:text-sm">
            <span className="font-semibold">Produkt:</span> {step.product}
          </div>
        )}
        {step.where && (
          <div className="text-base sm:text-sm">
            <span className="font-semibold">Wo auftragen:</span> {step.where}
          </div>
        )}
        {step.how && (
          <div className="text-base sm:text-sm">
            <span className="font-semibold">Anwendung:</span> {step.how}
          </div>
        )}
        {step.note && (
          <div className="text-base sm:text-sm text-gray-600">
            <span className="font-semibold">Hinweis:</span> {step.note}
          </div>
        )}
        {step.waitSeconds && (
          <Timer
            defaultSeconds={step.waitSeconds}
            label={step.waitLabel || "Wartezeit"}
          />
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-gray-50 rounded-b-2xl">
        {!isFirst && (
          <button
            className="px-4 py-3 sm:py-2 rounded-xl border bg-white hover:bg-gray-100"
            onClick={onBack}
          >
            Zurück
          </button>
        )}
        <button
          className="px-4 py-3 sm:py-2 rounded-xl bg-black text-white hover:bg-gray-800"
          onClick={onNext}
        >
          {isLast ? "Fertig" : "Weiter"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────
// Daten für Routine-Schritte
// ─────────────────────────────
function buildMorningSteps({ goingOut, saturday }) {
  const steps = [];

  steps.push({
    id: "shower",
    section: "Morgen",
    title: "Duschen (nur Körper)",
    product: "Rituals Duschschaum (Oud)",
    how: "Körper waschen. Gesicht später am Waschbecken reinigen.",
  });

  if (saturday) {
    steps.push(
      { id: "hair-wash", section: "Haare", title: "Haare waschen", how: "Shampoo + Conditioner (Lockenmethode)." },
      { id: "hair-dry", section: "Haare", title: "Lufttrocknen", how: "Kurz antrocknen lassen, bis nur noch feucht." },
      { id: "hair-product", section: "Haare", title: "Produkt einarbeiten", how: "Locken-Creme/Leave-in verteilen." },
      { id: "hair-diffuse", section: "Haare", title: "Diffusor", how: "Mit Diffusor fast trocken föhnen." },
      { id: "hair-pony", section: "Haare", title: "Pony & Gel", how: "Pony ggf. glätten, mit Gel fixieren." }
    );
  }

  if (goingOut) {
    steps.push(
      { id: "shave", section: "Rasur", title: "Rasieren", product: "NIVEA Men Sensitive Shaving Gel + Philips Rasierer", where: "Seiten (Goatee/Schnurrbart stehen lassen)", how: "Gel auftragen, mit Philips rasieren, abspülen." },
      { id: "aftershave", section: "Rasur", title: "After Shave", product: "Baxter of California After Shave Balm", where: "Frisch rasierte Stellen", how: "Sanft einmassieren.", waitSeconds: 300, waitLabel: "Einziehen lassen (5 Min)" }
    );
  }

  steps.push(
    { id: "cleanser", section: "Gesicht", title: "Reinigen", product: "COSRX Low pH Good Morning Gel Cleanser", how: "20 Sek. einmassieren, abspülen." },
    { id: "eye", section: "Augen", title: "Eye Serum", product: "Beauty of Joseon Revive Eye Serum", how: "1 Pump, sanft einklopfen.", waitSeconds: 30 },
    { id: "serum", section: "Gesicht", title: "Serum", product: "Beauty of Joseon Glow Serum", how: "2–3 Tropfen einklopfen.", waitSeconds: 30 },
    { id: "cream", section: "Gesicht", title: "Moisturizer", product: "COSRX Advanced Snail 92 Cream", how: "Dünn auftragen.", waitSeconds: 90 }
  );

  if (goingOut) {
    steps.push({ id: "spf", section: "Schutz", title: "Sonnencreme", product: "Beauty of Joseon Relief Sun SPF50+", how: "2 Finger-Regel, Gesicht & Hals." });
  }

  steps.push(
    { id: "wait-minox", section: "Haare", title: "Warten", how: "10 Min warten vor Minoxidil.", waitSeconds: 600 },
    { id: "minoxidil", section: "Haare", title: "Minoxidil", product: "Minoxidil Lösung", how: "Auf Kopfhaut auftragen, Hände waschen." }
  );

  return steps;
}

function buildEveningSteps({ usedSpfToday, doBhaTonight, minoxidilTwice }) {
  const steps = [];

  steps.push({
    id: "cleanse-pm",
    section: "Abend",
    title: usedSpfToday ? "Double Cleansing" : "Reinigung",
    product: usedSpfToday
      ? "Banila Co Clean It Zero Balm → COSRX Cleanser"
      : "COSRX Cleanser",
    how: usedSpfToday
      ? "Balm auf trockener Haut, abspülen → dann Cleanser."
      : "Mit Cleanser 20 Sek. waschen.",
  });

  if (doBhaTonight) {
    steps.push({
      id: "bha",
      section: "Treatment",
      title: "COSRX BHA Blackhead Power Liquid",
      how: "Dünn auf T-Zone, 20 Min warten.",
      waitSeconds: 1200,
    });
  }

  steps.push(
    { id: "eye-pm", section: "Augen", title: "Eye Serum", product: "Beauty of Joseon Revive Eye Serum", how: "1 Pump einklopfen.", waitSeconds: 30 },
    !doBhaTonight ? { id: "serum-pm", section: "Gesicht", title: "Serum", product: "Beauty of Joseon Glow Serum", how: "2–3 Tropfen einklopfen.", waitSeconds: 30 } : null,
    { id: "cream-pm", section: "Gesicht", title: "Moisturizer", product: "COSRX Snail 92 Cream", how: "Dünn auftragen." }
  );

  if (minoxidilTwice) {
    steps.push(
      { id: "wait-minox-pm", section: "Haare", title: "Warten", how: "10 Min warten.", waitSeconds: 600 },
      { id: "minoxidil-pm", section: "Haare", title: "Minoxidil", product: "Minoxidil Lösung", how: "Auf Kopfhaut." }
    );
  }

  return steps.filter(Boolean);
}

// ─────────────────────────────
// Main App
// ─────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("intro");
  const [goingOut, setGoingOut] = useState(null);
  const [saturday, setSaturday] = useState(false);
  const [minoxidilTwice, setMinoxidilTwice] = useState(true);
  const [doBhaTonight, setDoBhaTonight] = useState(false);
  const [usedSpfToday, setUsedSpfToday] = useState(false);
  const [steps, setSteps] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (phase === "morning") {
      setSteps(buildMorningSteps({ goingOut, saturday }));
    }
    if (phase === "evening") {
      setSteps(buildEveningSteps({ usedSpfToday, doBhaTonight, minoxidilTwice }));
    }
  }, [phase, goingOut, saturday, usedSpfToday, doBhaTonight, minoxidilTwice]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 bg-white/80 backdrop-blur border-b">
        <div className="max-w-5xl mx-auto px-3 py-2 flex items-center justify-between">
          <h1 className="text-base sm:text-xl font-bold">Skincare Flow 💧</h1>
          <button
            onClick={() => setPhase("intro")}
            className="text-sm px-3 py-2 rounded-xl border bg-white hover:bg-gray-50"
          >
            Neustart
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-3 sm:p-6">
        {phase === "intro" && (
          <div className="grid gap-4">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <h2 className="font-semibold mb-3">Start</h2>
              <p className="text-sm text-gray-700">Wähle deine Optionen:</p>
              <div className="mt-3 flex flex-col gap-2">
                <button
                  className={classNames(
                    "px-4 py-3 rounded-xl border",
                    goingOut ? "bg-black text-white" : "bg-white"
                  )}
                  onClick={() => setGoingOut(true)}
                >
                  Rausgehen (mit Rasur + SPF)
                </button>
                <button
                  className={classNames(
                    "px-4 py-3 rounded-xl border",
                    goingOut === false ? "bg-black text-white" : "bg-white"
                  )}
                  onClick={() => setGoingOut(false)}
                >
                  Drinnen bleiben
                </button>
              </div>

              <div className="mt-3 flex gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={saturday}
                    onChange={(e) => setSaturday(e.target.checked)}
                  />
                  Samstag (Haare waschen)
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={doBhaTonight}
                    onChange={(e) => setDoBhaTonight(e.target.checked)}
                  />
                  COSRX BHA heute
                </label>
              </div>
              <div className="mt-3 flex gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={minoxidilTwice}
                    onChange={(e) => setMinoxidilTwice(e.target.checked)}
                  />
                  Minoxidil 2× täglich
                </label>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  className="px-5 py-3 rounded-xl bg-black text-white"
                  onClick={() => {
                    setPhase("morning");
                    setIndex(0);
                    setUsedSpfToday(!!goingOut);
                  }}
                  disabled={goingOut === null}
                >
                  Morgenroutine starten
                </button>
              </div>
            </div>
          </div>
        )}

        {phase !== "intro" && steps.length > 0 && (
          <StepCard
            step={steps[index]}
            isFirst={index === 0}
            isLast={index === steps.length - 1}
            onBack={() => setIndex((i) => Math.max(0, i - 1))}
            onNext={() => {
              const last = index === steps.length - 1;
              if (last) {
                setPhase(phase === "morning" ? "evening" : "done");
                setIndex(0);
              } else {
                setIndex((i) => i + 1);
              }
            }}
          />
        )}

        {phase === "done" && (
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <div className="text-2xl font-bold mb-2">Fertig für heute ✨</div>
            <p className="text-gray-700">Morgenroutine und Abendroutine abgeschlossen.</p>
          </div>
        )}
      </main>
    </div>
  );
}
