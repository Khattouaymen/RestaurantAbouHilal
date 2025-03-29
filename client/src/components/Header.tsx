import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import BackgroundPattern from './BackgroundPattern';

interface HeaderProps {
  activeSectionId: string;
  onNavClick: (sectionId: string) => void;
}

export default function Header({ activeSectionId, onNavClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
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
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'menu', label: 'Menu' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className={`relative z-40 ${scrolled ? 'bg-white/95 shadow-md' : ''} transition-all duration-300`}>
      <BackgroundPattern />
      <nav className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <a 
              href="#" 
              onClick={() => handleNavClick('home')} 
              className="text-primary font-playfair text-2xl md:text-3xl font-bold"
            >
              ABOU Hilal
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <a 
                key={item.id}
                href={`#${item.id}`} 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`transition-colors font-semibold ${
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
              className="bg-primary hover:bg-opacity-90 text-white py-2 px-6 rounded-full transition-colors font-semibold"
            >
              Order Now
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-foreground focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <div 
          className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-6 z-20 transform transition-all duration-300 ease-in-out ${
            mobileMenuOpen 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="flex flex-col space-y-4">
            {navItems.map(item => (
              <a 
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`transition-colors font-semibold py-2 ${
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
              className="bg-primary hover:bg-opacity-90 text-white py-3 px-6 rounded-full transition-colors font-semibold text-center mt-2"
            >
              Order Now
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
