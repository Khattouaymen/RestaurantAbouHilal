import { useEffect, useRef, useState } from 'react';
import { Utensils } from 'lucide-react';

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="py-16 bg-white"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div 
            className={`md:w-5/12 mb-10 md:mb-0 relative transform transition-all duration-700 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="overflow-hidden rounded-tl-3xl rounded-br-3xl">
                <img 
                  src="https://images.unsplash.com/photo-1510310525198-9a2c427c3ed5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                  alt="Moroccan restaurant ambiance" 
                  className="w-full h-60 object-cover hover-scale"
                />
              </div>
              <div className="overflow-hidden rounded-tr-3xl rounded-bl-3xl">
                <img 
                  src="https://images.unsplash.com/photo-1575515302045-31a9bcd44445?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                  alt="Traditional Moroccan lamps" 
                  className="w-full h-60 object-cover hover-scale"
                />
              </div>
            </div>
            <div className="absolute -bottom-10 right-10 w-32 h-32 rounded-full bg-accent flex items-center justify-center p-3 shadow-lg">
              <div className="text-white text-center font-playfair">
                <div className="text-xl font-bold">Est.</div>
                <div className="text-2xl font-bold">1985</div>
              </div>
            </div>
          </div>
          
          <div 
            className={`md:w-7/12 md:pl-16 transform transition-all duration-700 delay-200 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            }`}
          >
            <div className="flex items-center mb-4">
              <div className="h-px bg-primary flex-grow"></div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold px-4">Notre Histoire</h2>
              <div className="h-px bg-primary flex-grow"></div>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
            Depuis plus de 35 ans, ABOU Hilal apporte les saveurs authentiques du Maroc dans votre ville. Notre aventure a commencé lorsque le Chef Hilal Mansouri, inspiré par les recettes de sa grand-mère, a ouvert un petit restaurant familial dédié à partager les riches traditions culinaires de son pays natal.
            </p>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
            Aujourd'hui, nous continuons à honorer ces traditions en utilisant des recettes éprouvées, des ingrédients de qualité supérieure et le mélange parfait d'épices exotiques. Chaque plat raconte une histoire du patrimoine marocain, et chaque visite offre l'occasion de découvrir la chaleur et l'hospitalité qui définissent notre culture.
            </p>
            
            <div className="flex items-center text-secondary">
              <Utensils className="mr-3 h-6 w-6" />
              <span className="font-playfair text-xl">Des recettes traditionnelles transmises de génération en génération.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
