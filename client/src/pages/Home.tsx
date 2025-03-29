import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import MenuSection from '@/components/MenuSection';
import GallerySection from '@/components/GallerySection';
import SimpleOrderForm from '@/components/SimpleOrderForm';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import OrderConfirmation from '@/components/OrderConfirmation';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '@/hooks/useCart';
import type { MenuItem, Category } from '@shared/schema';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('home');
  
  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu-items'],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { items, clearCart, updateQuantity, removeItem, calculateSubtotal, calculateCommission, calculateDeliveryFee, calculateTotal } = useCart();

  const handleOrderSuccess = () => {
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    clearCart();
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveSectionId(sectionId);
    }
  };

  // Handle scroll events to update active section
  const handleScroll = () => {
    const sections = ['home', 'about', 'menu', 'gallery', 'order', 'contact'];
    const scrollPosition = window.scrollY + 100;

    for (const sectionId of sections) {
      const section = document.getElementById(sectionId);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSectionId(sectionId);
          break;
        }
      }
    }
  };

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header activeSectionId={activeSectionId} onNavClick={scrollToSection} />
      
      <div className="flex flex-col lg:flex-row">
        <main className="flex-1">
          <HeroSection />
          <AboutSection />
          <MenuSection menuItems={menuItems as MenuItem[]} categories={categories as Category[]} />
          <SimpleOrderForm onOrderSuccess={handleOrderSuccess} />
          <GallerySection />
          <ContactSection />
        </main>
        
        {/* Panier à droite (visible uniquement sur les grands écrans et quand il y a des produits) */}
        {items.length > 0 && (
          <aside className="hidden lg:block w-80 xl:w-96 bg-white shadow-lg sticky top-24 h-screen p-4 overflow-auto">
            <div className="p-4 rounded-lg bg-gray-50 shadow-inner h-full">
              <h3 className="font-playfair text-xl font-bold mb-4 text-primary border-b pb-2">{t('cart.title')}</h3>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 border-b pb-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-primary font-bold">{item.price} {t('general.currency')}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-200 w-6 h-6 rounded flex items-center justify-center text-gray-700"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-200 w-6 h-6 rounded flex items-center justify-center text-gray-700"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 text-sm"
                        >
                          {t('cart.remove')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 space-y-2 pt-2">
                  <div className="flex justify-between">
                    <span>{t('cart.subtotal')}:</span>
                    <span>{calculateSubtotal()} {t('general.currency')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{t('cart.commission')} (7%):</span>
                    <span>{calculateCommission()} {t('general.currency')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{t('cart.delivery')}:</span>
                    <span>{calculateDeliveryFee() > 0 ? `${calculateDeliveryFee()} ${t('general.currency')}` : t('cart.free')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>{t('cart.total')}:</span>
                    <span>{calculateTotal()} {t('general.currency')}</span>
                  </div>
                  
                  <button 
                    onClick={() => scrollToSection('order')}
                    className="w-full bg-secondary text-white py-2 rounded-md font-semibold mt-4 hover:bg-opacity-90"
                  >
                    {t('cart.checkout')}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
      
      <Footer onNavClick={scrollToSection} />
      
      <OrderConfirmation 
        isOpen={showConfirmation} 
        onClose={handleCloseConfirmation} 
        orderItems={items} 
      />
    </div>
  );
}
