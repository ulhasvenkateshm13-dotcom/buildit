import React from 'react';
import { Order, OrderStatus } from '../types';
import { HomeIcon, BikeIcon, CheckCircleIcon, PhoneIcon } from '../components/Icons';

interface TrackingViewProps {
    order: Order;
    setActiveTab: (t: any) => void;
}

export default function TrackingView({ order, setActiveTab }: TrackingViewProps) {
  // Simple check for if we arrived to show confetti or success msg
  const isArrived = order.status === OrderStatus.ARRIVED;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm z-10 flex items-center justify-between">
        <button onClick={() => setActiveTab('home')} className="text-gray-500 hover:text-gray-900">
           <HomeIcon />
        </button>
        <div className="text-center">
           <h2 className="font-bold text-gray-900">Order #{order.id}</h2>
           <p className="text-xs text-gray-500">{order.items.length} items • ₹{order.total}</p>
        </div>
        <div className="w-6"></div> {/* Spacer */}
      </div>

      {/* Map Visualization Area */}
      <div className="h-[40vh] bg-gray-200 relative overflow-hidden w-full">
         {/* Simulated Map Background */}
         <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
            backgroundSize: '40px 40px'
         }}></div>
         
         {/* Path */}
         <div className="absolute top-1/2 left-8 right-8 h-2 bg-white rounded-full shadow-sm -translate-y-1/2">
            <div className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-linear" style={{ width: `${order.progress}%` }}></div>
         </div>

         {/* Store Marker */}
         <div className="absolute top-1/2 left-8 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-4 h-4 bg-gray-800 rounded-full ring-4 ring-white shadow-md"></div>
            <span className="mt-2 text-[10px] font-bold bg-white px-1.5 py-0.5 rounded shadow text-gray-800">Store</span>
         </div>

         {/* Moving Bike Marker */}
         <div 
           className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-1000 ease-linear z-10" 
           style={{ left: `calc(2rem + ((100% - 4rem) * ${order.progress / 100}))` }}
         >
            <div className="bg-construction-yellow p-2 rounded-full shadow-lg border-2 border-white transform -scale-x-100">
               <div className="w-5 h-5 text-black"><BikeIcon /></div>
            </div>
            {/* Tooltip for ETA */}
            {!isArrived && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap">
                 {order.eta} mins
              </div>
            )}
         </div>

         {/* Home Marker */}
         <div className="absolute top-1/2 right-8 -translate-y-1/2 translate-x-1/2 flex flex-col items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full ring-4 ring-white shadow-md animate-pulse"></div>
            <span className="mt-2 text-[10px] font-bold bg-white px-1.5 py-0.5 rounded shadow text-gray-800">Home</span>
         </div>
      </div>

      {/* Status Card */}
      <div className="flex-1 bg-white -mt-6 rounded-t-3xl p-6 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
         <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>

         <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-1">
               {isArrived ? 'Order Delivered!' : `Arriving in ${order.eta} mins`}
            </h1>
            <p className="text-gray-500 text-sm">
               {isArrived ? 'Enjoy your materials!' : 'Your order is on its way to the site.'}
            </p>
         </div>

         {/* Timeline */}
         <div className="space-y-6 pl-4 border-l-2 border-gray-100 ml-4 mb-8">
            <TimelineItem 
              active={true} 
              completed={true} 
              title="Order Placed" 
              time={order.placedAt} 
            />
            <TimelineItem 
              active={order.progress > 30} 
              completed={order.progress > 30} 
              title="Packed at Dark Store" 
              time={order.progress > 30 ? 'Done' : 'Pending'} 
            />
            <TimelineItem 
              active={order.progress > 60} 
              completed={order.progress > 60} 
              title="Out for Delivery" 
              time={order.progress > 60 ? 'Just now' : 'Pending'} 
            />
            <TimelineItem 
              active={order.progress === 100} 
              completed={order.progress === 100} 
              title="Delivered" 
              last={true}
            />
         </div>

         {/* Driver Card */}
         {!isArrived && (
           <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between border border-gray-100">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">👷</div>
                 <div>
                    <div className="font-bold text-gray-900 text-sm">{order.driverName}</div>
                    <div className="text-xs text-gray-500">{order.vehicleNumber}</div>
                 </div>
              </div>
              <button className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-green-600 border border-gray-100 hover:scale-105 transition-transform">
                 <PhoneIcon />
              </button>
           </div>
         )}
         
         {isArrived && (
            <button onClick={() => setActiveTab('home')} className="w-full bg-construction-yellow text-black font-bold py-3 rounded-xl shadow-lg">
               Place New Order
            </button>
         )}
      </div>
    </div>
  );
}

function TimelineItem({ active, completed, title, time, last }: any) {
   return (
      <div className="relative pl-6">
         <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${active ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'} flex items-center justify-center`}>
            {completed && <div className="text-white w-2 h-2"><CheckCircleIcon /></div>}
         </div>
         <div className={`${active ? 'text-gray-900' : 'text-gray-400'}`}>
            <h4 className="font-bold text-sm">{title}</h4>
            {!last && <span className="text-xs text-gray-400">{time}</span>}
         </div>
      </div>
   )
}