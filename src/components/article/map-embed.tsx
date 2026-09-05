export function MapEmbed({ query }: { query: string }) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-border">
      <iframe
        title={`Map: ${query}`}
        src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
        className="h-72 w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
