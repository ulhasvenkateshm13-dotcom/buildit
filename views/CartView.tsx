import React from 'react';
import { CartItem } from '../types';
import { ShoppingCartIcon, MinusIcon, PlusIcon, ClockIcon } from '../components/Icons';

interface CartViewProps {
    cart: CartItem[];
    addToCart: (p: any) => void;
    removeFromCart: (id: string) => void;
    setActiveTab: (tab: any) => void;
    onCheckout: () => void;
}

export default function CartView({ cart, addToCart, removeFromCart, setActiveTab, onCheckout }: CartViewProps) {
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
      
      <button 
        onClick={onCheckout}
        className="w-full bg-black text-white font-bold py-4 rounded-xl shadow-xl shadow-gray-200 hover:bg-gray-800 active:scale-[0.98] transition-all flex justify-between px-6 items-center group"
      >
        <span className="text-lg">₹{finalTotal}</span>
        <span className="flex items-center gap-2 group-hover:gap-3 transition-all">Proceed to Pay <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></span>
      </button>
    </div>
  );
}