'use client';

import { useEffect, useState } from 'react';
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from 'embla-carousel-react';
import { getAllBanners } from '@/lib/api/masterApi';

export function HomeBanner() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const { records } = await getAllBanners(1, 5, 'active');
        setBanners(records);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    }

    fetchBanners();
  }, []);

  return (
    <div className="embla overflow-hidden rounded-lg" ref={emblaRef}>
      <div className="embla__container flex">
        {banners.map((banner, index) => (
          <div
            key={index}
            className="embla__slide flex-shrink-0 w-full h-48 sm:h-64 md:h-80 lg:h-96"
          >
            <img
              alt={banner.title}
              className="object-cover w-full h-full"
              src={banner.imageUrl}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
