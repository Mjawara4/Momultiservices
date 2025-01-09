import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialProps {
  name: string;
  message: string;
  avatarUrl?: string;
}

export function TestimonialCard({ name, message, avatarUrl }: TestimonialProps) {
  return (
    <div className="flex flex-col items-center p-6 space-y-4 text-center">
      <Avatar className="h-16 w-16">
        <AvatarImage 
          src="/lovable-uploads/4a704460-41a7-4da9-9823-4f82d1d02e7a.png" 
          alt="MQ Multiservices LLC Logo" 
        />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-muted-foreground whitespace-pre-line">{message}</p>
      </div>
    </div>
  );
}