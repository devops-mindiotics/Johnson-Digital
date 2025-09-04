import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { User } from '@/contexts/auth-context';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image';

const banners = [
    { src: "https://picsum.photos/1200/400?q=1", alt: "School event", dataAiHint: "school event" },
    { src: "https://picsum.photos/1200/400?q=2", alt: "New library books", dataAiHint: "library books" },
    { src: "https://picsum.photos/1200/400?q=3", alt: "Sports day", dataAiHint: "sports day" },
];

export default function TeacherDashboard({ user }: { user: User }) {
  return (
    <div className="space-y-6">
        <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
                {banners.map((banner, index) => (
                    <CarouselItem key={index}>
                    <Card>
                        <CardContent className="relative flex aspect-[3/1] items-center justify-center p-0 overflow-hidden rounded-lg">
                           <Image src={banner.src} alt={banner.alt} fill style={{ objectFit: 'cover' }} data-ai-hint={banner.dataAiHint} />
                        </CardContent>
                    </Card>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4" />
            <CarouselNext className="absolute right-4" />
        </Carousel>

        <Card>
            <CardHeader>
                <CardTitle>Teacher Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Welcome, {user.name}. Your assigned classes and other quick access menus will be displayed here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
