import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
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
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    </div>
  );
}