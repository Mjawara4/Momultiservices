import { Card } from "@/components/ui/card";
import { OnlineOrderForm } from "@/components/online-order/OnlineOrderForm";

const OrderForMe = () => {
  return (
    <div className="container max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Order for Me</h1>
      <p className="text-muted-foreground mb-8 text-center">
        Use this page to submit the link to the website where you'd like us to order something for you. 
        Provide the details of what you want to purchase. Our service fee is fifteen percent (15%) of the total order amount.
      </p>
      
      <Card className="p-6">
        <OnlineOrderForm />
      </Card>
    </div>
  );
};

export default OrderForMe;