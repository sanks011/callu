import {
  AudioLines,
  LockKeyhole,
  Radio,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  accent: string;
  illustration: "access" | "presence" | "privacy" | "audio";
};

const features: Feature[] = [
  {
    title: "Exclusive Access",
    eyebrow: "Curated community",
    description:
      "Every application is reviewed by hand, creating a thoughtful network where each introduction has context.",
    icon: LockKeyhole,
    accent: "text-emerald-300",
    illustration: "access",
  },
  {
    title: "Instant Connect",
    eyebrow: "Live presence",
    description:
      "See who is available and move from a message to a spontaneous voice or video conversation in moments.",
    icon: Radio,
    accent: "text-sky-300",
    illustration: "presence",
  },
  {
    title: "Private by Design",
    eyebrow: "Protected spaces",
    description:
      "Member-only rooms and intentional access controls keep your conversations inside the community.",
    icon: ShieldCheck,
    accent: "text-violet-300",
    illustration: "privacy",
  },
  {
    title: "Crystal Clear Audio",
    eyebrow: "High-fidelity voice",
    description:
      "Low-latency audio makes long conversations feel natural, focused, and close to being in the same room.",
    icon: AudioLines,
    accent: "text-amber-300",
    illustration: "audio",
  },
];

function FeatureIllustration({ type }: { type: Feature["illustration"] }) {
  if (type === "access") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 360 180"
        className="h-full w-full"
        fill="none"
      >
        <path
          d="M38 120C91 79 132 142 181 94C224 52 269 61 322 35"
          stroke="currentColor"
          strokeOpacity=".18"
          strokeWidth="1.5"
          strokeDasharray="5 7"
        />
        <g className="feature-orbit">
          <circle cx="180" cy="90" r="57" stroke="currentColor" strokeOpacity=".2" />
          <circle cx="180" cy="90" r="38" stroke="currentColor" strokeOpacity=".35" />
        </g>
        <circle cx="180" cy="90" r="23" fill="currentColor" fillOpacity=".12" />
        <path
          d="M173 87v-6a7 7 0 0 1 14 0v6m-16 0h18v14h-18V87Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[
          [72, 111],
          [115, 53],
          [251, 118],
          [291, 62],
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="13" fill="#09090b" stroke="currentColor" strokeOpacity=".3" />
            <circle cx={cx} cy={cy - 3} r="3" fill="currentColor" fillOpacity=".65" />
            <path d={`M${cx - 5} ${cy + 6}c2-5 8-5 10 0`} stroke="currentColor" strokeOpacity=".65" />
          </g>
        ))}
      </svg>
    );
  }

  if (type === "presence") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 360 180"
        className="h-full w-full"
        fill="none"
      >
        <g className="feature-signal">
          <circle cx="180" cy="90" r="25" stroke="currentColor" strokeOpacity=".55" />
          <circle cx="180" cy="90" r="50" stroke="currentColor" strokeOpacity=".3" />
          <circle cx="180" cy="90" r="76" stroke="currentColor" strokeOpacity=".14" />
        </g>
        <circle cx="180" cy="90" r="8" fill="currentColor" />
        <circle cx="180" cy="90" r="15" fill="currentColor" fillOpacity=".16" />
        {[
          [108, 59],
          [262, 75],
          [235, 139],
          [91, 131],
        ].map(([cx, cy], index) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="16" fill="#09090b" stroke="currentColor" strokeOpacity=".35" />
            <circle cx={cx} cy={cy - 4} r="4" fill="currentColor" fillOpacity=".75" />
            <path d={`M${cx - 7} ${cy + 8}c2-7 12-7 14 0`} stroke="currentColor" strokeOpacity=".75" />
            {index < 2 && <circle cx={cx + 12} cy={cy - 12} r="4" fill="#34d399" />}
          </g>
        ))}
      </svg>
    );
  }

  if (type === "privacy") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 360 180"
        className="h-full w-full"
        fill="none"
      >
        <path
          d="M180 24 263 55v44c0 40-31 57-83 72-52-15-83-32-83-72V55l83-31Z"
          fill="currentColor"
          fillOpacity=".06"
          stroke="currentColor"
          strokeOpacity=".28"
        />
        <path
          d="m180 48 57 21v30c0 27-20 39-57 50-37-11-57-23-57-50V69l57-21Z"
          stroke="currentColor"
          strokeOpacity=".18"
          strokeDasharray="4 5"
        />
        <rect x="151" y="73" width="58" height="46" rx="8" fill="#09090b" stroke="currentColor" strokeOpacity=".6" />
        <path
          d="M165 73V62a15 15 0 0 1 30 0v11M180 90v12"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="180" cy="89" r="4" fill="currentColor" />
        <path d="M48 90h58m148 0h58" stroke="currentColor" strokeOpacity=".16" strokeDasharray="4 6" />
      </svg>
    );
  }

  const bars = [20, 38, 62, 92, 54, 30, 72, 106, 66, 42, 84, 48, 26];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 360 180"
      className="h-full w-full"
      fill="none"
    >
      <path d="M35 90h290" stroke="currentColor" strokeOpacity=".12" />
      {bars.map((height, index) => {
        const x = 72 + index * 18;
        return (
          <rect
            key={x}
            className="feature-wave"
            style={{ animationDelay: `${index * 70}ms` }}
            x={x}
            y={90 - height / 2}
            width="7"
            height={height}
            rx="3.5"
            fill="currentColor"
            fillOpacity={index === 7 ? ".95" : ".45"}
          />
        );
      })}
      <circle cx="180" cy="90" r="67" stroke="currentColor" strokeOpacity=".12" />
    </svg>
  );
}

export default function FeatureGrid() {
  return (
    <section
      aria-labelledby="features-title"
      className="relative z-10 w-full px-6 pb-36 pt-10 md:pb-40 md:pt-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="mb-3 text-xs font-semibold uppercase text-emerald-300">
            Built for real connection
          </p>
          <h2
            id="features-title"
            className="text-3xl font-semibold text-white sm:text-4xl"
          >
            A quieter, more intentional way to meet.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-zinc-400">
            Thoughtful access, live presence, protected spaces, and voice that
            keeps the conversation itself at the center.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="feature-card group relative min-h-[410px] overflow-hidden rounded-lg border border-white/10 bg-zinc-950 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-zinc-900/70"
              >
                <div className={`h-48 border-b border-white/10 bg-black ${feature.accent}`}>
                  <FeatureIllustration type={feature.illustration} />
                </div>

                <div className="p-6 sm:p-8">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border border-current/20 bg-current/10 ${feature.accent}`}
                    >
                      <Icon aria-hidden="true" size={19} />
                    </span>
                    <span className="text-xs font-medium uppercase text-zinc-500">
                      {feature.eyebrow}
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400 sm:text-base sm:leading-7">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
