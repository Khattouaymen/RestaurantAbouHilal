import { useEffect, useRef, useState } from 'react';

export default function GallerySection() {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Gallery images
  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1542181961-9590d0c79dab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Restaurant interior with traditional Moroccan decor",
      classes: "md:col-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1534256958597-7fe685cbd745?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      alt: "Traditional Moroccan lanterns",
      classes: "",
    },
    {
      src: "https://images.unsplash.com/photo-1518126673968-d3dfbe388a22?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      alt: "Moroccan spices and ingredients",
      classes: "",
    },
    {
      src: "https://images.unsplash.com/photo-1460306855393-0410f61241c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      alt: "Restaurant terrace dining area",
      classes: "md:col-span-2",
    },
  ];

  return (
    <section id="gallery" ref={sectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div 
          className={`text-center mb-12 transform transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h2 className="font-playfair text-4xl font-bold mb-4">Gallery</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Step inside our restaurant and explore our vibrant atmosphere, traditional decor, 
            and artfully prepared dishes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div 
              key={index}
              className={`${image.classes} overflow-hidden rounded-xl h-80 hover-scale transform transition-all duration-700 delay-${index * 100} ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
