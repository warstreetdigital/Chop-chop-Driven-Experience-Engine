import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Receipt, 
  ShoppingBag, 
  Music, 
  Flame, 
  Star, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  Hash,
  Share2
} from 'lucide-react';
import { getBrandFromURL, BrandConfig } from './config/brands';
import { getMenuForBrand, MenuItem } from './config/menus';
import SmartImage from './components/SmartImage';

// --- Types ---

// --- Components ---

const Portal: React.FC<{ BRAND: BrandConfig }> = ({ BRAND }) => {
  const MENU_ITEMS = useMemo(() => getMenuForBrand(BRAND.id), [BRAND.id]);
  const CATEGORIES = useMemo(() => [...new Set(MENU_ITEMS.map(i => i.category))], [MENU_ITEMS]);
  
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<(MenuItem & { quantity: number })[]>([]);
  const [tableNumber, setTableNumber] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const currentPromo = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return { id: 'promo-m', name: "Full Breakfast + Coffee", description: "Start your morning with pure energy.", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop", price: 7.0, category: "Morning Special" };
    if (hour >= 11 && hour < 16) return { id: 'promo-l', name: "Steak + Chips Combo", description: "The perfect midday fuel to keep you going.", image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=800&auto=format&fit=crop", price: 12.5, category: "Lunch Special" };
    return { id: 'promo-d', name: "Grill Platter + Free Drink", description: "Celebrate the end of the day like a king.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop", price: 20.0, category: "Dinner Special" };
  }, []);

  const currentPlaylist = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 11) return BRAND.playlists.morning;
    if (hour < 17) return BRAND.playlists.lunch;
    return BRAND.playlists.dinner;
  }, [BRAND]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setSelectedItem(null);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === itemId) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleOrderSummary = () => {
    if (cart.length === 0) return;
    const itemsStr = cart.map(i => `${i.quantity}x ${i.name} - $${(i.price * i.quantity).toFixed(2)}`).join('\n');
    const message = `Hello ${BRAND.name},\n\nI'd like to place an order from table ${tableNumber || '[X]'}:\n\n${itemsStr}\n\nTotal: $${cartTotal.toFixed(2)}\n\nThank you!`;
    window.open(`https://wa.me/${BRAND.whatsapp.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShareItem = (item: MenuItem) => {
    const message = `Check out this ${item.name} for $${item.price.toFixed(2)} at ${BRAND.name}!\n\n${item.description}\n\nOrder here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleServiceCall = (type: 'waiter' | 'bill') => {
    const message = type === 'waiter' 
      ? `Hi ${BRAND.name}, I need assistance at table ${tableNumber || '[X]'}.`
      : `Hi ${BRAND.name}, please bring the bill to table ${tableNumber || '[X]'}.`;
    window.open(`https://wa.me/${BRAND.whatsapp.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-brand-bg text-brand-text overflow-hidden relative" style={{ backgroundColor: BRAND.backgroundColor, color: BRAND.textColor }}>
      <header className="flex items-center justify-between px-6 py-5 bg-brand-bg/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div>
          <h1 className="font-serif text-2xl font-black tracking-tighter text-glow">{BRAND.name.toUpperCase()}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-[9px] uppercase font-black tracking-[0.2em] opacity-40">Live Kitchen</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Persistent Table Number Indicator */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-2.5 focus-within:border-brand-primary/50 transition-colors">
            <Hash size={14} className="text-brand-primary opacity-60" />
            <span className="text-[10px] uppercase font-black tracking-widest opacity-40 hidden sm:inline">Table</span>
            <input 
              type="number" 
              placeholder="00" 
              value={tableNumber} 
              onChange={e => setTableNumber(e.target.value)} 
              className="bg-transparent w-8 text-xs font-black text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-2xl bg-white/5 border border-white/10" 
          >
            <ShoppingBag size={20} className="text-brand-primary" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-primary text-[10px] font-black flex items-center justify-center border-2 border-brand-bg">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-40 no-scrollbar">
        {/* Promo Section */}
        <section className="px-6 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] uppercase tracking-[0.3em] font-black opacity-40">{currentPromo.category}</h2>
            <div className="px-2 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/20">
              <span className="text-[8px] font-black text-brand-primary uppercase">Limited Time</span>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.01, borderColor: `rgba(${BRAND.primaryColorRGB}, 0.2)` }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedItem(currentPromo as MenuItem)}
            className="relative h-[360px] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl group cursor-pointer"
          >
            <SmartImage 
              src={currentPromo.image} 
              alt={currentPromo.name} 
              className="absolute inset-0 w-full h-full"
              brand={BRAND}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <div className="flex items-center gap-2 mb-3">
                <Flame size={20} className="text-brand-primary" />
                <span className="text-xs font-black uppercase text-brand-primary tracking-widest">Hottest Choice</span>
              </div>
              <h3 className="text-4xl font-serif font-black mb-2">{currentPromo.name}</h3>
              <div className="flex items-center justify-between">
                <p className="text-sm opacity-60 max-w-[200px] line-clamp-2">{currentPromo.description}</p>
                <span className="text-2xl font-black text-brand-primary">${currentPromo.price.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Music Section */}
        <section className="px-6 py-6">
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                <Music size={24} className="text-brand-primary" />
              </div>
              <div>
                <p className="text-[9px] uppercase font-black tracking-widest opacity-40 mb-0.5">Now Playing</p>
                <h4 className="text-sm font-black">{currentPlaylist}</h4>
              </div>
            </div>
            <div className="flex items-end gap-1 h-6">
              {[0.4, 0.8, 0.5, 0.9, 0.3, 0.7, 0.6].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [h * 24, (1-h) * 24, h * 24] }}
                  transition={{ duration: 1 + Math.random(), repeat: Infinity }}
                  className="w-1 rounded-full bg-brand-primary/60"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Popular Choice Horizontal Scroll */}
        <section className="py-4 bg-white/[0.02]">
          <div className="px-6 flex items-center justify-between mb-5">
            <h2 className="text-[11px] uppercase tracking-[0.3em] font-black opacity-40">Popular Choice</h2>
            <Star size={14} className="text-brand-accent animate-pulse" />
          </div>
          <div className="flex gap-5 overflow-x-auto px-6 no-scrollbar">
            {MENU_ITEMS.filter(i => i.isPopular).map(item => (
              <motion.div
                key={item.id}
                whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedItem(item)}
                className="flex-shrink-0 w-52 bg-white/5 rounded-[24px] overflow-hidden border border-white/10 cursor-pointer transition-colors"
              >
                <SmartImage 
                  src={item.image} 
                  imageTag={item.imageTag} 
                  alt={item.name} 
                  className="w-full h-36"
                  brand={BRAND}
                />
                <div className="p-5 text-center">
                  <h3 className="text-sm font-black mb-1 truncate">{item.name}</h3>
                  <p className="text-xs text-brand-primary font-black">${item.price.toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Full Menu List */}
        <section className="px-6 py-10">
          {CATEGORIES.map(cat => (
            <div key={cat} className="mb-12 last:mb-0">
              <h3 className="font-serif text-2xl font-black mb-6 border-l-4 border-brand-primary pl-4">{cat}</h3>
              <div className="flex flex-col gap-4">
                {MENU_ITEMS.filter(i => i.category === cat).map(item => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                    className="flex gap-4 p-3.5 rounded-3xl bg-white/5 border border-white/5 hover:border-brand-primary/30 transition-all"
                  >
                    {/* CLICKABLE CONTENT ONLY - Requested Fix applied here */}
                    <div 
                      className="flex gap-4 flex-1 min-w-0 cursor-pointer"
                      onClick={() => setSelectedItem(item)}
                    >
                      <SmartImage 
                        src={item.image} 
                        imageTag={item.imageTag} 
                        alt={item.name} 
                        className="w-24 h-24 rounded-2xl flex-shrink-0"
                        brand={BRAND}
                      />
                      <div className="flex flex-col justify-center min-w-0">
                        <h4 className="font-black text-sm mb-1 truncate">{item.name}</h4>
                        <p className="text-xs opacity-50 mb-2 line-clamp-1">{item.description}</p>
                        <p className="text-brand-primary font-black text-sm">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    {/* BUTTONS (NO LONGER BLOCKED) */}
                    <div className="flex flex-col gap-2 justify-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleShareItem(item); }}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-brand-primary hover:border-brand-primary/20 transition-all"
                        title="Share on WhatsApp"
                      >
                        <Share2 size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                        className="relative z-20 w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="px-12 py-16 text-center">
          <div className="w-10 h-[2px] bg-brand-primary/30 mx-auto mb-8" />
          <p className="font-serif italic text-lg opacity-40 leading-relaxed">
            "{BRAND.tagline}. Fire, flavor, and energy in every bite."
          </p>
          <div className="w-10 h-[2px] bg-brand-primary/30 mx-auto mt-8" />
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 p-5 bg-brand-bg/90 backdrop-blur-2xl border-t border-white/5 z-[60]">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleServiceCall('waiter')}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors" 
          >
            <Bell size={20} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCartOpen(true)}
            className="flex-1 flex items-center justify-between px-6 py-4 rounded-2xl bg-brand-primary text-white font-black transition-all" 
            style={{ boxShadow: `0 10px 30px rgba(${BRAND.primaryColorRGB}, 0.3)` }}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag size={18} />
              <span className="text-sm uppercase tracking-widest">{cart.length > 0 ? "Place Order" : "Start Eating"}</span>
            </div>
            {cart.length > 0 && <span className="text-sm">${cartTotal.toFixed(2)}</span>}
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleServiceCall('bill')}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors" 
          >
            <Receipt size={20} />
          </motion.button>
        </div>
      </nav>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-12">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedItem(null)} 
              className="absolute inset-0 backdrop-blur-md" 
              style={{ backgroundColor: `${BRAND.backgroundColor}E6` }} // 90% opacity hex
            />
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }}
              className="relative w-full max-w-md rounded-[40px] overflow-hidden border border-white/10 shadow-3xl" 
              style={{ backgroundColor: BRAND.backgroundColor }}
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white" 
              >
                <X size={20} />
              </button>
              <SmartImage 
                src={selectedItem.image} 
                imageTag={selectedItem.imageTag} 
                alt={selectedItem.name} 
                className="w-full h-64"
                brand={BRAND}
              />
              <div className="p-8">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-3xl font-serif font-black">{selectedItem.name}</h3>
                  <span className="text-2xl font-black text-brand-primary">${selectedItem.price.toFixed(2)}</span>
                </div>
                <p className="text-sm opacity-60 leading-relaxed mb-8">{selectedItem.description}</p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest opacity-40 mb-3">Your Location</label>
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus-within:border-brand-primary/50 transition-colors">
                      <Hash size={18} className="text-brand-primary opacity-60" />
                      <input 
                        type="number" 
                        placeholder="Table No."
                        value={tableNumber} 
                        onChange={e => setTableNumber(e.target.value)} 
                        className="bg-transparent flex-1 text-white font-black focus:outline-none"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => addToCart(selectedItem)}
                    className="w-full py-5 rounded-2xl bg-brand-primary text-white font-black flex items-center justify-center gap-3 text-sm tracking-widest uppercase shadow-xl hover:shadow-brand-primary/20 transition-all" 
                  >
                    <ShoppingBag size={18} />
                    Add to My Order
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 backdrop-blur-xl" 
              style={{ backgroundColor: `${BRAND.backgroundColor}F2` }} // 95% opacity hex
            />
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }}
              className="relative w-full max-w-lg rounded-t-[48px] border-t border-white/10 shadow-3xl p-8 flex flex-col max-h-[90vh]" 
              style={{ backgroundColor: BRAND.backgroundColor }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-serif font-black">Your Order</h3>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-40">{cartCount} items selected</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 opacity-40 hover:opacity-100 transition-opacity">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
                {cart.length === 0 ? (
                  <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
                    <ShoppingBag size={48} />
                    <p className="text-sm font-black uppercase tracking-widest">Your tray is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4 pb-10">
                    {cart.map(item => (
                      <div key={item.id} className="p-5 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <SmartImage 
                            src={item.image} 
                            imageTag={item.imageTag} 
                            alt={item.name} 
                            className="w-14 h-14 rounded-xl flex-shrink-0"
                            brand={BRAND}
                          />
                          <div>
                            <h4 className="text-sm font-black mb-1">{item.name}</h4>
                            <p className="text-xs font-black text-brand-primary">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3 bg-white/5 rounded-xl px-2 py-1">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5"><Minus size={14} /></button>
                            <span className="text-xs font-black min-w-[20px] text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5"><Plus size={14} /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-white/20 hover:text-brand-primary transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="pt-8 border-t border-white/10">
                {/* Table Number Input in Cart */}
                <div className="mb-6">
                  <div className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/10 focus-within:border-brand-primary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                        <Hash size={20} className="text-brand-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black tracking-widest opacity-40">Your Location</p>
                        <p className="text-xs font-black uppercase">Service Table</p>
                      </div>
                    </div>
                    <input 
                      type="number" 
                      placeholder="No." 
                      value={tableNumber} 
                      onChange={e => setTableNumber(e.target.value)} 
                      className="bg-transparent w-16 text-right text-lg font-black text-brand-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-8 px-2">
                  <span className="text-lg opacity-40">Estimated Total</span>
                  <span className="text-3xl font-black text-glow text-brand-primary">${cartTotal.toFixed(2)}</span>
                </div>
                <button 
                  disabled={cart.length === 0}
                  onClick={handleOrderSummary}
                  className="w-full py-5 rounded-2xl bg-brand-primary text-white font-black flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase shadow-2xl disabled:opacity-20 transition-all active:scale-95" 
                >
                  <span>Checkout Order via WhatsApp</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const Landing: React.FC<{ onEnter: () => void; isTransitioning: boolean; BRAND: BrandConfig }> = ({ onEnter, isTransitioning, BRAND }) => {
  return (
    <motion.div
      key="landing"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 1 }}
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-brand-bg"
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BRAND.backgroundImage})` }}
        initial={{ scale: 1.1, filter: 'blur(20px) brightness(0.4)' }}
        animate={{ scale: 1.15, filter: 'blur(0px) brightness(0.4)' }}
        transition={{ duration: 30, repeat: Infinity, repeatType: "reverse" }}
      />
      <div className="absolute inset-0 bg-cinematic mix-blend-screen opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i} 
            className="ember"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              animationDelay: `${Math.random() * 8}s`,
              opacity: 0.2 + Math.random() * 0.4
            }}
          />
        ))}
      </div>
      <div className="relative z-10 flex flex-col items-center text-center px-10 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 flex items-center gap-3"
        >
          <span className="w-1 h-1 rounded-full bg-brand-primary" />
          <p className="text-[10px] uppercase font-black tracking-[0.5em] text-brand-primary">Live from Harare</p>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="font-serif text-8xl md:text-9xl font-black tracking-tighter text-glow text-white mb-6"
        >
          {BRAND.name.toUpperCase()}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="font-serif italic text-2xl md:text-3xl text-white tracking-widest mb-16"
        >
          {BRAND.tagline}
        </motion.p>
        <motion.button
          onClick={onEnter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative py-7 px-20 border border-white/10 rounded-full bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl transition-all"
        >
          {/* Animated Glow Background */}
          <motion.div
            className="absolute inset-0 bg-brand-primary/20 blur-2xl"
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          <span className="relative z-10 text-[11px] font-black uppercase tracking-[0.6em] text-brand-primary text-glow-strong">Come Inside</span>
          <motion.div 
            className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" 
          />
          {isTransitioning && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 10, opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 bg-brand-primary/40 blur-3xl rounded-full"
            />
          )}
        </motion.button>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.5 }}
          className="mt-10 text-[9px] uppercase font-black tracking-[0.4em]"
        >
          The fire is ready • Settle in
        </motion.p>
      </div>
    </motion.div>
  );
}

const Arrival: React.FC<{ BRAND: BrandConfig }> = ({ BRAND }) => {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);
  return (
    <motion.div
      key="arrival"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-brand-bg px-10"
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${BRAND.backgroundImage})` }}
        initial={{ scale: 1.05, filter: 'blur(30px)' }}
        animate={{ scale: 1.1, filter: 'blur(20px)' }}
        transition={{ duration: 10 }}
      />
      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs font-black uppercase tracking-[0.5em] text-brand-primary">{greeting}</p>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1.5 }}
          className="font-serif text-5xl md:text-7xl font-bold leading-tight"
        >
          You’ve Arrived at the Hearth.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 2 }}
          className="font-serif italic text-xl tracking-widest"
        >
          Settle in. Something legendary is cooking.
        </motion.p>
      </div>
      <motion.div
        className="absolute inset-0 opacity-[0.05] bg-white/20 blur-[100px]"
        animate={{ opacity: [0.03, 0.08, 0.03] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
    </motion.div>
  );
}

export default function App() {
  const [phase, setPhase] = useState<'landing' | 'arrival' | 'main'>('landing');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const BRAND = useMemo(() => getBrandFromURL(), []);

  useEffect(() => {
    // Inject dynamic brand colors into document root
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', BRAND.primaryColor);
    root.style.setProperty('--brand-primary-rgb', BRAND.primaryColorRGB);
    root.style.setProperty('--brand-bg', BRAND.backgroundColor);
    root.style.setProperty('--brand-text', BRAND.textColor);
    root.style.setProperty('--brand-accent', BRAND.accentColor);
    
    // Update theme color meta tag
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', BRAND.backgroundColor);
  }, [BRAND]);

  const handleEnter = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setPhase('arrival');
      setIsTransitioning(false);
    }, 1200);
  };
  
  useEffect(() => {
    if (phase === 'arrival') {
      const timer = setTimeout(() => {
        setPhase('main');
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [phase]);
  
  return (
    <div className="h-screen w-full relative">
      <AnimatePresence mode="wait">
        {phase === 'landing' && <Landing onEnter={handleEnter} isTransitioning={isTransitioning} key="l" BRAND={BRAND} />}
        {phase === 'arrival' && <Arrival key="a" BRAND={BRAND} />}
        {phase === 'main' && (
          <motion.div 
            key="m" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1 }}
            className="h-full w-full" 
          >
            <Portal BRAND={BRAND} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
