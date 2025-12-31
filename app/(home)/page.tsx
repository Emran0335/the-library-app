import Rating from "@/components/rating";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage() {


  const [arrivals, recently_reviewed, staff_picks] = await Promise.all([
    prisma.books.findMany({
      take: 10,
      include: {
        book_photos: { select: { url: true } },
      },
      orderBy: { created_at: "desc" },
    }),

    prisma.ratings.findMany({
      take: 10,
      distinct: ["book_id"],
      orderBy: { created_at: "desc" },
      include: {
        books: {
          include: {
            book_photos: { select: { url: true } },
          },
        },
      },
    }),

    prisma.staff_picks.findMany({
      take: 10,
      distinct: ["book_id"],
      include: {
        books: {
          include: {
            book_photos: { select: { url: true } },
          },
        },
        users: { select: { name: true } },
      },
    }),
  ]);

  return (
    <>
      <div className="container mx-auto p-12 sm:p-12 flex flex-col justify-center space-y-16">
        <div>
          <h2 className="text-2xl font-bold pb-4 pl-4">New arrivals</h2>
          <Carousel
            opts={{
              slidesToScroll: "auto",
              align: "start",
            }}
            className="flex w-full min-w-xl"
          >
            <CarouselContent>
              {arrivals.map((arrival) => (
                <CarouselItem key={arrival.book_id} className="basis-auto">
                  <Link href={`/book/${arrival.book_id}`}>
                    <Image
                      className="h-50 w-37.5 sm:w-50 sm:h-72.5"
                      src={arrival.book_photos[0].url}
                      alt={arrival.name}
                      width={190}
                      height={0}
                    />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div>
          <h2 className="text-2xl font-bold pb-4 pl-4">Recently reviewed</h2>
          <Carousel
            opts={{
              slidesToScroll: "auto",
              align: "start",
            }}
            className="flex w-full min-w-xl"
          >
            <CarouselContent>
              {recently_reviewed.map((r_viewed) => (
                <CarouselItem key={r_viewed.book_id} className="basis-auto">
                  <Link href={`/book/${r_viewed.book_id}`}>
                    <Image
                      className="h-50 w-37.5 sm:w-50 sm:h-72.5"
                      src={r_viewed.books.book_photos[0].url}
                      width={190}
                      height={0}
                      alt={r_viewed.books.name}
                    />
                    <Rating rating={r_viewed.rating} />
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div>
          <h2 className="text-2xl font-bold pb-4 pl-4">Staff picks</h2>
          <Carousel
            opts={{
              slidesToScroll: "auto",
              align: "start",
            }}
            className="flex w-full min-w-xl"
          >
            <CarouselContent>
              {staff_picks.map((sp) => (
                <CarouselItem key={sp.book_id} className="basis-auto">
                  <Link href={`/book/${sp.book_id}`}>
                    <Image
                      className="h-50 w-37.5 sm:w-50 sm:h-72.5"
                      src={sp.books.book_photos[0].url}
                      width={190}
                      height={0}
                      alt={sp.books.name}
                    />
                  </Link>
                  <p className="text-sm text-slate-500 pt-2">
                    By: {sp.users.name}
                  </p>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </>
  );
}
