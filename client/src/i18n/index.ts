import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Les ressources de traduction - définies directement
const resources = {
  fr: {
    translation: {
      general: {
        welcome: "Bienvenue chez Restaurant ABOU Hilal",
        tagline: "Cuisine marocaine authentique",
        currency: "Dhs",
        addToCart: "Ajouter au panier",
        viewCart: "Voir le panier",
        orderNow: "Commander maintenant",
        viewMenu: "Voir le menu",
        orderOnline: "Commander en ligne",
        total: "Total",
        subtotal: "Sous-total",
        commission: "Commission",
        deliveryFee: "Frais de livraison",
        orderSummary: "Résumé de la commande",
        quantity: "Quantité",
        price: "Prix",
        name: "Nom",
        item: "Article",
        specialInstructions: "Instructions spéciales",
        confirmOrder: "Confirmer la commande",
        orderSuccess: "Commande réussie!",
        thankYou: "Merci pour votre commande",
        myOrder: "Ma commande",
        estimatedDelivery: "Livraison estimée",
        popularItems: "Plats populaires",
        topSellers: "Meilleures ventes",
        all: "Tous",
        addedToOrder: "a été ajouté à votre commande",
        ourMenu: "Notre Menu",
        menuDescription: "Découvrez notre sélection de plats marocains authentiques, préparés avec des épices traditionnelles pour vous offrir les vraies saveurs du Maroc.",
        viewFullMenu: "Voir le menu complet",
        mostPopular: "Le plus populaire",
        tags: {
          spicy: "Épicé",
          chefSpecial: "Spécialité du Chef",
          traditional: "Traditionnel",
          vegetarian: "Option Végétarienne",
          seafood: "Fruits de mer",
          beverage: "Boisson",
          featured: "En vedette"
        }
      },
      nav: {
        home: "Accueil",
        menu: "Menu",
        about: "À propos",
        contact: "Contact",
        gallery: "Galerie",
        order: "Commander",
        login: "Connexion",
        admin: "Administration",
        cart: "Panier"
      },
      form: {
        firstName: "Prénom",
        lastName: "Nom",
        email: "Email",
        phone: "Téléphone",
        address: "Adresse",
        submit: "Envoyer",
        required: "Champ requis",
        invalidEmail: "Email invalide",
        invalidPhone: "Numéro de téléphone invalide"
      },
      languageSelector: {
        title: "Langue",
        fr: "Français",
        en: "Anglais",
        ar: "Arabe"
      }
    }
  },
  en: {
    translation: {
      general: {
        welcome: "Welcome to ABOU Hilal Restaurant",
        tagline: "Authentic Moroccan cuisine",
        currency: "Dhs",
        addToCart: "Add to cart",
        viewCart: "View cart",
        orderNow: "Order now",
        viewMenu: "View menu",
        orderOnline: "Order online",
        total: "Total",
        subtotal: "Subtotal",
        commission: "Commission",
        deliveryFee: "Delivery fee",
        orderSummary: "Order summary",
        quantity: "Quantity",
        price: "Price",
        name: "Name",
        item: "Item",
        specialInstructions: "Special instructions",
        confirmOrder: "Confirm order",
        orderSuccess: "Order successful!",
        thankYou: "Thank you for your order",
        myOrder: "My order",
        estimatedDelivery: "Estimated delivery",
        popularItems: "Popular items",
        topSellers: "Top sellers",
        all: "All",
        addedToOrder: "has been added to your order",
        ourMenu: "Our Menu",
        menuDescription: "Discover our selection of authentic Moroccan dishes, prepared with traditional spices to bring the true flavors of Morocco to your table.",
        viewFullMenu: "View full menu",
        mostPopular: "Most Popular",
        tags: {
          spicy: "Spicy",
          chefSpecial: "Chef's Special",
          traditional: "Traditional",
          vegetarian: "Vegetarian Option",
          seafood: "Seafood",
          beverage: "Beverage",
          featured: "Featured"
        }
      },
      nav: {
        home: "Home",
        menu: "Menu",
        about: "About",
        contact: "Contact",
        gallery: "Gallery",
        order: "Order",
        login: "Login",
        admin: "Admin",
        cart: "Cart"
      },
      form: {
        firstName: "First name",
        lastName: "Last name",
        email: "Email",
        phone: "Phone",
        address: "Address",
        submit: "Submit",
        required: "Required field",
        invalidEmail: "Invalid email",
        invalidPhone: "Invalid phone number"
      },
      languageSelector: {
        title: "Language",
        fr: "French",
        en: "English",
        ar: "Arabic"
      }
    }
  },
  ar: {
    translation: {
      general: {
        welcome: "مرحبا بكم في مطعم أبو هلال",
        tagline: "المطبخ المغربي الأصيل",
        currency: "درهم",
        addToCart: "أضف إلى السلة",
        viewCart: "عرض السلة",
        orderNow: "اطلب الآن",
        viewMenu: "عرض القائمة",
        orderOnline: "اطلب عبر الإنترنت",
        total: "المجموع",
        subtotal: "المجموع الفرعي",
        commission: "عمولة",
        deliveryFee: "رسوم التوصيل",
        orderSummary: "ملخص الطلب",
        quantity: "الكمية",
        price: "السعر",
        name: "الاسم",
        item: "عنصر",
        specialInstructions: "تعليمات خاصة",
        confirmOrder: "تأكيد الطلب",
        orderSuccess: "تم الطلب بنجاح!",
        thankYou: "شكرا لطلبك",
        myOrder: "طلبي",
        estimatedDelivery: "التسليم المقدر",
        popularItems: "الأطباق الشعبية",
        topSellers: "الأكثر مبيعًا",
        all: "الكل",
        addedToOrder: "تمت إضافته إلى طلبك",
        ourMenu: "قائمتنا",
        menuDescription: "اكتشف مجموعتنا من الأطباق المغربية الأصيلة، المحضرة بالتوابل التقليدية لإحضار النكهات الحقيقية للمغرب إلى طاولتك.",
        viewFullMenu: "عرض القائمة الكاملة",
        mostPopular: "الأكثر شعبية",
        tags: {
          spicy: "حار",
          chefSpecial: "تخصص الشيف",
          traditional: "تقليدي",
          vegetarian: "خيار نباتي",
          seafood: "مأكولات بحرية",
          beverage: "مشروب",
          featured: "مميز"
        }
      },
      nav: {
        home: "الرئيسية",
        menu: "القائمة",
        about: "من نحن",
        contact: "اتصل بنا",
        gallery: "المعرض",
        order: "اطلب الآن",
        login: "تسجيل الدخول",
        admin: "الإدارة",
        cart: "سلة المشتريات"
      },
      form: {
        firstName: "الاسم الأول",
        lastName: "اسم العائلة",
        email: "البريد الإلكتروني",
        phone: "الهاتف",
        address: "العنوان",
        submit: "إرسال",
        required: "حقل مطلوب",
        invalidEmail: "بريد إلكتروني غير صالح",
        invalidPhone: "رقم هاتف غير صالح"
      },
      languageSelector: {
        title: "اللغة",
        fr: "الفرنسية",
        en: "الإنجليزية",
        ar: "العربية"
      }
    }
  }
};

i18n
  // Détecte la langue du navigateur
  .use(LanguageDetector)
  // Intégration avec React
  .use(initReactI18next)
  // Initialisation de i18next
  .init({
    resources,
    fallbackLng: 'fr', // Langue par défaut si aucune traduction n'est disponible
    debug: false, // Désactiver debug en production

    interpolation: {
      escapeValue: false, // Non nécessaire pour React
    },
    
    // Options de détection de langue
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;