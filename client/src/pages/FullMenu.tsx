import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/hooks/useCart';
import { Category, MenuItem } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function FullMenu() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [, setLocation] = useLocation();
  const { addItem } = useCart();
  
  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      const data = await res.json();
      return [{ id: 0, name: 'Tous', slug: 'all' }, ...data];
    }
  });
  
  // Fetch menu items
  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu-items'],
    queryFn: async () => {
      const res = await fetch('/api/menu-items');
      return res.json();
    }
  });
  
  // Filter menu items based on active category
  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => {
        const category = categories.find(cat => cat.id === item.categoryId);
        return category?.slug === activeCategory;
      });
  
  // Handle adding item to cart
  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      quantity: 1,
      image: item.image
    });
    
    toast({
      title: "Ajouté au panier",
      description: `${item.name} a été ajouté à votre commande.`,
    });
  };
  
  const { items, removeItem, updateQuantity, clearCart, calculateSubtotal, calculateTotal } = useCart();
  const hasItems = items.length > 0;

  return (
    <div className="bg-background min-h-screen">
      {/* Header with back button */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ChevronLeft size={18} />
              Retour à l'accueil
            </Button>
          </Link>
          <h1 className="font-playfair text-2xl font-bold">Menu Complet</h1>
          <Button variant="ghost" className="relative">
            <ShoppingCart size={20} />
            {hasItems && (
              <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {items.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </Button>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu content - Takes 2/3 of the space on desktop */}
          <div className="w-full lg:w-2/3">
            {/* Category tabs */}
            <Tabs defaultValue="all" onValueChange={setActiveCategory} className="mb-8">
              <TabsList className="mb-4 flex flex-nowrap overflow-x-auto pb-2 px-2 justify-start">
                {categories.map((category) => (
                  <TabsTrigger key={category.slug} value={category.slug} className="whitespace-nowrap">
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value={activeCategory} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-playfair font-bold text-xl">{item.name}</h3>
                          <span className="font-bold text-primary">{Number(item.price).toFixed(2)} Dhs</span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                        
                        <div className="flex justify-between items-center">
                          {item.tags && (
                            <Badge variant="outline" className="text-xs">
                              {item.tags}
                            </Badge>
                          )}
                          
                          <Button 
                            onClick={() => handleAddToCart(item)}
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <ShoppingCart size={16} />
                            Ajouter
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredItems.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    Aucun plat dans cette catégorie.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Cart sidebar - Takes 1/3 of the space on desktop */}
          <div className="w-full lg:w-1/3 sticky top-20 h-fit">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="font-playfair text-xl font-bold mb-4 flex items-center">
                <ShoppingCart className="mr-2" size={20} />
                Votre Panier
              </h2>
              
              {hasItems ? (
                <>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 border-b pb-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <p className="font-medium">{item.name}</p>
                            <p className="font-bold text-primary">{(item.price * item.quantity).toFixed(2)} Dhs</p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Button 
                                size="icon" 
                                variant="outline" 
                                className="h-7 w-7" 
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button 
                                size="icon" 
                                variant="outline" 
                                className="h-7 w-7" 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                            <Button 
                              variant="ghost" 
                              className="h-7 w-7 p-0 text-red-500" 
                              onClick={() => removeItem(item.id)}
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span>{calculateSubtotal().toFixed(2)} Dhs</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraison</span>
                      <span>20.00 Dhs</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>{calculateTotal(0, 20).toFixed(2)} Dhs</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Button className="w-full" size="lg" onClick={() => setLocation('/#order')}>
                      Commander
                    </Button>
                    <Button variant="outline" className="w-full" size="sm" onClick={clearCart}>
                      Vider le panier
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="flex justify-center mb-4">
                    <ShoppingCart size={48} className="text-gray-300" />
                  </div>
                  <p>Votre panier est vide</p>
                  <p className="text-sm mt-2">Ajoutez des plats pour commencer votre commande</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}