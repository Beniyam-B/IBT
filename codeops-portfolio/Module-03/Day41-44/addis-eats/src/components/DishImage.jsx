import Image from "next/image";
import styles from "./DishImage.module.css";

// Server component. `preload` (Next 16's name for the old `priority`) belongs on ONE image per page:
// the largest one visible without scrolling. `src` comes from db.js, which only sets it when a photo named like the
// dish really exists in public/images/ - otherwise it is null and a placeholder is shown.
export default function DishImage({ src, alt, className = "", sizes, preload = false }) {
  return (
    <div className={`${styles.box} ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className={styles.img} />
      ) : (
        <div className={styles.fallback} role="img" aria-label={alt}>
          <span>{alt.charAt(0)}</span>
        </div>
      )}
    </div>
  );
}
