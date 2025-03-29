import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SiCoffeescript } from 'react-icons/si';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSSOLoading, setIsSSOLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login, loginWithSSO, isAuthenticated } = useAuth();

  // Rediriger vers /admin si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/admin');
    }
  }, [isAuthenticated, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);

      if (success) {
        toast({
          title: 'Connexion réussie',
          description: 'Vous êtes maintenant connecté.',
        });
        setLocation('/admin');
      } else {
        toast({
          title: 'Erreur de connexion',
          description: 'Nom d\'utilisateur ou mot de passe incorrect.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur s\'est produite lors de la connexion.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSOLogin = async () => {
    setIsSSOLoading(true);
    try {
      await loginWithSSO();
      // Pas besoin de redirection explicite ici, elle sera gérée par le SSO
    } catch (error) {
      toast({
        title: 'Erreur SSO',
        description: 'Une erreur s\'est produite lors de la connexion SSO.',
        variant: 'destructive',
      });
      setIsSSOLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <SiCoffeescript className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Restaurant ABOU Hilal</CardTitle>
          <CardDescription>Connectez-vous pour accéder à l'espace administrateur</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Nom d'utilisateur
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                placeholder="admin"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-opacity-90"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-50 px-2 text-muted-foreground">Ou connectez-vous avec</span>
              </div>
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={handleSSOLogin}
              disabled={isSSOLoading}
            >
              {isSSOLoading ? 'Connexion...' : 'Authentification SSO'}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          Pour accéder à la démo, utilisez: admin / admin123
        </CardFooter>
      </Card>
    </div>
  );
}