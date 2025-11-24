import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Product, CartItem, ProjectBundle, ChatMessage } from '../types';
import { PackageIcon, SparklesIcon, SendIcon } from '../components/Icons';

interface AIAssistantViewProps {
    addToCart: (p: Product) => void;
    addBundleToCart: (b: ProjectBundle) => void;
    cart: CartItem[];
    products: Product[];
}

export default function AIAssistantView({ addToCart, addBundleToCart, cart, products }: AIAssistantViewProps) {
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