import { useTranslation } from 'react-i18next'

const Header = ({ title, children }: { title: string, children?: React.ReactNode }) => {
  const { t } = useTranslation();
  
  return (
    <header className="backdrop-blur-sm sticky top-0 z-10 border-b border-gray-300 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <h1 className="text-3xl font-display tracking-wider text-foreground">
            {t(title)}
          </h1>
          {children}
        </div>
      </header>
  );
}

export default Header;