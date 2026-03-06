import { useState } from 'react';

interface AvatarImageProps {
  dicebearUrl: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
}

export default function AvatarImage({ dicebearUrl, fallbackSrc, alt, className }: AvatarImageProps) {
  const [src, setSrc] = useState(dicebearUrl);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setSrc(fallbackSrc)}
    />
  );
}
