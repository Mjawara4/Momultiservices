import { Phone, Mail, MapPin, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ContactInfo = () => {
  const whatsappNumber = "13473893821";
  const openWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}`, '_blank');
  };

  return (
    <div className="space-y-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-primary" />
          <span>+1 (347) 389-3821</span>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-primary" />
          <a href="mailto:momultiservicesllc@gmail.com" className="hover:underline">
            momultiservicesllc@gmail.com
          </a>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-primary" />
          <span>Bronx, NY</span>
        </div>
        <Button 
          onClick={openWhatsApp}
          className="flex items-center gap-2"
          variant="outline"
        >
          <MessageSquare className="h-5 w-5" />
          Contact us on WhatsApp
        </Button>
      </div>
    </div>
  );
};