// Menu categories
export const MENU_CATEGORIES = [
  { id: 1, name: 'Tous', slug: 'all' },
  { id: 2, name: 'Entrées Froides', slug: 'entrees-froides' },
  { id: 3, name: 'Entrées Chaudes', slug: 'entrees-chaudes' },
  { id: 4, name: 'Pâtes', slug: 'pates' },
  { id: 5, name: 'Grillades', slug: 'grillades' },
  { id: 6, name: 'Sandwichs', slug: 'sandwichs' },
  { id: 7, name: 'Desserts', slug: 'desserts' },
  { id: 8, name: 'Boissons', slug: 'boissons' }
];

// Menu items (for initial data)
export const MENU_ITEMS = [
  // Entrées Froides
  {
    id: 1,
    name: 'Salade Caesar',
    description: 'Salade Romaine, poulet, tomates cerise, copeaux de parmesan, croûtons, sauce Caesar',
    price: 46,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 2,
    featured: 1,
    tags: 'popular'
  },
  {
    id: 2,
    name: 'Salade Abou Hilal',
    description: 'Mesclun de salade, fruits de mer, surimi, mangue, avocat, tomates cerise, maïs épis, haricot rouge, sauce vinaigrette',
    price: 55,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 2,
    featured: 1,
    tags: 'specialty'
  },
  {
    id: 3,
    name: 'Salade Fraîcheur',
    description: 'Mesclun de salade, thon, haricot vert, tomate, pomme de terre, carotte, concombre, maïs, œuf, betterave, olives noires, riz, sauce vinaigrette',
    price: 35,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 2,
    featured: 0,
    tags: 'healthy'
  },
  {
    id: 4,
    name: 'Salade Marocaine',
    description: 'Laitue, tomate, thon, concombre, oignons, olives vertes',
    price: 20,
    image: 'https://images.unsplash.com/photo-1537785713284-0015ce8a145c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 2,
    featured: 0,
    tags: 'traditional'
  },
  {
    id: 5,
    name: 'Salade Zaalouk',
    description: 'Aubergines, tomates, ail, huile d\'olive',
    price: 20,
    image: 'https://images.unsplash.com/photo-1604579278540-464f118fea2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 2,
    featured: 0,
    tags: 'vegetarian'
  },
  
  // Entrées Chaudes
  {
    id: 6,
    name: 'Gratin Fruits de Mer',
    description: 'Cocktail de fruits de mer gratinés au fromage',
    price: 63,
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 3,
    featured: 1,
    tags: 'seafood'
  },
  {
    id: 7,
    name: 'Gratin Poulet',
    description: 'Poulet et champignons, sauce gratinée',
    price: 52,
    image: 'https://images.unsplash.com/photo-1633352615304-df59f48c3692?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 3,
    featured: 0,
    tags: 'chicken'
  },
  {
    id: 8,
    name: 'Pasticcio',
    description: 'Viande hachée, poulet, charcuterie, mixte ou chawarma',
    price: 35,
    image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 3,
    featured: 0,
    tags: 'pasta'
  },
  
  // Pâtes
  {
    id: 9,
    name: 'All\'Arrabbiata',
    description: 'Sauce tomate épicée, tomate cerise, basilic, parmesan',
    price: 35,
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 4,
    featured: 0,
    tags: 'spicy'
  },
  {
    id: 10,
    name: 'Al Thon',
    description: 'Sauce tomate, thon, olives noires, tomates cerise, basilic, parmesan',
    price: 46,
    image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 4,
    featured: 0,
    tags: 'seafood'
  },
  {
    id: 11,
    name: 'Bolognaise',
    description: 'Sauce tomate, viande hachée, basilic, parmesan',
    price: 49,
    image: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 4,
    featured: 1,
    tags: 'popular'
  },
  {
    id: 12,
    name: 'Alfredo',
    description: 'Crème fraîche, champignons, blanc de poulet, parmesan',
    price: 49,
    image: 'https://images.unsplash.com/photo-1597393353415-b3730f3110a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 4,
    featured: 0,
    tags: 'creamy'
  },
  {
    id: 13,
    name: 'Abou Hilal',
    description: 'Crème fraîche, jambon fumé, épinard, champignons, parmesan',
    price: 45,
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 4,
    featured: 1,
    tags: 'specialty'
  },
  {
    id: 14,
    name: 'Fruits de Mer',
    description: 'Crème fraîche, cocktail de fruits de mer, parmesan',
    price: 65,
    image: 'https://images.unsplash.com/photo-1563379390276-dcb947e58797?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 4,
    featured: 1,
    tags: 'seafood'
  },
  
  // Grillades et Plats Principaux
  {
    id: 15,
    name: 'Mixed Grill',
    description: '2 accompagnements au choix : riz, frites, légumes, pâtes, purée',
    price: 69,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 5,
    featured: 1,
    tags: 'meat'
  },
  {
    id: 16,
    name: 'Coquelet Farci',
    description: 'Vermicelle de riz',
    price: 69,
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 5,
    featured: 0,
    tags: 'chicken'
  },
  {
    id: 17,
    name: 'Côte de Veau Grillée',
    description: 'Sauce champignons maison',
    price: 79,
    image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 5,
    featured: 0,
    tags: 'premium'
  },
  {
    id: 18,
    name: 'Chicken Abou Hilal',
    description: 'Poulet Crispy, 2 accompagnements au choix',
    price: 69,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 5,
    featured: 1,
    tags: 'specialty'
  },
  
  // Sandwichs
  {
    id: 19,
    name: 'Sandwich Poulet',
    description: 'Servi avec frites',
    price: 37,
    image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 6,
    featured: 0,
    tags: 'chicken'
  },
  {
    id: 20,
    name: 'Sandwich Abou Hilal',
    description: 'Poulet Crispy, servi avec frites',
    price: 37,
    image: 'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 6,
    featured: 1,
    tags: 'specialty'
  },
  
  // Desserts
  {
    id: 21,
    name: 'Tiramisù',
    description: 'Mousse légère au mascarpone, cacao, Nutella et spéculoos',
    price: 25,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 7,
    featured: 1,
    tags: 'popular'
  },
  {
    id: 22,
    name: 'Panna Cotta',
    description: 'Coulis de fruits rouges',
    price: 20,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 7,
    featured: 0,
    tags: 'italian'
  },
  {
    id: 23,
    name: 'Cheesecake Américain',
    description: 'Coulis de caramel, beurre salé, spéculoos concassé',
    price: 28,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 7,
    featured: 1,
    tags: 'sweet'
  },
  
  // Boissons
  {
    id: 24,
    name: 'Jus d\'Orange',
    description: 'Fraîchement pressé',
    price: 20,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 8,
    featured: 0,
    tags: 'fresh'
  },
  {
    id: 25,
    name: 'Citronnade',
    description: 'Boisson rafraîchissante',
    price: 20,
    image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 8,
    featured: 0,
    tags: 'fresh'
  },
  {
    id: 26,
    name: 'Jus de Mangue',
    description: 'Saveur exotique',
    price: 27,
    image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 8,
    featured: 1,
    tags: 'fresh'
  }
];
