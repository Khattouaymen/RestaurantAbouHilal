import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLocation, Link } from 'wouter';
import { LogOut, Settings, ShoppingBag } from 'lucide-react';

interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  name: string;
  price: number;
}

interface Order {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  specialInstructions: string | null;
  createdAt: string; // ISO date string
  items: OrderItem[];
  
  // Propriété calculée pour l'affichage
  customerName?: string;
  // Propriété pour les frais de livraison
  deliveryFee?: number;
}

// Statuses de commande
const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Fonction pour formater la date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Fonction pour calculer le total d'une commande
const calculateOrderTotal = (items: OrderItem[]) => {
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = subtotal * 0.07; // 7% de frais de livraison
  return {
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee
  };
};

// Composant pour afficher les détails d'une commande
function OrderDetails({ order, onStatusChange }: { order: Order, onStatusChange: (orderId: number, status: string) => void }) {
  const handleStatusChange = (status: string) => {
    onStatusChange(order.id, status);
  };

  const { subtotal, deliveryFee, total } = calculateOrderTotal(order.items);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-xl mb-1">Commande #{order.id}</h3>
          <p className="text-gray-500 text-sm">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            order.status === ORDER_STATUSES.PENDING ? 'bg-blue-100 text-blue-800' :
            order.status === ORDER_STATUSES.CONFIRMED ? 'bg-indigo-100 text-indigo-800' :
            order.status === ORDER_STATUSES.PREPARING ? 'bg-yellow-100 text-yellow-800' :
            order.status === ORDER_STATUSES.OUT_FOR_DELIVERY ? 'bg-purple-100 text-purple-800' :
            order.status === ORDER_STATUSES.DELIVERED ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {order.status === ORDER_STATUSES.PENDING ? 'En attente' :
             order.status === ORDER_STATUSES.CONFIRMED ? 'Confirmée' :
             order.status === ORDER_STATUSES.PREPARING ? 'En préparation' :
             order.status === ORDER_STATUSES.OUT_FOR_DELIVERY ? 'En livraison' :
             order.status === ORDER_STATUSES.DELIVERED ? 'Livrée' : 'Annulée'}
          </span>
          <span className="font-bold text-lg mt-2">{total.toFixed(2)} Dhs</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2">Informations client</h4>
          <p className="mb-1"><span className="font-medium">Nom:</span> {order.customerName}</p>
          <p className="mb-1"><span className="font-medium">Email:</span> {order.email}</p>
          <p className="mb-1"><span className="font-medium">Téléphone:</span> {order.phone}</p>
          <p className="mb-1"><span className="font-medium">Adresse:</span> {order.address}</p>
          {order.specialInstructions && (
            <p className="mb-1">
              <span className="font-medium">Instructions spéciales:</span> {order.specialInstructions}
            </p>
          )}
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Articles commandés</h4>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span>{(item.price * item.quantity).toFixed(2)} Dhs</span>
              </div>
            ))}
            <div className="h-px bg-gray-200 my-2"></div>
            <div className="flex justify-between text-sm">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)} Dhs</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Frais de livraison (7%)</span>
              <span>{deliveryFee.toFixed(2)} Dhs</span>
            </div>
            <div className="h-px bg-gray-200 my-2"></div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{total.toFixed(2)} Dhs</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="font-semibold mb-3">Mettre à jour le statut</h4>
        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            variant={order.status === ORDER_STATUSES.CONFIRMED ? "default" : "outline"}
            onClick={() => handleStatusChange(ORDER_STATUSES.CONFIRMED)}
            disabled={order.status === ORDER_STATUSES.DELIVERED || order.status === ORDER_STATUSES.CANCELLED}
          >
            Confirmer
          </Button>
          <Button 
            size="sm" 
            variant={order.status === ORDER_STATUSES.PREPARING ? "default" : "outline"}
            onClick={() => handleStatusChange(ORDER_STATUSES.PREPARING)}
            disabled={order.status === ORDER_STATUSES.DELIVERED || order.status === ORDER_STATUSES.CANCELLED}
          >
            En préparation
          </Button>
          <Button 
            size="sm" 
            variant={order.status === ORDER_STATUSES.OUT_FOR_DELIVERY ? "default" : "outline"}
            onClick={() => handleStatusChange(ORDER_STATUSES.OUT_FOR_DELIVERY)}
            disabled={order.status === ORDER_STATUSES.DELIVERED || order.status === ORDER_STATUSES.CANCELLED}
          >
            En livraison
          </Button>
          <Button 
            size="sm" 
            variant={order.status === ORDER_STATUSES.DELIVERED ? "default" : "outline"}
            onClick={() => handleStatusChange(ORDER_STATUSES.DELIVERED)}
            disabled={order.status === ORDER_STATUSES.DELIVERED}
          >
            Livrée
          </Button>
          <Button 
            size="sm" 
            variant={order.status === ORDER_STATUSES.CANCELLED ? "destructive" : "outline"}
            className={order.status !== ORDER_STATUSES.CANCELLED ? "text-red-500 border-red-200" : ""}
            onClick={() => handleStatusChange(ORDER_STATUSES.CANCELLED)}
            disabled={order.status === ORDER_STATUSES.DELIVERED || order.status === ORDER_STATUSES.CANCELLED}
          >
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
}

// Composant principal Admin
export default function Admin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [lastOrderCount, setLastOrderCount] = useState<number>(0);
  const [hasNewOrders, setHasNewOrders] = useState<boolean>(false);
  const [newOrderIds, setNewOrderIds] = useState<number[]>([]);
  
  const { data: orders = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders');
      const data = await res.json();
      // Vérifie que toute commande a ses articles et ajoute la propriété calculée customerName
      return data.map((order: Order) => {
        // S'assurer que les éléments sont un tableau
        const items = Array.isArray(order.items) ? order.items : [];
        
        return {
          ...order,
          customerName: `${order.firstName} ${order.lastName}`,
          items: items
        };
      });
    },
    // Actualiser automatiquement toutes les 5 secondes pour une mise à jour plus rapide
    refetchInterval: 5000
  });

  // Handle success callback separately
  useEffect(() => {
    if (!orders.length) return;
    
    // Si c'est le premier chargement, juste enregistrer le nombre
    if (lastOrderCount === 0) {
      setLastOrderCount(orders.length);
      return;
    }
    
    // Vérifier s'il y a de nouvelles commandes
    if (orders.length > lastOrderCount) {
      // Identifier les nouvelles commandes
      const sortedData = [...orders].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      // Récupérer les IDs des nouvelles commandes (les n premières, où n est le nombre de nouvelles commandes)
      const newOrdersCount = orders.length - lastOrderCount;
      const newIds = sortedData.slice(0, newOrdersCount).map(order => order.id);
      
      setNewOrderIds(newIds);
      setHasNewOrders(true);
      
      // Notification pour nouvelles commandes
      toast({
        title: "Nouvelles commandes",
        description: `${newOrdersCount} nouvelle(s) commande(s) reçue(s)`,
        variant: "default",
      });
    }
    
    setLastOrderCount(orders.length);
  }, [orders, lastOrderCount, toast]);

  // Trier les commandes par date (plus récentes en premier)
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Filtrer les commandes en fonction de l'onglet actif
  const filteredOrders = sortedOrders.filter((order: Order) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') {
      return order.status !== ORDER_STATUSES.DELIVERED && order.status !== ORDER_STATUSES.CANCELLED;
    }
    return order.status === activeTab;
  });
  
  // Réinitialiser l'indicateur de nouvelles commandes lors du changement d'onglet
  useEffect(() => {
    setHasNewOrders(false);
  }, [activeTab]);

  // Fonction pour mettre à jour le statut d'une commande
  const { logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleStatusChange = async (orderId: number, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        toast({
          title: "Statut mis à jour",
          description: "Le statut de la commande a été mis à jour avec succès.",
        });
        refetch(); // Rafraîchir les données
      } else {
        throw new Error('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la commande.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Administration des commandes</h1>
        <div className="text-center py-10">Chargement des commandes...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Administration des commandes</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          Erreur lors du chargement des commandes. Veuillez réessayer.
        </div>
      </div>
    );
  }

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

  // Composant pour afficher les détails d'une commande avec mise en évidence pour les nouvelles commandes
  function OrderDetailsWithHighlight({ order, onStatusChange, isNew }: { 
    order: Order, 
    onStatusChange: (orderId: number, status: string) => void,
    isNew: boolean 
  }) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 ${
        isNew ? 'border-l-4 border-primary animate-pulse-border' : ''
      }`}>
        {/* Contenu existant du composant OrderDetails */}
        <OrderDetails order={order} onStatusChange={onStatusChange} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Administration</h1>
        <div className="flex gap-3">
          <Link href="/admin/menu">
            <Button 
              variant="secondary" 
              className="flex items-center gap-2"
            >
              <ShoppingBag size={16} />
              Gérer le menu
            </Button>
          </Link>
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
      
      <h2 className="text-2xl font-semibold mb-6">
        Gestion des commandes
        {hasNewOrders && (
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white animate-pulse">
            Nouvelles commandes
          </span>
        )}
      </h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Toutes les commandes</TabsTrigger>
          <TabsTrigger value="active">Commandes actives</TabsTrigger>
          <TabsTrigger value={ORDER_STATUSES.PENDING}>En attente</TabsTrigger>
          <TabsTrigger value={ORDER_STATUSES.PREPARING}>En préparation</TabsTrigger>
          <TabsTrigger value={ORDER_STATUSES.OUT_FOR_DELIVERY}>En livraison</TabsTrigger>
          <TabsTrigger value={ORDER_STATUSES.DELIVERED}>Livrées</TabsTrigger>
          <TabsTrigger value={ORDER_STATUSES.CANCELLED}>Annulées</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              Aucune commande trouvée dans cette catégorie.
            </div>
          ) : (
            <div>
              {filteredOrders.map((order: Order) => (
                <OrderDetailsWithHighlight 
                  key={order.id} 
                  order={order} 
                  onStatusChange={handleStatusChange} 
                  isNew={newOrderIds.includes(order.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}