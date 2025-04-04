import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLocation, Link } from 'wouter';
import { LogOut, ChevronLeft, Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { MenuItem, Category } from '@shared/schema';

// Interface pour l'état d'édition d'un élément de menu
interface EditingMenuItem extends Omit<MenuItem, 'id'> {
  id?: number;
}

// Composant principal AdminMenu
export default function AdminMenu() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<EditingMenuItem | null>(null);
  const { logout } = useAuth();
  const [, setLocation] = useLocation();

  // Récupérer les articles du menu
  const { data: menuItems = [], isLoading: menuLoading, isError: menuError, refetch: refetchMenu } = useQuery({
    queryKey: ['/api/menu-items'],
    queryFn: async () => {
      const res = await fetch('/api/menu-items');
      return res.json();
    }
  });

  // Récupérer les catégories
  const { data: categories = [], isLoading: categoriesLoading, isError: categoriesError } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      return res.json();
    }
  });

  // Filtrer les éléments de menu en fonction de la catégorie active
  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter((item: MenuItem) => {
        const category = categories.find((cat: Category) => cat.id === item.categoryId);
        return category?.slug === activeCategory;
      });

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
      setLocation('/login');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  // Fonction pour commencer l'édition d'un élément de menu
  const handleEditItem = (item: MenuItem) => {
    setEditingItem({
      ...item,
      id: item.id
    });
    setIsEditing(true);
  };

  // Fonction pour créer un nouvel élément de menu
  const handleNewItem = () => {
    const defaultCategoryId = categories.length > 0 ? categories[0].id : 1;
    setEditingItem({
      name: '',
      description: '',
      price: '',
      image: '/assets/placeholder-food.jpg',
      categoryId: defaultCategoryId,
      featured: 0,
      tags: ''
    });
    setIsEditing(true);
  };

  // Fonction pour annuler l'édition
  const handleCancelEdit = () => {
    setEditingItem(null);
    setIsEditing(false);
  };

  // Fonction pour sauvegarder un élément de menu (nouveau ou modifié)
  const handleSaveItem = async () => {
    if (!editingItem) return;

    try {
      let response;
      if (editingItem.id) {
        // Mise à jour d'un élément existant
        response = await fetch(`/api/menu-items/${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingItem),
        });
      } else {
        // Création d'un nouvel élément
        response = await fetch('/api/menu-items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingItem),
        });
      }

      if (response.ok) {
        toast({
          title: editingItem.id ? "Plat mis à jour" : "Plat ajouté",
          description: editingItem.id 
            ? "Le plat a été mis à jour avec succès." 
            : "Le nouveau plat a été ajouté avec succès.",
        });
        setIsEditing(false);
        setEditingItem(null);
        refetchMenu();
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le plat.",
        variant: "destructive",
      });
    }
  };

  // Fonction pour supprimer un élément de menu
  const handleDeleteItem = async (itemId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce plat ? Cette action est irréversible.")) {
      return;
    }

    try {
      const response = await fetch(`/api/menu-items/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Plat supprimé",
          description: "Le plat a été supprimé avec succès.",
        });
        refetchMenu();
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le plat.",
        variant: "destructive",
      });
    }
  };

  // États de chargement et d'erreur
  if (menuLoading || categoriesLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ChevronLeft size={16} />
              Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Gestion du menu</h1>
        </div>
        <div className="text-center py-10">Chargement des données...</div>
      </div>
    );
  }

  if (menuError || categoriesError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ChevronLeft size={16} />
              Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Gestion du menu</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          Erreur lors du chargement des données. Veuillez réessayer.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ChevronLeft size={16} />
              Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Gestion du menu</h1>
        </div>
        <div className="flex gap-3">
          {!isEditing && (
            <Button 
              onClick={handleNewItem}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Ajouter un plat
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            Déconnexion
          </Button>
        </div>
      </div>

      {isEditing ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingItem?.id ? 'Modifier un plat' : 'Ajouter un nouveau plat'}</CardTitle>
            <CardDescription>Remplissez tous les champs pour {editingItem?.id ? 'modifier' : 'ajouter'} ce plat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom du plat</label>
                <Input 
                  value={editingItem?.name || ''} 
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, name: e.target.value} : null)} 
                  placeholder="ex: Salade César" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prix (Dhs)</label>
                <Input 
                  value={editingItem?.price || ''} 
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, price: e.target.value} : null)} 
                  placeholder="ex: 45" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea 
                value={editingItem?.description || ''} 
                onChange={(e) => setEditingItem(prev => prev ? {...prev, description: e.target.value} : null)} 
                placeholder="Description du plat..." 
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL de l'image</label>
              <Input 
                value={editingItem?.image || ''} 
                onChange={(e) => setEditingItem(prev => prev ? {...prev, image: e.target.value} : null)} 
                placeholder="ex: /assets/salade-cesar.jpg" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category-select" className="block text-sm font-medium mb-1">Catégorie</label>
                <select 
                  id="category-select"
                  aria-label="Sélectionner la catégorie"
                  className="w-full p-2 rounded border border-gray-300" 
                  value={editingItem?.categoryId || ''}
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, categoryId: parseInt(e.target.value)} : null)}
                >
                  {categories.map((category: Category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (séparés par des virgules)</label>
                <Input 
                  value={editingItem?.tags || ''} 
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, tags: e.target.value} : null)} 
                  placeholder="ex: végétarien, populaire, nouveau" 
                />
              </div>
            </div>
            <div>
              <label htmlFor="featured-select" className="block text-sm font-medium mb-1">Plat vedette</label>
              <select 
                id="featured-select"
                aria-label="Sélectionner si le plat est vedette"
                className="w-full p-2 rounded border border-gray-300" 
                value={editingItem?.featured || 0}
                onChange={(e) => setEditingItem(prev => prev ? {...prev, featured: parseInt(e.target.value)} : null)}
              >
                <option value={0}>Non</option>
                <option value={1}>Oui</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancelEdit} className="flex items-center gap-1">
              <X size={16} />
              Annuler
            </Button>
            <Button type="button" onClick={handleSaveItem} className="flex items-center gap-1">
              <Save size={16} />
              Enregistrer
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="all">Tous les plats</TabsTrigger>
            {categories.map((category: Category) => (
              <TabsTrigger key={category.id} value={category.slug}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory}>
            {filteredItems.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                Aucun plat trouvé dans cette catégorie.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item: MenuItem) => {
                  const category = categories.find((cat: Category) => cat.id === item.categoryId);
                  return (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{item.name}</CardTitle>
                            <p className="text-sm text-gray-500">{category?.name}</p>
                          </div>
                          <p className="font-bold text-lg">{item.price} Dhs</p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">{item.description}</p>
                        {item.featured === 1 && (
                          <p className="mt-2 text-xs text-primary-600 font-medium">✓ Plat vedette</p>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button 
                          type="button"
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteItem(item.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Supprimer
                        </Button>
                        <Button 
                          type="button"
                          size="sm" 
                          onClick={() => handleEditItem(item)}
                          className="flex items-center gap-1"
                        >
                          <Pencil size={14} />
                          Modifier
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}