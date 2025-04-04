import { Check, EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/lib/types';
import { useState } from 'react';

interface OrderConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  orderItems: CartItem[];
  onConfirm?: () => void;
  deliveryAddress?: string; // Add delivery address property
}

export default function OrderConfirmation({ isOpen, onClose, orderItems, onConfirm, deliveryAddress = "Adresse non spécifiée" }: OrderConfirmationProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!isOpen) return null;

  // Calculate subtotal
  const subtotal = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryFee = subtotal * 0.07; // 7% delivery fee
  const total = subtotal + deliveryFee;
  
  // Calculate delivery time (normally this would come from the backend)
  const deliveryTime = "15-30 minutes";
  
  const handleConfirm = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show confirmation screen
      setIsConfirmed(true);
      
      // Après affichage du succès, exécuter la séquence fermeture/nettoyage
      setTimeout(() => {
        // Vider le panier
        if (onConfirm) {
          onConfirm();
        }
        
        // Fermer après un court délai
        setTimeout(() => {
          onClose();
          
          // Réinitialiser les états APRÈS la fermeture complète
          setTimeout(() => {
            setIsConfirmed(false);
            setIsProcessing(false);
          }, 300);
        }, 2000);
      }, 1000);
    } catch (error) {
      setIsProcessing(false);
      console.error('Erreur lors de la confirmation:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={!isProcessing ? onClose : undefined}
      ></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 relative z-10 transform transition-transform">
        <div className="p-6 text-center">
          {isConfirmed ? (
            // Order Success View
            <div className="py-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="font-playfair text-2xl font-bold mb-4">Commande validée!</h3>
              <p className="text-gray-700 mb-6">
                Votre commande a été validée et est en cours de préparation. Vous recevrez un email de confirmation.
              </p>
              <p className="font-medium mb-6">
                Délai de livraison estimé: <span className="font-bold">{deliveryTime}</span>
              </p>
              <Button 
                onClick={onClose}
                className="bg-primary text-white py-3 px-6 rounded-full font-semibold hover:bg-opacity-90 w-full"
              >
                Fermer
              </Button>
            </div>
          ) : (
             // Order Confirmation View
            <>
              <div className="w-20 h-20 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mx-auto mb-6">
                {isProcessing ? (
                  <div className="animate-spin">
                    <EllipsisVertical className="h-6 w-6 text-primary" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-primary">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                )}
              </div>
              <h3 className="font-playfair text-2xl font-bold mb-4">
                {isProcessing ? 'Traitement en cours...' : 'Confirmation de commande ...'}
              </h3>
              <p className="text-gray-700 mb-6">
                Veuillez vérifier les détails de votre commande ci-dessous et confirmer pour finaliser votre achat.
              </p>
              
              <div className="bg-background p-4 rounded-xl mb-6 text-left">
                <h4 className="font-bold mb-2">Résumé de commande</h4>
                <div className="space-y-2 mb-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} ({item.quantity})</span>
                      <span>{(item.price * item.quantity)} Dhs</span>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-gray-200 my-3"></div>
                <div className="flex justify-between my-1">
                  <span className="text-gray-600">Frais de livraison (7%) :</span>
                  <span>{deliveryFee.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>{total.toFixed(2)} DH</span>
                </div>
              </div>
              
              {/* Display delivery address */}
              <div className="bg-background p-4 rounded-xl mb-6 text-left">
                <h4 className="font-bold mb-2">Adresse de livraison</h4>
                <p className="text-gray-700">{deliveryAddress}</p>
              </div>
              
              <p className="text-gray-700 mb-8">
                Délai de livraison estimé : <span className="font-bold">{deliveryTime}</span>
              </p>
              
              <Button 
                onClick={handleConfirm}
                disabled={isProcessing}
                className="bg-primary text-white py-3 px-6 rounded-full font-semibold hover:bg-opacity-90 w-full"
              >
                {isProcessing ? 'Traitement...' : 'Confirmez Votre Commande'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}