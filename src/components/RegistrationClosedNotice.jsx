export default function RegistrationClosedNotice() {
  return (
    <div className="min-h-screen bg-black px-4 py-28 text-white flex items-center justify-center">
      <div className="max-w-xl rounded-[2rem] border border-primary/20 bg-zinc-950/80 px-6 py-12 text-center shadow-[0_0_60px_rgba(255,165,0,0.12)] sm:px-12">
        <p className="text-primary text-[10px] font-black uppercase tracking-[0.45em] mb-4">
          Registration Closed
        </p>
        <h1 className="text-4xl font-heading uppercase text-white sm:text-5xl">
          Entries Are Closed
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-zinc-400 sm:text-base">
          Season 2 registrations closed at 12:00 AM IST on 26 May 2026.
        </p>
      </div>
    </div>
  );
}
