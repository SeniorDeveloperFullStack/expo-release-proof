"use client";

export default function PropertyError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="route-state">
      <h1>We couldn&apos;t load this stay</h1>
      <p>Please try again. The portfolio demo may be temporarily unavailable.</p>
      <button className="button" onClick={reset}>Try again</button>
    </section>
  );
}
