import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TestimonialCard } from "./TestimonialCard";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Foday",
    message: "Salam bro,\nJust wanted to say thanks 🙏🏾 she got her stuff today💪🏾\nYour GP is unmatched 🙌🏾",
  },
  // More testimonials can be added here later
];

export function TestimonialsSection() {
  const [api, setApi] = useState<any>();

  useEffect(() => {
    if (!api) return;
    
    api.on("select", () => {
      console.log("Current slide:", api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="py-12 bg-accent/50">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
        <div className="max-w-3xl mx-auto">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 5000,
              }),
            ]}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <TestimonialCard {...testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}