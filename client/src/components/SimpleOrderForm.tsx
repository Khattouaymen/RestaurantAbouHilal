import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/useCart';
import { ShoppingBasket, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import OrderConfirmation from './OrderConfirmation';

// Constants
const TAX_RATE = 0.08; // 8%
const DELIVERY_FEE = 5.99;

interface OrderSectionProps {
  onOrderSuccess: () => void;
}

export default function SimpleOrderForm({ onOrderSuccess }: OrderSectionProps) {
  const { items, removeItem, clearCart, calculateSubtotal, calculateTax, calculateTotal } = useCart();
  const [isOrderConfirmationOpen, setIsOrderConfirmationOpen] = useState(false);
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });
  
  // Calculate order totals
  const subtotal = calculateSubtotal();
  const tax = calculateTax(TAX_RATE);
  const total = calculateTotal(TAX_RATE, DELIVERY_FEE);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: "Empty Order",
        description: "Please add items to your order before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Show confirmation dialog
    setIsOrderConfirmationOpen(true);
  };
  
  // Handle order confirmation
  const handleOrderConfirmation = () => {
    setIsOrderConfirmationOpen(false);
    clearCart();
    
    // Show success toast
    toast({
      title: "Order Placed Successfully!",
      description: "Your delicious food is on its way.",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
    });
    
    // Trigger success callback
    onOrderSuccess();
  };
  
  return (
    <section id="order" className="py-16 bg-background relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl font-bold mb-4">Place Your Order</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Enjoy our delicious Moroccan dishes delivered straight to your door. 
            Complete the form below to place your order.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Order Confirmation Modal */}
          <OrderConfirmation
            isOpen={isOrderConfirmationOpen}
            onClose={() => setIsOrderConfirmationOpen(false)}
            orderItems={items}
            onConfirm={handleOrderConfirmation}
          />
        
          {/* Order Form and Cart */}
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="font-playfair text-2xl font-bold mb-6">Delivery Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                    <Input 
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium mb-1">Delivery Address</label>
                    <Input 
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street address, city, state and zip code"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium mb-1">Special Instructions</label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Allergies, special requests, delivery instructions..."
                      className="resize-none"
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="md:w-1/2 bg-background p-8">
              <h3 className="font-playfair text-2xl font-bold mb-6">Your Order</h3>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {/* Empty state */}
                {items.length === 0 ? (
                  <div className="py-8 text-center">
                    <ShoppingBasket className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Your order is empty. Add items from our menu.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {/* Order Items */}
                    {items.map((item) => (
                      <div key={item.id} className="py-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold">{item.name}</h4>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                          <button 
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 text-sm flex items-center"
                          >
                            <X className="h-3 w-3 mr-1" /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Order Summary */}
              <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Delivery Fee</span>
                  <span>${DELIVERY_FEE.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-200 my-3"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Place Order Button */}
              <Button 
                onClick={handleSubmit}
                disabled={items.length === 0}
                className="w-full bg-primary hover:bg-opacity-90 text-white py-6 rounded-xl font-bold text-lg h-auto"
              >
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}