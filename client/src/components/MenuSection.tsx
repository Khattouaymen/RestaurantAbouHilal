import { useState, useEffect, useRef } from 'react';
import { Award, Flame, Utensils, Leaf, Fish, Coffee } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BackgroundPattern from './BackgroundPattern';
import { Category, MenuItem } from '@shared/schema';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

interface MenuSectionProps {
  menuItems: MenuItem[];
  categories: Category[];
}

export default function MenuSection({ menuItems, categories }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();
  const sectionRef = useRef<HTMLElement>(null);

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

  // If no data is available yet, show a fallback with initial categories
  const availableCategories = categories.length > 0 
    ? categories 
    : [
        { id: 1, name: 'All', slug: 'all' },
        { id: 2, name: 'Main Dishes', slug: 'main-dishes' },
        { id: 3, name: 'Starters', slug: 'starters' },
        { id: 4, name: 'Desserts', slug: 'desserts' },
        { id: 5, name: 'Beverages', slug: 'beverages' }
      ];

  // If no data is available yet, show fallback menu items
  const displayedMenuItems = menuItems.length > 0 
    ? menuItems.filter(item => selectedCategory === 'all' || item.categoryId.toString() === selectedCategory)
    : [
        {
          id: 1,
          name: 'Couscous Royal',
          description: 'Traditional couscous served with lamb, chicken, merguez sausage, and a medley of seasonal vegetables in a flavorful broth.',
          price: 22.95,
          image: 'https://images.unsplash.com/photo-1617621101518-1ea1f52c0fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          categoryId: 2,
          featured: 1,
          tags: 'spicy'
        },
        {
          id: 2,
          name: 'Tajine d\'agneau',
          description: 'Tender lamb slowly simmered with prunes, almonds, and honey in our signature blend of Moroccan spices.',
          price: 24.50,
          image: 'https://images.unsplash.com/photo-1569277388175-54a3ad2a1eed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          categoryId: 2,
          featured: 0,
          tags: 'chef-special'
        },
        {
          id: 3,
          name: 'Pastilla au poulet',
          description: 'Sweet and savory filo pastry pie filled with chicken, eggs, almonds, and aromatic spices, dusted with cinnamon and powdered sugar.',
          price: 18.95,
          image: 'https://images.unsplash.com/photo-1592070969746-2d6648709819?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          categoryId: 2,
          featured: 0,
          tags: 'traditional'
        },
        {
          id: 4,
          name: 'Harira Soup',
          description: 'Traditional Moroccan soup with tomatoes, lentils, chickpeas, and tender pieces of lamb, flavored with ginger, saffron and fresh herbs.',
          price: 9.95,
          image: 'https://images.unsplash.com/photo-1527626557203-4030a3cad8e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          categoryId: 3,
          featured: 0,
          tags: 'vegetarian'
        },
        {
          id: 5,
          name: 'Seafood Tagine',
          description: 'Fresh fish, shrimp, and mussels cooked with bell peppers, potatoes and olives in a light chermoula sauce with aromatic herbs.',
          price: 26.50,
          image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          categoryId: 2,
          featured: 0,
          tags: 'seafood'
        },
        {
          id: 6,
          name: 'Moroccan Mint Tea',
          description: 'Traditional green tea with fresh mint leaves and sugar, served in a decorative teapot with traditional pouring ceremony.',
          price: 5.95,
          image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          categoryId: 5,
          featured: 0,
          tags: 'beverage'
        }
      ];

  const handleAddToOrder = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
      quantity: 1,
      image: item.image
    });

    toast({
      title: "Added to order",
      description: `${item.name} has been added to your order.`,
      duration: 3000,
    });
  };

  // Helper function to render the appropriate tag icon
  const getTagIcon = (tag: string) => {
    switch (tag) {
      case 'spicy':
        return <Flame className="text-primary mr-1 h-4 w-4" />;
      case 'chef-special':
        return <Award className="text-accent mr-1 h-4 w-4" />;
      case 'traditional':
        return <Utensils className="text-secondary mr-1 h-4 w-4" />;
      case 'vegetarian':
        return <Leaf className="text-secondary mr-1 h-4 w-4" />;
      case 'seafood':
        return <Fish className="text-secondary mr-1 h-4 w-4" />;
      case 'beverage':
        return <Coffee className="text-secondary mr-1 h-4 w-4" />;
      default:
        return <Utensils className="text-secondary mr-1 h-4 w-4" />;
    }
  };

  const getTagLabel = (tag: string) => {
    switch (tag) {
      case 'spicy':
        return 'Spicy';
      case 'chef-special':
        return 'Chef\'s Special';
      case 'traditional':
        return 'Traditional';
      case 'vegetarian':
        return 'Vegetarian Option';
      case 'seafood':
        return 'Seafood';
      case 'beverage':
        return 'Beverage';
      default:
        return 'Featured';
    }
  };

  return (
    <section id="menu" ref={sectionRef} className="py-16 relative">
      <BackgroundPattern />
      <div className="container mx-auto px-4 relative z-10">
        <div 
          className={`text-center mb-16 transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h2 className="font-playfair text-4xl font-bold mb-4">Our Menu</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Discover our selection of authentic Moroccan dishes, prepared with traditional spices 
            and techniques to bring the true flavors of Morocco to your table.
          </p>
          
          {/* Menu Categories */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className={selectedCategory === 'all' ? 'bg-primary text-white' : 'text-primary border-primary'}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            
            {availableCategories
              .filter(cat => cat.slug !== 'all')
              .map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id.toString() ? 'default' : 'outline'}
                  className={selectedCategory === category.id.toString() 
                    ? 'bg-primary text-white' 
                    : 'text-primary border-primary hover:bg-primary hover:text-white'
                  }
                  onClick={() => setSelectedCategory(category.id.toString())}
                >
                  {category.name}
                </Button>
              ))
            }
          </div>
        </div>
        
        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedMenuItems.map((item, index) => (
            <div 
              key={item.id}
              className={`bg-white rounded-xl overflow-hidden shadow-lg hover-scale transform transition-all duration-700 delay-${index * 100} ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="h-56 relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
                {item.featured === 1 && (
                  <div className="absolute inset-0 menu-item-overlay flex items-end">
                    <div className="p-4 text-white">
                      <div className="font-bold">Most Popular</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-playfair text-xl font-bold">{item.name}</h3>
                  <span className="text-primary font-bold">{typeof item.price === 'number' ? item.price : item.price} Dhs</span>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {getTagIcon(item.tags)}
                    <span className="text-xs text-gray-500">{getTagLabel(item.tags)}</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToOrder(item)}
                    className="bg-secondary hover:bg-opacity-90 text-white rounded-full text-sm"
                    size="sm"
                  >
                    Add to Order
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="/menu" className="inline-flex items-center text-primary font-semibold hover:underline">
            Voir Le Menu Complet
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
