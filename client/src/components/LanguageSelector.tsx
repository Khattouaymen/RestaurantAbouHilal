import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setIsOpen(false);
  };

  // Déterminer la langue actuelle
  const currentLanguage = i18n.language;
  
  // Afficher le nom de la langue sélectionnée
  const getLanguageName = (code: string) => {
    switch(code) {
      case 'fr': return t('languageSelector.fr');
      case 'en': return t('languageSelector.en');
      case 'ar': return t('languageSelector.ar');
      default: return t('languageSelector.fr');
    }
  };

  // Classes supplémentaires pour l'arabe (alignement à droite, etc.)
  const isRTL = currentLanguage === 'ar';
  const rtlClass = isRTL ? 'rtl-language' : '';

  return (
    <div className={`language-selector ${rtlClass}`}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 px-2"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden md:inline-block ml-1">
              {getLanguageName(currentLanguage)}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => changeLanguage('fr')}>
            <span className={currentLanguage === 'fr' ? 'font-bold' : ''}>
              {t('languageSelector.fr')}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage('en')}>
            <span className={currentLanguage === 'en' ? 'font-bold' : ''}>
              {t('languageSelector.en')}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeLanguage('ar')}>
            <span className={currentLanguage === 'ar' ? 'font-bold' : ''}>
              {t('languageSelector.ar')}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}