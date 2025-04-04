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
import { MenuItem, Category } from '@shared/schema';

export default function Home() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('home');
  
  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu-items'],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { items, clearCart } = useCart();

  // Cette fonction ne sera plus utilisée directement par SimpleOrderForm
  const handleOrderSuccess = () => {
    // Vous pourriez éventuellement jouer un son ou afficher une notification
    // Mais ne pas ouvrir une nouvelle boîte de dialogue
    // setShowConfirmation(true); // Commenter ou supprimer cette ligne
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
    const sections = ['home', 'about', 'menu', 'order', 'gallery', 'contact'];
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
      
      <main>
        <HeroSection />
        <AboutSection />
        <MenuSection menuItems={menuItems} categories={categories} />
        <SimpleOrderForm onOrderSuccess={handleOrderSuccess} />
        <GallerySection />
        <ContactSection />
      </main>
      
      <Footer onNavClick={scrollToSection} />
      
      <OrderConfirmation 
        isOpen={showConfirmation} 
        onClose={handleCloseConfirmation} 
        orderItems={items} 
      />
    </div>
  );
}
