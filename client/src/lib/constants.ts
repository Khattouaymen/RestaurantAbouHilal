// Menu categories
export const MENU_CATEGORIES = [
  { id: 1, name: 'All', slug: 'all' },
  { id: 2, name: 'Main Dishes', slug: 'main-dishes' },
  { id: 3, name: 'Starters', slug: 'starters' },
  { id: 4, name: 'Desserts', slug: 'desserts' },
  { id: 5, name: 'Beverages', slug: 'beverages' }
];

// Menu items (for initial data)
export const MENU_ITEMS = [
  {
    id: 1,
    name: 'Couscous Royal',
    description: 'Traditional couscous served with lamb, chicken, merguez sausage, and a medley of seasonal vegetables in a flavorful broth.',
    price: 22.95,
    image: 'https://images.unsplash.com/photo-1617621101518-1ea1f52c0fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 2,
    featured: 1,
    tags: 'spicy'
  },
  {
    id: 2,
    name: 'Tajine d\'agneau',
    description: 'Tender lamb slowly simmered with prunes, almonds, and honey in our signature blend of Moroccan spices.',
    price: 24.50,
    image: 'https://images.unsplash.com/photo-1569277388175-54a3ad2a1eed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 2,
    featured: 0,
    tags: 'chef-special'
  },
  {
    id: 3,
    name: 'Pastilla au poulet',
    description: 'Sweet and savory filo pastry pie filled with chicken, eggs, almonds, and aromatic spices, dusted with cinnamon and powdered sugar.',
    price: 18.95,
    image: 'https://images.unsplash.com/photo-1592070969746-2d6648709819?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 2,
    featured: 0,
    tags: 'traditional'
  },
  {
    id: 4,
    name: 'Harira Soup',
    description: 'Traditional Moroccan soup with tomatoes, lentils, chickpeas, and tender pieces of lamb, flavored with ginger, saffron and fresh herbs.',
    price: 9.95,
    image: 'https://images.unsplash.com/photo-1527626557203-4030a3cad8e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 3,
    featured: 0,
    tags: 'vegetarian'
  },
  {
    id: 5,
    name: 'Seafood Tagine',
    description: 'Fresh fish, shrimp, and mussels cooked with bell peppers, potatoes and olives in a light chermoula sauce with aromatic herbs.',
    price: 26.50,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 2,
    featured: 0,
    tags: 'seafood'
  },
  {
    id: 6,
    name: 'Moroccan Mint Tea',
    description: 'Traditional green tea with fresh mint leaves and sugar, served in a decorative teapot with traditional pouring ceremony.',
    price: 5.95,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    categoryId: 5,
    featured: 0,
    tags: 'beverage'
  }
];
