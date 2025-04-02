import { useEffect, useRef, useState } from 'react';
import { MapPin, Clock, Phone, Facebook, Instagram, Twitter } from 'lucide-react';

export default function ContactSection() {
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

  const contactInfo = [
    {
      icon: <MapPin className="text-primary text-xl" />,
      title: "Address",
      content: "123 Mediterranean Avenue\nCityville, ST 12345"
    },
    {
      icon: <Clock className="text-primary text-xl" />,
      title: "Opening Hours",
      content: "Monday to Friday: 11:30 AM - 10:00 PM\nSaturday & Sunday: 12:00 PM - 11:00 PM"
    },
    {
      icon: <Phone className="text-primary text-xl" />,
      title: "Contact",
      content: "Phone: (555) 123-4567\nEmail: info@abouhilal.com"
    }
  ];

  const socialLinks = [
    { icon: <Facebook />, href: "#" },
    { icon: <Instagram />, href: "#" },
    { icon: <Twitter />, href: "#" }
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start gap-12">
          <div 
            className={`md:w-1/2 transform transition-all duration-700 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}
          >
            <h2 className="font-playfair text-4xl font-bold mb-6">Visit Us</h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
            Découvrez les saveurs authentiques et l'atmosphère chaleureuse du Maroc dans notre restaurant. Nous avons hâte de vous accueillir pour une expérience culinaire inoubliable.
            </p>
            
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mr-4 shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{info.title}</h3>
                    <p className="text-gray-700 whitespace-pre-line">{info.content}</p>
                  </div>
                </div>
              ))}
              
              <div className="flex items-center space-x-4 mt-8">
                {socialLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.href} 
                    className="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div 
            className={`md:w-1/2 h-80 md:h-[500px] w-full rounded-xl overflow-hidden shadow-lg transform transition-all duration-700 delay-200 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            }`}
          >
            {/* Map image placeholder - would be replaced with an actual map component in production */}
            <img 
              src="https://images.unsplash.com/photo-1569336415962-a4bd9f69c07a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Map location of ABOU Hilal restaurant" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
