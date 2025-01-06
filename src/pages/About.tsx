import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">About Us</h1>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              At MO Multiservices LLC, we are dedicated to providing reliable and efficient shipping solutions tailored to meet your unique needs. Founded in 2020, our mission is to connect communities through seamless logistics, delivering packages with speed and care.
            </p>
            
            <p className="text-lg leading-relaxed mb-6">
              Located in Bronx, NY, we pride ourselves on exceptional customer service, transparency, and commitment to quality. Whether you're shipping locally or internationally, we ensure a hassle-free experience.
            </p>
            
            <p className="text-lg leading-relaxed">
              Our team of experts is here to simplify your logistics and help you achieve your goals.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;