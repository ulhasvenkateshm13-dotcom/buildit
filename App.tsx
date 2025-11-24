import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { PRODUCTS, CATEGORIES } from './constants';
import { Product, CartItem, Category, ChatMessage, ProjectBundle, Review } from './types';

// Icons
const ShoppingCartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const MinusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const PackageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16.5 9.4-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const StarIcon = ({ filled, half }: { filled: boolean, half?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#FBBF24" : "none"} stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

// --- Components ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'ai' | 'cart'>('home');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.ALL);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [locationName, setLocationName] = useState('Detecting location...');

  // Mock getting location
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocationName('Sector 42, Construction Site B');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const addBundleToCart = (bundle: ProjectBundle) => {
    bundle.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        addToCart(product, item.quantity);
      }
    });
    setActiveTab('cart');
  };

  const handleAddReview = (productId: string, review: Omit<Review, 'id' | 'date'>) => {
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
  };

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
      {!isSearchActive && (
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

    </div>
  );
}

// --- Sub Views ---

function HomeView({ selectedCategory, setSelectedCategory, products, cart, addToCart, removeFromCart, onProductClick }: any) {
  return (
    <div className="p-4 pt-2">
      {/* Promotional Banner */}
      <div className="bg-gradient-to-br from-construction-yellow via-yellow-400 to-yellow-500 rounded-2xl p-5 mb-6 shadow-lg relative overflow-hidden group">
        <div className="relative z-10">
           <div className="bg-white/20 backdrop-blur-md text-black text-[10px] font-black px-2 py-1 rounded inline-block mb-2 uppercase tracking-wide">Limited Time</div>
           <h2 className="text-2xl font-black text-gray-900 leading-none mb-1">Heavy Duty<br/>Power Tools</h2>
           <p className="text-sm font-bold text-gray-800/80 mb-3">Up to 40% OFF</p>
           <button className="bg-black text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-md hover:scale-105 transition-transform">Shop Now</button>
        </div>
        <img src="https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&h=300&fit=crop&crop=edges" className="absolute -right-4 -bottom-4 w-32 h-32 object-cover rounded-lg mix-blend-multiply group-hover:scale-110 transition-transform duration-500" alt="Drill" />
      </div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 mb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
              selectedCategory === cat 
                ? 'bg-gray-900 text-white border-gray-900 shadow-md transform scale-105' 
                : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="flex justify-between items-end mb-4">
         <h3 className="font-bold text-gray-900 text-lg">{selectedCategory === Category.ALL ? 'Popular Items' : selectedCategory}</h3>
         {selectedCategory === Category.ALL && <span className="text-xs text-construction-yellow font-bold cursor-pointer">See All</span>}
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
           <p className="text-gray-400 font-medium">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 pb-24">
          {products.map((p: Product) => {
             const cartItem = cart.find((i: CartItem) => i.id === p.id);
             const qty = cartItem ? cartItem.quantity : 0;
             const discount = p.price > 1000 ? Math.floor(Math.random() * 10 + 10) : 0;
             
             return (
              <div 
                key={p.id} 
                onClick={() => onProductClick(p)}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col relative group cursor-pointer"
              >
                {discount > 0 && (
                  <div className="absolute top-0 left-0 bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded-br-lg z-10">
                    {discount}% OFF
                  </div>
                )}
                {/* Rating Badge */}
                {p.rating > 0 && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm border border-gray-100 z-10">
                        <StarIcon filled={true} />
                        <span className="text-[10px] font-bold text-gray-800">{p.rating}</span>
                        <span className="text-[8px] text-gray-400">({p.reviews.length})</span>
                    </div>
                )}
                <div className="relative h-36 w-full p-2 bg-gray-50">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-xl mix-blend-multiply" />
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{p.unit}</div>
                  <h4 className="font-bold text-gray-800 text-sm leading-tight mb-2 line-clamp-2">{p.name}</h4>
                  <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="font-black text-gray-900 text-sm">₹{p.price}</span>
                      {discount > 0 && <span className="text-[10px] text-gray-400 line-through">₹{Math.round(p.price * (1 + discount/100))}</span>}
                    </div>
                    
                    {qty === 0 ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                        className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-1.5 text-xs font-black uppercase tracking-wide hover:bg-green-600 hover:text-white hover:border-green-600 active:scale-95 transition-all shadow-sm"
                      >
                        ADD
                      </button>
                    ) : (
                      <div className="flex items-center bg-green-600 rounded-lg text-white shadow-md overflow-hidden animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => removeFromCart(p.id)} className="px-2 py-1.5 hover:bg-green-700 active:bg-green-800 h-full flex items-center"><MinusIcon /></button>
                        <span className="text-xs font-bold px-1 min-w-[16px] text-center">{qty}</span>
                        <button onClick={() => addToCart(p)} className="px-2 py-1.5 hover:bg-green-700 active:bg-green-800 h-full flex items-center"><PlusIcon /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
             );
          })}
        </div>
      )}
    </div>
  );
}

function ProductDetailModal({ product, onClose, addToCart, cart, removeFromCart, onAddReview }: any) {
    const cartItem = cart.find((i: CartItem) => i.id === product.id);
    const qty = cartItem ? cartItem.quantity : 0;
    const [reviewFormOpen, setReviewFormOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        onAddReview(product.id, {
            userName: "You", // Mocked user name
            rating,
            comment
        });
        setReviewFormOpen(false);
        setComment('');
        setRating(5);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md h-[90vh] rounded-t-3xl overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-10 duration-300">
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-black/10 hover:bg-black/20 p-2 rounded-full backdrop-blur-md transition-colors">
                    <CloseIcon />
                </button>

                {/* Hero Image */}
                <div className="h-64 bg-gray-50 flex items-center justify-center p-6 relative flex-shrink-0">
                    <img src={product.image} className="w-full h-full object-contain mix-blend-multiply" alt={product.name} />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-white">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{product.category}</span>
                            <h2 className="text-2xl font-black text-gray-900 leading-tight mb-1">{product.name}</h2>
                            <span className="text-sm font-medium text-gray-500">{product.unit}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-gray-900">₹{product.price}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                         <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(star => (
                                <StarIcon key={star} filled={star <= Math.round(product.rating)} />
                            ))}
                         </div>
                         <span className="text-sm font-bold text-gray-700">{product.rating}</span>
                         <span className="text-sm text-gray-400">({product.reviews.length} reviews)</span>
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 mb-2">Product Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-8">{product.description}</p>

                    {/* Reviews Section */}
                    <div className="border-t border-gray-100 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-gray-900">Ratings & Reviews</h3>
                            <button 
                                onClick={() => setReviewFormOpen(true)}
                                className="text-construction-yellow text-sm font-bold underline"
                            >
                                Write a Review
                            </button>
                        </div>

                        {reviewFormOpen && (
                            <form onSubmit={handleSubmitReview} className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
                                <h4 className="font-bold text-sm mb-3">Add Your Review</h4>
                                <div className="flex gap-2 mb-3">
                                    {[1,2,3,4,5].map(star => (
                                        <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none transform transition-transform hover:scale-110">
                                            <StarIcon filled={star <= rating} />
                                        </button>
                                    ))}
                                </div>
                                <textarea 
                                    className="w-full p-3 rounded-lg border border-gray-200 text-sm mb-3 focus:outline-none focus:border-construction-yellow"
                                    rows={3}
                                    placeholder="What did you think about this product?"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                />
                                <div className="flex gap-2">
                                    <button type="submit" className="flex-1 bg-black text-white py-2 rounded-lg text-xs font-bold">Submit Review</button>
                                    <button type="button" onClick={() => setReviewFormOpen(false)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg text-xs font-bold">Cancel</button>
                                </div>
                            </form>
                        )}

                        <div className="space-y-4">
                            {product.reviews.length === 0 ? (
                                <p className="text-gray-400 text-sm italic">No reviews yet. Be the first!</p>
                            ) : (
                                product.reviews.map((r: Review) => (
                                    <div key={r.id} className="bg-gray-50 p-3 rounded-xl">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                                                    {r.userName.charAt(0)}
                                                </div>
                                                <span className="text-xs font-bold text-gray-900">{r.userName}</span>
                                            </div>
                                            <span className="text-[10px] text-gray-400">{r.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1 mb-2">
                                            <div className="flex transform scale-75 origin-left">
                                                {[1,2,3,4,5].map(star => (
                                                    <StarIcon key={star} filled={star <= r.rating} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Sticky Action Bar */}
                <div className="bg-white border-t border-gray-100 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                     {qty === 0 ? (
                         <button 
                            onClick={() => addToCart(product)}
                            className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 active:scale-95 transition-all shadow-lg"
                         >
                            Add to Cart
                         </button>
                     ) : (
                         <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center bg-gray-100 rounded-xl px-2 py-2 flex-1 justify-between">
                                <button onClick={() => removeFromCart(product.id)} className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-gray-800 hover:bg-gray-50 active:scale-95 transition-transform"><MinusIcon /></button>
                                <span className="font-bold text-xl text-gray-900">{qty}</span>
                                <button onClick={() => addToCart(product)} className="w-10 h-10 bg-black text-white rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-800 active:scale-95 transition-transform"><PlusIcon /></button>
                            </div>
                            <div className="flex-1 text-right">
                                <span className="block text-xs text-gray-500 font-medium">Total</span>
                                <span className="block text-xl font-black text-gray-900">₹{product.price * qty}</span>
                            </div>
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
}

function AIAssistantView({ addToCart, addBundleToCart, cart, products }: { addToCart: (p: Product) => void, addBundleToCart: (b: ProjectBundle) => void, cart: CartItem[], products: Product[] }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '0', 
      role: 'model', 
      text: "Hi! I'm your Engineer AI.\n\nTell me what you're building (e.g., \"I need to paint a 10x12 room\" or \"Build a brick wall\"), and I'll create a complete project bundle for you." 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !process.env.API_KEY) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const productContext = products.map(p => ({
         id: p.id,
         name: p.name,
         price: p.price,
         unit: p.unit,
         category: p.category
      }));

      const systemInstruction = `
        You are an expert construction engineer assistant for 'BuildItFast', a quick commerce app.
        Your goal is to help users estimate materials and create "Project Bundles".
        
        CATALOG CONTEXT:
        ${JSON.stringify(productContext)}
        
        RULES:
        1. If the user asks for a project (e.g. "paint a room", "build a wall"), CALCULATE the materials needed.
        2. Create a 'bundle' object containing the relevant items from the catalog.
        3. Be realistic with estimates (e.g. 1 liter paint covers ~100 sq ft).
        4. If a specific product isn't in the catalog, substitute with the closest match or omit.
        5. Return JSON.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            { role: 'user', parts: [{ text: userMsg.text }] }
        ],
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              response: { type: Type.STRING },
              recommendedProductIds: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              bundle: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        productId: { type: Type.STRING },
                        quantity: { type: Type.NUMBER },
                        reason: { type: Type.STRING }
                      }
                    }
                  },
                  totalPriceEstimate: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      });

      const responseJson = JSON.parse(response.text);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseJson.response,
        relatedProductIds: responseJson.recommendedProductIds || [],
        bundle: responseJson.bundle
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: "I'm having trouble calculating that project right now. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-5" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-gray-900 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>
              
              {/* Bundle Rendering - The "Series A" Feature */}
              {msg.role === 'model' && msg.bundle && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3 overflow-hidden">
                  <div className="flex items-center gap-2 mb-2 border-b border-yellow-100 pb-2">
                     <div className="bg-construction-yellow text-black p-1.5 rounded-lg"><PackageIcon /></div>
                     <div>
                       <div className="font-black text-gray-900 text-sm">{msg.bundle.title}</div>
                       <div className="text-[10px] text-gray-600">Project Estimate: ₹{msg.bundle.totalPriceEstimate}</div>
                     </div>
                  </div>
                  <div className="space-y-2 mb-3">
                    {msg.bundle.items.map((item, idx) => {
                       const prod = products.find(p => p.id === item.productId);
                       if(!prod) return null;
                       return (
                         <div key={idx} className="flex justify-between items-center text-xs bg-white p-2 rounded border border-yellow-100">
                           <span className="font-medium text-gray-700">{item.quantity} x {prod.name}</span>
                           <span className="text-gray-400 text-[10px]">{item.reason}</span>
                         </div>
                       )
                    })}
                  </div>
                  <button 
                    onClick={() => addBundleToCart(msg.bundle!)}
                    className="w-full bg-construction-black text-construction-yellow font-bold text-xs py-2.5 rounded-lg hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    ADD BUNDLE TO CART <SparklesIcon />
                  </button>
                </div>
              )}

              {/* Individual Recommended Products */}
              {msg.role === 'model' && msg.relatedProductIds && msg.relatedProductIds.length > 0 && !msg.bundle && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Suggested Items:</p>
                  <div className="space-y-2">
                    {msg.relatedProductIds.map(id => {
                      const product = products.find(p => p.id === id);
                      if (!product) return null;
                      const cartItem = cart.find(c => c.id === id);
                      const qty = cartItem?.quantity || 0;
                      
                      return (
                        <div key={id} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                          <img src={product.image} className="w-10 h-10 rounded object-cover" alt="" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold truncate">{product.name}</div>
                            <div className="text-xs text-gray-600">₹{product.price} / {product.unit}</div>
                          </div>
                          <button 
                             onClick={() => addToCart(product)}
                             className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded hover:bg-green-700 transition-colors"
                          >
                            {qty > 0 ? `+${qty}` : 'ADD'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-4 shadow-sm flex gap-1">
                <span className="w-2 h-2 bg-construction-yellow rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-construction-yellow rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                <span className="w-2 h-2 bg-construction-yellow rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input 
            className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-construction-yellow font-medium"
            placeholder="Describe your project..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="bg-black text-construction-yellow rounded-xl p-3 hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-md"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function CartView({ cart, addToCart, removeFromCart, setActiveTab }: any) {
  const total = cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const deliveryFee = total > 500 ? 0 : 40;
  const platformFee = 5;
  const finalTotal = total + deliveryFee + platformFee;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
        <div className="bg-gray-100 p-8 rounded-full mb-6 animate-pulse">
           <ShoppingCartIcon />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Cart is empty</h3>
        <p className="text-gray-500 mb-8 max-w-xs font-medium">Your next project starts with a single brick (or drill).</p>
        <button 
          onClick={() => setActiveTab('home')}
          className="bg-construction-yellow text-black font-bold py-3.5 px-10 rounded-xl shadow-xl shadow-yellow-200 hover:bg-yellow-400 hover:scale-105 transition-all"
        >
          Start Building
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        Checkout <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-md">{cart.length} items</span>
      </h2>

      <div className="space-y-4 mb-6">
        {cart.map((item: CartItem) => (
          <div key={item.id} className="flex gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-gray-50" />
            <div className="flex-1 flex flex-col justify-between">
               <div>
                 <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.name}</h4>
                 <p className="text-xs text-gray-500 font-medium">{item.unit}</p>
               </div>
               <div className="flex justify-between items-end">
                 <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                 
                 <div className="flex items-center bg-green-600 rounded-lg text-white shadow-sm overflow-hidden h-7">
                    <button onClick={() => removeFromCart(item.id)} className="px-2 hover:bg-green-700 h-full flex items-center"><MinusIcon /></button>
                    <span className="text-xs font-bold px-1 min-w-[16px] text-center">{item.quantity}</span>
                    <button onClick={() => addToCart(item)} className="px-2 hover:bg-green-700 h-full flex items-center"><PlusIcon /></button>
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3 mb-6 shadow-sm">
        <h3 className="font-black text-sm text-gray-900 uppercase tracking-wide">Bill Summary</h3>
        <div className="flex justify-between text-sm text-gray-600 font-medium">
           <span>Item Total</span>
           <span>₹{total}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 font-medium">
           <span className="flex items-center gap-1">Delivery Fee {deliveryFee === 0 && <span className="text-green-700 bg-green-100 text-[10px] px-1 rounded font-bold">FREE</span>}</span>
           <span className={deliveryFee === 0 ? "text-green-600 font-bold" : ""}>₹{deliveryFee}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 font-medium">
           <span>Platform Fee</span>
           <span>₹{platformFee}</span>
        </div>
        <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between font-black text-gray-900 text-lg">
           <span>To Pay</span>
           <span>₹{finalTotal}</span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex gap-3 items-start relative overflow-hidden">
         <div className="mt-0.5 text-blue-600 relative z-10"><ClockIcon /></div>
         <div className="relative z-10">
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-1">Superfast Delivery</p>
            <p className="text-xs text-blue-700 font-medium">Shipment of {cart.length} items from Dark Store A1 arriving in <span className="font-bold">8 minutes</span>.</p>
         </div>
      </div>
      
      <button className="w-full bg-black text-white font-bold py-4 rounded-xl shadow-xl shadow-gray-200 hover:bg-gray-800 active:scale-[0.98] transition-all flex justify-between px-6 items-center group">
        <span className="text-lg">₹{finalTotal}</span>
        <span className="flex items-center gap-2 group-hover:gap-3 transition-all">Proceed to Pay <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></span>
      </button>
    </div>
  );
}