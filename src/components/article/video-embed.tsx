export function VideoEmbed({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative my-6 aspect-video w-full overflow-hidden rounded-lg bg-charcoal">
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
