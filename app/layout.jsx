import './globals.css';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { AuthProvider } from '@/lib/auth/authContext';
import { CartProvider } from '@/lib/context/CartContext';
import { WishlistProvider } from '@/lib/context/WishlistContext';
import SplashIntro from '@/components/animation/SplashIntro';
import ToastNotification from '@/components/ui/ToastNotification';
import CartDrawer from '@/components/cart/CartDrawer';
import SupportWidget from '@/components/support/SupportWidget';

export const metadata = {
  title: 'Cartly — The Commerce Platform',
  description: 'Discover quality products across fashion, footwear, and electronics.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-[#0a0a0a] text-slate-900 dark:text-white min-h-screen flex flex-col antialiased selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-slate-900 transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <SplashIntro />
                <CartDrawer />
                <ToastNotification />
                <SupportWidget />
                {children}
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
