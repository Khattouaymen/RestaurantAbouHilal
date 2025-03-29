import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/lib/types';

interface OrderConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: CartItem[];
  onConfirm?: () => void;
}

export default function OrderConfirmation({ isOpen, onClose, orderItems, onConfirm }: OrderConfirmationProps) {
  if (!isOpen) return null;

  // Calculate total
  const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate delivery time (normally this would come from the backend)
  const deliveryTime = "45-60 minutes";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 relative z-10 transform transition-transform">
        <div className="p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mx-auto mb-6">
            <Check className="text-primary h-10 w-10" />
          </div>
          <h3 className="font-playfair text-2xl font-bold mb-4">Order Successful!</h3>
          <p className="text-gray-700 mb-6">
            Your order has been received and is being prepared. You will receive a confirmation email shortly.
          </p>
          
          <div className="bg-background p-4 rounded-xl mb-6 text-left">
            <h4 className="font-bold mb-2">Order Summary</h4>
            <div className="space-y-2 mb-4">
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} ({item.quantity})</span>
                  <span>{(item.price * item.quantity)} Dhs</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-gray-200 my-3"></div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{total} Dhs</span>
            </div>
          </div>
          
          <p className="text-gray-700 mb-8">
            Estimated delivery time: <span className="font-bold">{deliveryTime}</span>
          </p>
          
          <Button 
            onClick={onConfirm ? onConfirm : onClose}
            className="bg-primary text-white py-3 px-6 rounded-full font-semibold hover:bg-opacity-90 w-full"
          >
            Back to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}
