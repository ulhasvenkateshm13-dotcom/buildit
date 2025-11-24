import React, { useState } from 'react';
import { Product, CartItem, Review } from '../types';
import { CloseIcon, StarIcon, MinusIcon, PlusIcon } from './Icons';

interface ProductDetailModalProps {
    product: Product;
    onClose: () => void;
    addToCart: (p: Product) => void;
    cart: CartItem[];
    removeFromCart: (id: string) => void;
    onAddReview: (id: string, review: Omit<Review, 'id' | 'date'>) => void;
}

export default function ProductDetailModal({ product, onClose, addToCart, cart, removeFromCart, onAddReview }: ProductDetailModalProps) {
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