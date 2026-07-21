"use client";

import type { CSSProperties, ImgHTMLAttributes } from "react";

type StaticImageDataLike = {
  src: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
};

type DirectImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string | StaticImageDataLike;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  unoptimized?: boolean;
  loader?: unknown;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
};

export default function DirectImage({
  src,
  fill = false,
  priority = false,
  quality,
  unoptimized,
  loader,
  placeholder,
  blurDataURL,
  style,
  loading,
  ...imgProps
}: DirectImageProps) {
  // vinext routes next/image through /_vinext/image in production. This app
  // does not use a Cloudflare Images binding, so local public assets should be
  // served directly instead of going through the image-resizing endpoint.
  void quality;
  void unoptimized;
  void loader;
  void placeholder;
  void blurDataURL;

  const resolvedSrc = typeof src === "string" ? src : src.src;
  const resolvedStyle: CSSProperties | undefined = fill
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        ...style,
      }
    : style;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...imgProps}
      src={resolvedSrc}
      style={resolvedStyle}
      loading={priority ? "eager" : (loading ?? "lazy")}
      decoding={imgProps.decoding ?? "async"}
    />
  );
}
