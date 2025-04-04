import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import BackgroundPattern from './BackgroundPattern';
import { useCart } from '@/hooks/useCart';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  activeSectionId: string;
  onNavClick: (sectionId: string) => void;
}

export default function Header({ activeSectionId, onNavClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items } = useCart();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    // Check initial scroll position on mount
    setScrolled(window.scrollY > 50);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (sectionId: string) => {
    onNavClick(sectionId);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'about', label: 'À propos' },
    { id: 'menu', label: 'Menu' },
    { id: 'gallery', label: 'Galerie' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header 
      className={`fixed w-full top-0 transition-all duration-300 z-50 ${
        scrolled ? 'bg-black/95 shadow-md py-2' : 'py-2'
      }`}
    >
      {/* Image d'arrière-plan des feux BBQ */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center z-0 opacity-100"
        style={{ 
          backgroundImage: `url('https://sigmawire.net/i/04/5SFnEr.png')`,
          filter: scrolled ? 'brightness(0.2)' : 'brightness(0.5)'
        }}
      ></div>
      
      <BackgroundPattern className={scrolled ? 'opacity-5' : 'opacity-10'} />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home');
              }} 
              className="transition-colors duration-300"
            >
              {/* Remplacer le texte par l'image logo */}
              <img 
                src="https://sigmawire.net/i/04/CxemIw.png" 
                alt="ABOU Hilal" 
                className="h-12 md:h-14 object-contain"
              />
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(item => (
              <a 
                key={item.id}
                href={`#${item.id}`} 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`transition-colors duration-300 font-semibold text-sm relative px-1 py-1 group ${
                  activeSectionId === item.id 
                    ? 'text-primary' 
                    : 'text-white hover:text-primary'
                }`}
              >
                {item.label}
                <span className={`absolute left-0 right-0 bottom-0 h-0.5 bg-primary transform scale-x-0 transition-transform group-hover:scale-x-100 ${
                  activeSectionId === item.id ? 'scale-x-100' : ''
                }`}></span>
              </a>
            ))}
            
            <div className="flex items-center space-x-3">
              {/* Panier */}
              <div className="relative">
                <a 
                  href="#order"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('order');
                  }}
                  className="p-1 rounded-full transition-colors flex items-center space-x-2 text-white hover:text-primary"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-primary text-white w-4 h-4 flex items-center justify-center p-0 text-xs rounded-full">
                      {cartItemCount}
                    </Badge>
                  )}
                </a>
              </div>
              
              {/* Bouton Commander */}
              <a 
                href="#order"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('order');
                }}
                className="bg-primary hover:bg-primary-600 text-white py-1 px-4 rounded-full transition-colors font-medium text-sm"
              >
                Commander
              </a>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Panier pour mobile */}
            <a 
              href="#order"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('order');
              }}
              className="p-1 rounded-full relative text-white"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-primary text-white w-4 h-4 flex items-center justify-center p-0 text-xs rounded-full">
                  {cartItemCount}
                </Badge>
              )}
            </a>
            
            <button 
              type="button"
              onClick={toggleMobileMenu}
              className="focus:outline-none text-white"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div 
          className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-3 px-6 z-20 transform transition-all duration-300 ease-in-out ${
            mobileMenuOpen 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="flex flex-col space-y-3">
            {navItems.map(item => (
              <a 
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`transition-colors font-medium py-1 text-sm border-b border-gray-100 ${
                  activeSectionId === item.id ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
              >
                {item.label}
              </a>
            ))}
            <a 
              href="#order"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('order');
              }}
              className="bg-primary hover:bg-opacity-90 text-white py-2 px-4 rounded-full transition-colors font-medium text-sm text-center mt-1"
            >
              Commander
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
