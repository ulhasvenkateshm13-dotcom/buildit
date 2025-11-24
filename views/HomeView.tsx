import React from 'react';
import { CATEGORIES } from '../constants';
import { Product, CartItem, Category } from '../types';
import { StarIcon, MinusIcon, PlusIcon } from '../components/Icons';

interface HomeViewProps {
    selectedCategory: Category;
    setSelectedCategory: (c: Category) => void;
    products: Product[];
    cart: CartItem[];
    addToCart: (p: Product) => void;
    removeFromCart: (id: string) => void;
    onProductClick: (p: Product) => void;
}

export default function HomeView({ selectedCategory, setSelectedCategory, products, cart, addToCart, removeFromCart, onProductClick }: HomeViewProps) {
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