import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  // Log l'état actuel pour le débogage
  console.log('ProtectedRoute state:', { 
    isAuthenticated, 
    isLoading, 
    currentLocation: location 
  });

  useEffect(() => {
    // Seulement rediriger si on n'est pas en train de charger et qu'on n'est pas authentifié
    if (!isLoading && !isAuthenticated) {
      console.log('ProtectedRoute: redirecting to /login');
      setLocation('/login');
    }
  }, [isAuthenticated, isLoading, setLocation, location]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  // Ne rien rendre si on n'est pas authentifié, la redirection se fera dans useEffect
  if (!isAuthenticated) {
    return null;
  }

  // Si on est authentifié, afficher les enfants
  return <>{children}</>;
}