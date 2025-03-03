import React, { ReactNode } from 'react';
import { useTheme } from '../../context/theme-context';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * MainLayout component that ensures the application uses the full screen width
 * and applies the current theme colors.
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { colors } = useTheme();

  return (
    <div 
      className="min-h-screen w-full flex flex-col"
      style={{ 
        backgroundColor: colors.background,
        color: colors.text
      }}
    >
      <main className="flex-1 w-full">
        <div className="w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout; 