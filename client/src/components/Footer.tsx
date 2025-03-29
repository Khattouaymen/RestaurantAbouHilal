import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import BackgroundPattern from './BackgroundPattern';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

interface FooterProps {
  onNavClick: (sectionId: string) => void;
}

export default function Footer({ onNavClick }: FooterProps) {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send the email to a newsletter API
    toast({
      title: "Subscribed!",
      description: "You've been successfully subscribed to our newsletter.",
    });
    
    setEmail('');
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'menu', label: 'Menu' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const legalLinks = [
    { href: '#', label: 'Privacy Policy' },
    { href: '#', label: 'Terms of Service' },
    { href: '#', label: 'Accessibility' },
  ];

  return (
    <footer className="bg-secondary text-white py-12 relative mt-auto">
      <BackgroundPattern className="opacity-5" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between pb-8 border-b border-white border-opacity-20">
          <div className="mb-8 md:mb-0">
            <button 
              onClick={() => onNavClick('home')}
              className="font-playfair text-3xl font-bold text-white mb-4 inline-block"
            >
              ABOU Hilal
            </button>
            <p className="max-w-xs text-white text-opacity-80">
              Bringing the authentic flavors of Morocco to your table since 1985.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {navLinks.map(link => (
                  <li key={link.id}>
                    <button 
                      onClick={() => onNavClick(link.id)}
                      className="text-white text-opacity-80 hover:text-opacity-100"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-white text-opacity-80 hover:text-opacity-100">
                      {link.label}
                    </a>
                  </li>
                ))}
                
                <li>
                  <Link href="/admin" className="text-white text-opacity-80 hover:text-opacity-100">
                    Zone Admin
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Newsletter</h4>
              <p className="text-white text-opacity-80 mb-4">Subscribe to receive updates and special offers.</p>
              <form className="flex" onSubmit={handleSubmit}>
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="rounded-l-lg w-full focus:outline-none text-foreground rounded-r-none border-r-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-opacity-90 px-4 py-2 rounded-l-none"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="pt-8 text-center">
          <p className="text-white text-opacity-80">
            &copy; {new Date().getFullYear()} Restaurant ABOU Hilal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
