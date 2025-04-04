import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { ChevronLeft, ShoppingCart, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/hooks/useCart';
import { Category, MenuItem } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// Constantes pour les règles de commande
const MINIMUM_ORDER_AMOUNT = 80; // Montant minimum de commande en DH
const DELIVERY_FEE_PERCENTAGE = 0.07; // 7% pour les frais de livraison

export default function FullMenu() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [, setLocation] = useLocation();
  const [isCartVisible, setIsCartVisible] = useState(false);
  const { addItem } = useCart();
  
  // Ajouter une référence pour le panier
  const cartRef = useRef<HTMLDivElement>(null);
  
  // Modifier le gestionnaire pour l'icône du panier
  const toggleCart = () => {
    setIsCartVisible(!isCartVisible);
    
    // Si le panier devient visible, faire défiler jusqu'à sa position
    if (!isCartVisible) {
      setTimeout(() => {
        cartRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100); // Petit délai pour s'assurer que le panier est affiché avant le défilement
    }
  };
  
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
    
    // Rendre le panier visible automatiquement après l'ajout d'un article
    setIsCartVisible(true);
    
    toast({
      title: "Ajouté au panier",
      description: `${item.name} a été ajouté à votre commande.`,
    });
  };
  
  const { items, removeItem, updateQuantity, clearCart, calculateSubtotal } = useCart();
  const hasItems = items.length > 0;
  
  // Calcul du sous-total
  const subtotal = calculateSubtotal();
  
  // Calcul des frais de livraison (7% du sous-total)
  const deliveryFee = subtotal * DELIVERY_FEE_PERCENTAGE;
  
  // Calcul du total
  const total = subtotal + deliveryFee;
  
  // Vérifier si la commande atteint le minimum requis
  const meetsMinimumOrder = subtotal >= MINIMUM_ORDER_AMOUNT;

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
          <Button 
            variant="ghost" 
            className="relative"
            onClick={toggleCart}
          >
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
          {/* Menu content - Takes full width when cart is hidden, 2/3 when visible */}
          <div className={`w-full ${isCartVisible ? 'lg:w-2/3' : 'lg:w-full'}`}>
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
          
          {/* Cart sidebar - Only visible when isCartVisible is true */}
          {isCartVisible && (
            <div ref={cartRef} className="w-full lg:w-1/3 sticky top-20 h-fit">
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
                        <span>{subtotal.toFixed(2)} Dhs</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frais de livraison (7%)</span>
                        <span>{deliveryFee.toFixed(2)} Dhs</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total</span>
                        <span>{total.toFixed(2)} Dhs</span>
                      </div>
                    </div>
                    
                    {!meetsMinimumOrder && (
                      <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2 text-sm text-amber-800">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <p>Commande minimum de {MINIMUM_ORDER_AMOUNT} Dhs. Ajoutez {(MINIMUM_ORDER_AMOUNT - subtotal).toFixed(2)} Dhs pour continuer.</p>
                      </div>
                    )}
                    
                    <div className="mt-4 space-y-2">
                      <Button 
                        className="w-full" 
                        size="lg" 
                        onClick={() => {
                          // Fermer le panier visible
                          setIsCartVisible(false);
                          
                          // Naviguer vers la page d'accueil avec l'ancre #order
                          setLocation('/#order');
                          
                          // Ajouter un petit délai pour s'assurer que la navigation est complète avant de faire défiler
                          setTimeout(() => {
                            // Faire défiler jusqu'à la section de commande
                            const orderSection = document.getElementById('order');
                            if (orderSection) {
                              orderSection.scrollIntoView({ behavior: 'smooth' });
                            }
                          }, 100);
                        }}
                        disabled={!meetsMinimumOrder}
                      >
                        {meetsMinimumOrder ? 'Commander' : `Minimum ${MINIMUM_ORDER_AMOUNT} Dhs requis`}
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
          )}
        </div>
      </div>
      
      {/* Bouton du panier - visible seulement sur mobile ou quand le panier est caché */}
      {(!isCartVisible || window.innerWidth < 1024) && (
        <Button 
          onClick={toggleCart}
          className="fixed bottom-4 right-4 z-10 rounded-full w-16 h-16 flex items-center justify-center"
        >
          <ShoppingCart className="w-6 h-6" />
          {items.reduce((acc, item) => acc + item.quantity, 0) > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {items.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </Button>
      )}
    </div>
  );
}