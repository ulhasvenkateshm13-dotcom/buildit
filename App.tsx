import React, { useState, useEffect, useCallback } from 'react';
import { PRODUCTS, CATEGORIES } from './constants';
import { Product, CartItem, Category, ProjectBundle, Review, Order, OrderStatus } from './types';

// Components
import { ShoppingCartIcon, HomeIcon, SparklesIcon, SearchIcon, CloseIcon, ClockIcon } from './components/Icons';
import ProductDetailModal from './components/ProductDetailModal';

// Views
import HomeView from './views/HomeView';
import CartView from './views/CartView';
import TrackingView from './views/TrackingView';
import AIAssistantView from './views/AIAssistantView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'ai' | 'cart' | 'tracking'>('home');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.ALL);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [locationName, setLocationName] = useState('Detecting location...');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // SEO Update
  useEffect(() => {
    document.title = activeTab === 'home' ? 'BuildItFast | Home' : 
                     activeTab === 'ai' ? 'Engineer AI' :
                     activeTab === 'cart' ? 'Your Cart' : 'Track Order';
  }, [activeTab]);

  // Mock getting location
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocationName('Sector 42, Construction Site B');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Simulate Order Progress
  useEffect(() => {
    if (!activeOrder || activeOrder.status === OrderStatus.ARRIVED) return;

    const interval = setInterval(() => {
      setActiveOrder(prev => {
        if (!prev) return null;
        
        let newProgress = prev.progress + 2; // Increment progress
        let newStatus = prev.status;
        let newEta = prev.eta;

        if (newProgress >= 100) {
           newProgress = 100;
           newStatus = OrderStatus.ARRIVED;
           newEta = 0;
           clearInterval(interval);
        } else if (newProgress > 80) {
           newEta = 1;
        } else if (newProgress > 60) {
           newStatus = OrderStatus.OUT_FOR_DELIVERY;
           newEta = 3;
        } else if (newProgress > 30) {
           newStatus = OrderStatus.PACKED;
           newEta = 6;
        } else {
           newEta = 8;
        }

        return {
          ...prev,
          progress: newProgress,
          status: newStatus,
          eta: newEta
        };
      });
    }, 1000); // Update every second for demo purposes (usually would be minutes)

    return () => clearInterval(interval);
  }, [activeOrder?.status]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
      }
      return prev.filter(item => item.id !== productId);
    });
  }, []);

  const addBundleToCart = useCallback((bundle: ProjectBundle) => {
    bundle.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        addToCart(product, item.quantity);
      }
    });
    setActiveTab('cart');
  }, [addToCart, products]);

  const handleCheckout = useCallback(() => {
     if (cart.length === 0) return;
     
     const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
     const newOrder: Order = {
       id: `ORD-${Date.now().toString().slice(-6)}`,
       items: [...cart],
       total: total,
       status: OrderStatus.PLACED,
       driverName: "Vikram Kumar",
       vehicleNumber: "MH-02-DN-4321",
       eta: 8,
       placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
       progress: 0
     };
     
     setActiveOrder(newOrder);
     setCart([]);
     setActiveTab('tracking');
  }, [cart]);

  const handleAddReview = useCallback((productId: string, review: Omit<Review, 'id' | 'date'>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newReview: Review = {
          ...review,
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0]
        };
        const updatedReviews = [newReview, ...p.reviews];
        const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        
        const updatedProduct = {
          ...p,
          reviews: updatedReviews,
          rating: Number(avgRating.toFixed(1))
        };
        
        // Update selected product if it's currently open
        if (selectedProduct?.id === productId) {
            setSelectedProduct(updatedProduct);
        }
        
        return updatedProduct;
      }
      return p;
    }));
  }, [selectedProduct]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === Category.ALL || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pb-20 bg-gray-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-200 font-sans">
      
      {/* Header */}
      {!isSearchActive && activeTab !== 'tracking' && (
        <div className="bg-white text-gray-900 px-4 pt-4 pb-2 sticky top-0 z-20 shadow-sm border-b border-gray-100">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-1 text-construction-black font-extrabold text-2xl tracking-tight">
                <span className="text-construction-yellow">Build</span>ItFast
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5 cursor-pointer hover:text-construction-black transition-colors">
                <span className="font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <ClockIcon /> 8 mins
                </span>
                <span>to</span>
                <span className="flex items-center gap-1 truncate max-w-[140px] font-medium">
                  {locationName} <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
              </div>
            </div>
            <div className="bg-gray-900 p-2.5 rounded-xl relative cursor-pointer text-white hover:bg-gray-800 transition-colors" onClick={() => setActiveTab('cart')}>
               <ShoppingCartIcon />
               {cartItemCount > 0 && (
                 <span className="absolute -top-1.5 -right-1.5 bg-construction-yellow text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce-slow border-2 border-white">
                   {cartItemCount}
                 </span>
               )}
            </div>
          </div>

          {/* Search Trigger */}
          <div className="relative" onClick={() => setIsSearchActive(true)}>
            <div className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 text-gray-500 text-sm flex items-center">
               Search "cement" or "hammer"
            </div>
            <div className="absolute left-3 top-3 text-gray-400">
              <SearchIcon />
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchActive && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom-5 duration-200">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
             <div className="relative flex-1">
               <input
                 autoFocus
                 type="text"
                 placeholder='Search products...'
                 className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-construction-yellow"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
               <div className="absolute left-3 top-3 text-gray-400"><SearchIcon /></div>
             </div>
             <button onClick={() => { setIsSearchActive(false); setSearchQuery(''); }} className="text-gray-500 p-2">
               <CloseIcon />
             </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
             {searchQuery === '' ? (
               <div>
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Trending Categories</h3>
                 <div className="flex flex-wrap gap-2">
                   {CATEGORIES.slice(1).map(c => (
                     <button key={c} onClick={() => { setSearchQuery(c); }} className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-700">
                       {c}
                     </button>
                   ))}
                   <button onClick={() => { setSearchQuery('cement'); }} className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-700 flex items-center gap-1">
                     🔥 Cement
                   </button>
                 </div>
               </div>
             ) : (
               <div className="grid grid-cols-1 gap-2">
                 {filteredProducts.map(p => (
                   <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => { setIsSearchActive(false); setSelectedProduct(p); }}>
                      <img src={p.image} className="w-10 h-10 rounded object-cover" alt={p.name} />
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-500">₹{p.price}</div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                        className="text-construction-yellow text-xs font-bold uppercase"
                      >
                        Add +
                      </button>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        {activeTab === 'home' && (
          <HomeView 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory}
            products={filteredProducts}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            onProductClick={setSelectedProduct}
          />
        )}
        {activeTab === 'ai' && (
          <AIAssistantView 
            addToCart={addToCart}
            addBundleToCart={addBundleToCart}
            cart={cart}
            products={products}
          />
        )}
        {activeTab === 'cart' && (
          <CartView 
            cart={cart} 
            addToCart={addToCart} 
            removeFromCart={removeFromCart}
            setActiveTab={setActiveTab}
            onCheckout={handleCheckout}
          />
        )}
        {activeTab === 'tracking' && activeOrder && (
          <TrackingView 
            order={activeOrder}
            setActiveTab={setActiveTab}
          />
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          addToCart={addToCart}
          cart={cart}
          removeFromCart={removeFromCart}
          onAddReview={handleAddReview}
        />
      )}

      {/* Bottom Navigation */}
      {activeTab !== 'tracking' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-6 flex justify-between items-center z-30 max-w-md mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-colors duration-200 ${activeTab === 'home' ? 'text-gray-900 font-bold' : 'text-gray-400'}`}
          >
            <HomeIcon />
            <span className="text-[10px]">Home</span>
          </button>
          
          <div className="relative -top-6">
              <button 
                onClick={() => setActiveTab('ai')}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-4 border-gray-50 transition-all transform active:scale-95 ${activeTab === 'ai' ? 'bg-black text-construction-yellow' : 'bg-construction-yellow text-black'}`}
              >
                <SparklesIcon />
              </button>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[10px] font-bold text-gray-500 whitespace-nowrap">Engineer AI</div>
          </div>

          <button 
            onClick={() => setActiveTab('cart')}
            className={`flex flex-col items-center gap-1 transition-colors duration-200 ${activeTab === 'cart' ? 'text-gray-900 font-bold' : 'text-gray-400'}`}
          >
            <ShoppingCartIcon />
            <span className="text-[10px]">Cart</span>
          </button>
        </div>
      )}

      {/* Floating Cart Summary for Home View */}
      {activeTab === 'home' && cartItemCount > 0 && !selectedProduct && (
        <div className="fixed bottom-24 left-4 right-4 z-20 max-w-[416px] mx-auto">
          <div className="bg-gray-900 text-white p-3.5 rounded-xl shadow-2xl flex justify-between items-center cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-300 ring-2 ring-white/20" onClick={() => setActiveTab('cart')}>
             <div className="flex flex-col">
               <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{cartItemCount} items</span>
               <span className="font-bold text-lg leading-none">₹{cartTotal}</span>
             </div>
             <div className="flex items-center gap-2 font-bold text-sm text-construction-yellow">
               View Cart <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
             </div>
          </div>
        </div>
      )}

      {/* Floating Order Status when not on tracking tab but order is active */}
      {activeOrder && activeTab !== 'tracking' && activeOrder.status !== OrderStatus.ARRIVED && (
        <div className="fixed top-20 right-4 z-30">
           <button 
             onClick={() => setActiveTab('tracking')}
             className="bg-black text-construction-yellow text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce-slow"
           >
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             Track Order ({activeOrder.eta}m)
           </button>
        </div>
      )}

    </div>
  );
}