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
const MINIMUM_ORDER_AMOUNT = 80; // Minimum order amount in DH
const DELIVERY_FEE_PERCENTAGE = 0.07; // 7% delivery fee

interface OrderSectionProps {
  onOrderSuccess: () => void;
}

export default function SimpleOrderForm({ onOrderSuccess }: OrderSectionProps) {
  const { items, removeItem, clearCart, calculateSubtotal, calculateTax, calculateTotal, updateQuantity } = useCart();
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
  const deliveryFee = subtotal * DELIVERY_FEE_PERCENTAGE;
  const total = subtotal + deliveryFee;
  
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

    if (subtotal < MINIMUM_ORDER_AMOUNT) {
      toast({
        title: "Minimum Order Required",
        description: `Your order must be at least ${MINIMUM_ORDER_AMOUNT} DH to proceed.`,
        variant: "destructive",
      });
      return;
    }
    
    // Show confirmation dialog
    setIsOrderConfirmationOpen(true);
  };
  
  // Handle order confirmation
  const handleOrderConfirmation = async () => {
    try {
      // Create order data
      const orderData = {
        firstName: formData.name.split(' ')[0],
        lastName: formData.name.split(' ').slice(1).join(' ') || '-',
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: 'Casablanca',
        zipCode: '20000',
        deliveryOption: 'standard',
        deliveryTime: 'asap',
        paymentMethod: 'cash',
        specialInstructions: formData.notes || null,
        subtotal: calculateSubtotal().toString(),
        deliveryFee: DELIVERY_FEE.toString(),
        tax: calculateTax(TAX_RATE).toString(),
        total: calculateTotal(TAX_RATE, DELIVERY_FEE).toString(),
        status: 'pending', // Default status for new orders
      };

      // Send to server
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order: orderData,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price.toString(),
            quantity: item.quantity
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();

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
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem placing your order. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <section id="order" className="py-16 bg-background relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl font-bold mb-4">Passez votre commande</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Profitez de nos délicieux plats marocains livrés directement chez vous. 
            Complétez le formulaire ci-dessous pour passer votre commande.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Modal de confirmation de commande */}
          <OrderConfirmation
            isOpen={isOrderConfirmationOpen}
            onClose={() => setIsOrderConfirmationOpen(false)}
            orderItems={items}
            onConfirm={handleOrderConfirmation}
            deliveryAddress={formData.address} // Pass the address from the form
          />
        
          {/* Formulaire de commande et affichage du panier */}
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
              <h3 className="font-playfair text-2xl font-bold mb-6">Votre Panier</h3>
              
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
                    {items.map(item => (
                      <div key={item.id} className="flex items-center justify-between py-3">
                        {/* Photo du plat (si disponible) */}
                        {item.image && (
                          <div className="flex-shrink-0 mr-3">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-16 h-16 object-cover rounded"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        
                        {/* Contrôles de quantité et prix (déjà bien positionnés) */}
                        <div className="flex items-center gap-4">
                          {/* Quantité avec boutons +/- */}
                          <div className="flex items-center border rounded">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              type="button"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-12 text-center border-x py-1"
                            />
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              type="button"
                            >
                              +
                            </button>
                          </div>
                          
                          {/* Prix à droite */}
                          <div className="font-bold text-right min-w-[80px]">
                            {(item.price * item.quantity).toFixed(2)} Dhs
                          </div>
                          
                          <button 
                            onClick={() => removeItem(item.id)} 
                            className="ml-2 text-red-500 hover:text-red-700"
                            type="button"
                          >
                            <span className="sr-only">Supprimer</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Order Summary */}
              <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{subtotal.toFixed(2)} DH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee (7%):</span>
                    <span>{deliveryFee.toFixed(2)} DH</span>
                  </div>
                  
                  {subtotal < MINIMUM_ORDER_AMOUNT && (
                    <div className="text-red-500 text-sm mt-2">
                      * Minimum order amount is {MINIMUM_ORDER_AMOUNT} DH. Add {(MINIMUM_ORDER_AMOUNT - subtotal).toFixed(2)} DH more to proceed.
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>{total.toFixed(2)} DH</span>
                  </div>
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