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
  title: 'Cartly — The Premier Commerce Platform',
  description: 'Verified hardware and consumer marketplace with customer storefront and admin command center.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-[#061e14] text-slate-900 dark:text-emerald-50 min-h-screen flex flex-col antialiased selection:bg-emerald-600 selection:text-white transition-colors duration-200">
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
