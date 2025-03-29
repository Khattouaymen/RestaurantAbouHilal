import { Button } from '@/components/ui/button';
import BackgroundPattern from './BackgroundPattern';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const isRTL = i18n.language === 'ar';

  // Animation effect when component loads
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section id="home" className="relative py-16 md:py-24 overflow-hidden">
      <BackgroundPattern />
      <div className="container mx-auto px-4 relative z-10">
        <div className={`flex flex-col ${isRTL ? 'md:flex-row-reverse' : 'md:flex-row'} items-center`}>
          <div 
            className={`md:w-1/2 mb-10 md:mb-0 ${isRTL ? 'md:pl-12' : 'md:pr-12'} transform transition-all duration-700 ${
              isLoaded ? 'translate-x-0 opacity-100' : `${isRTL ? 'translate-x-4' : '-translate-x-4'} opacity-0`
            }`}
          >
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-primary">{t('general.welcome')}</span>
            </h1>
            <p className="text-lg mb-8 text-gray-700 leading-relaxed">
              {t('general.tagline')}
            </p>
            <div className={`flex flex-wrap gap-4 ${isRTL ? 'justify-end' : ''}`}>
              <Button
                onClick={() => {
                  const menuSection = document.getElementById('menu');
                  if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
                }}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white rounded-full"
              >
                {t('nav.menu')}
              </Button>
              <Button
                onClick={() => {
                  const orderSection = document.getElementById('order');
                  if (orderSection) orderSection.scrollIntoView({ behavior: 'smooth' });
                }}
                variant="outline"
                size="lg"
                className="border-2 border-secondary hover:bg-secondary hover:text-white text-secondary rounded-full"
              >
                {t('nav.order')}
              </Button>
            </div>
          </div>
          <div 
            className={`md:w-1/2 relative transform transition-all duration-700 delay-300 ${
              isLoaded ? 'translate-x-0 opacity-100' : `${isRTL ? '-translate-x-4' : 'translate-x-4'} opacity-0`
            }`}
          >
            <div className="rounded-2xl overflow-hidden shadow-xl transform md:rotate-2 hover-scale">
              <img 
                src="https://images.unsplash.com/photo-1541533848490-bc8115cd6522?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Moroccan restaurant interior with traditional decor" 
                className="w-full h-auto"
              />
            </div>
            <div className={`absolute -bottom-6 ${isRTL ? '-right-6' : '-left-6'} w-40 h-40 rounded-lg overflow-hidden shadow-lg transform ${isRTL ? 'rotate-6' : '-rotate-6'} hidden md:block hover-scale`}>
              <img 
                src="https://images.unsplash.com/photo-1577624060070-ca1afe89ddee?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" 
                alt="Moroccan dish close-up" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
