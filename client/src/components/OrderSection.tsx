import { useState, useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, Banknote, ShoppingBasket, X } from 'lucide-react';
import BackgroundPattern from './BackgroundPattern';
import { useCart } from '@/hooks/useCart';
import { insertOrderSchema } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface OrderSectionProps {
  onOrderSuccess: () => void;
}

const formSchema = insertOrderSchema.extend({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
});

export default function OrderSection({ onOrderSuccess }: OrderSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { items, calculateSubtotal, calculateTotal, calculateDeliveryFee, meetsMinimumOrder, removeItem } = useCart();
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const subtotal = calculateSubtotal();
  const deliveryFee = calculateDeliveryFee();
  const total = calculateTotal();
  
  // Convertir les nombres en chaînes pour les valeurs de formulaire
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      zipCode: "",
      deliveryOption: "delivery",
      deliveryTime: "",
      paymentMethod: "credit-card",
      specialInstructions: "",
      subtotal: subtotal.toString(), // Convertir en chaîne
      deliveryFee: deliveryFee.toString(), // Convertir en chaîne
      total: total.toString() // Convertir en chaîne
    },
  });
  
  // Mettre à jour les valeurs quand le panier change
  useEffect(() => {
    form.setValue("subtotal", subtotal.toString()); // Convertir en chaîne
    form.setValue("deliveryFee", deliveryFee.toString()); // Convertir en chaîne
    form.setValue("total", total.toString()); // Convertir en chaîne
  }, [subtotal, deliveryFee, total, form]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (items.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add items to your order before checking out.",
        variant: "destructive",
      });
      return;
    }

    // Show confirmation dialog
    setShowConfirmation(true);

    try {
      const orderData = {
        ...values,
        subtotal,
        deliveryFee: deliveryFee,
        total
      };
      
      // Submit order to backend
      const response = await apiRequest('POST', '/api/orders', {
        order: orderData,
        items: items
      });
      
      if (response.ok) {
        // Invalidate orders cache
        queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
        
        // Show success
        onOrderSuccess();
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error",
        description: "There was a problem placing your order. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Delivery time options
  const timeOptions = [
    { value: "asap", label: "As soon as possible" },
    { value: "12:00", label: "12:00 PM" },
    { value: "12:30", label: "12:30 PM" },
    { value: "13:00", label: "1:00 PM" },
    { value: "13:30", label: "1:30 PM" },
    { value: "14:00", label: "2:00 PM" },
    { value: "14:30", label: "2:30 PM" },
    { value: "15:00", label: "3:00 PM" },
    { value: "18:00", label: "6:00 PM" },
    { value: "18:30", label: "6:30 PM" },
    { value: "19:00", label: "7:00 PM" },
    { value: "19:30", label: "7:30 PM" },
    { value: "20:00", label: "8:00 PM" },
  ];

  return (
    <section id="order" ref={sectionRef} className="py-16 bg-background relative">
      <BackgroundPattern />
      <div className="container mx-auto px-4 relative z-10">
        <div 
          className={`text-center mb-12 transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h2 className="font-playfair text-4xl font-bold mb-4">Order Online</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Enjoy our authentic Moroccan cuisine in the comfort of your home. 
            Place your order below for delivery or pickup.
          </p>
        </div>
        
        <div 
          className={`bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-700 delay-200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8">
              {/* Order Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} id="order-form" className="space-y-6">
                  <h3 className="font-playfair text-2xl font-bold mb-6">Delivery Information</h3>
                  
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Contact Information */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Delivery Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Delivery Options */}
                  <FormField
                    control={form.control}
                    name="deliveryOption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Option</FormLabel>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row gap-4"
                          >
                            <FormItem className="flex items-center border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary space-x-2">
                              <FormControl>
                                <RadioGroupItem value="delivery" />
                              </FormControl>
                              <FormLabel className="cursor-pointer">Delivery</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary space-x-2">
                              <FormControl>
                                <RadioGroupItem value="pickup" />
                              </FormControl>
                              <FormLabel className="cursor-pointer">Pickup</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="deliveryTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Delivery Time</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specialInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Instructions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Allergies, special requests, delivery instructions..." 
                            className="resize-none"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
            
            <div className="md:w-1/2 bg-background p-8 relative">
              {/* Decorative pattern at the top */}
              <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden">
                <div className="pattern-bg absolute inset-0 bg-primary/10"></div>
              </div>
              
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
                  <span id="subtotal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Delivery Fee</span>
                  <span id="delivery-fee">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-200 my-3"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="mb-6">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <div className="flex flex-wrap gap-3">
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-wrap gap-3"
                        >
                          <FormItem className="flex items-center border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-primary space-x-2">
                            <FormControl>
                              <RadioGroupItem value="credit-card" />
                            </FormControl>
                            <CreditCard className="h-4 w-4 mr-2" />
                            <FormLabel className="cursor-pointer">Credit Card</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-primary space-x-2">
                            <FormControl>
                              <RadioGroupItem value="cash" />
                            </FormControl>
                            <Banknote className="h-4 w-4 mr-2" />
                            <FormLabel className="cursor-pointer">Cash on Delivery</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Place Order Button */}
              <Button 
                onClick={form.handleSubmit(onSubmit)}
                disabled={items.length === 0}
                className="w-full bg-primary hover:bg-opacity-90 text-white py-6 rounded-xl font-bold text-lg h-auto"
              >
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
      <OrderConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        orderItems={items}
        onConfirm={() => {
          // Handle confirmation logic
          setShowConfirmation(false);
        }}
        deliveryAddress={form.getValues("address")} // Pass the full address
      />
    </section>
  );
}