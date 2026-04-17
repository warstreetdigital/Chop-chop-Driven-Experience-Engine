
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image?: string;
  imageTag?: string;
  isPopular?: boolean;
}

export const MENUS: Record<string, MenuItem[]> = {
  chopchop: [
    { id: 'cc-s1', name: 'Sirloin Steak', price: 18.0, image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=800&auto=format&fit=crop', category: 'Grill / Steak', isPopular: true, description: 'Juicy 300g flame-grilled sirloin steak cooked over open fire with our secret basting.' },
    { id: 'cc-s2', name: 'T-Bone Steak', price: 22.0, image: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?q=80&w=800&auto=format&fit=crop', category: 'Grill / Steak', isPopular: true, description: 'Bold 500g T-bone steak with rich flavor and a perfect char.' },
    { id: 'cc-b1', name: 'Beef Burger', price: 10.0, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop', category: 'Burgers', isPopular: true, description: 'Signature beef burger with melted cheese, lettuce, and our house sauce.' },
    { id: 'cc-b2', name: 'Double Stack Burger', price: 13.0, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800&auto=format&fit=crop', category: 'Burgers', description: 'Double beef patties, double cheese, caramelized onions, full energy.' },
    { id: 'cc-c1', name: 'Peri Peri Chicken', price: 12.0, image: 'https://images.unsplash.com/photo-1626082866628-912df08269d7?q=80&w=800&auto=format&fit=crop', category: 'Chicken', isPopular: true, description: 'Half chicken flame-grilled with our legendary spicy peri peri sauce.' },
    { id: 'cc-c2', name: 'Chicken Wings (8pc)', price: 9.0, image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=800&auto=format&fit=crop', category: 'Chicken', description: 'Crispy wings tossed in your choice of Peri-Peri or BBQ sauce.' },
    { id: 'cc-p1', name: 'BBQ Chicken Pizza', price: 14.0, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop', category: 'Pizza', description: 'Wood-fired pizza topped with BBQ chicken, peppers, and red onion.' },
    { id: 'cc-p2', name: 'Meat Lovers Pizza', price: 16.0, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop', category: 'Pizza', isPopular: true, description: 'Loaded with steak strips, chicken, and beef sausage.' },
    { id: 'cc-pl1', name: 'Mixed Grill Platter', price: 25.0, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop', category: 'Platters', isPopular: true, description: 'The ultimate experience: Sirloin, 1/4 chicken, wors, and two sides.' },
    { id: 'cc-d1', name: 'Classic Mojito', price: 6.0, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop', category: 'Cocktails', isPopular: true, description: 'Fresh mint, zesty lime, sugar, and rum served ice cold.' },
    { id: 'cc-d2', name: 'Strawberry Daiquiri', price: 7.0, image: 'https://images.unsplash.com/photo-1544145945-f904253d0c71?q=80&w=800&auto=format&fit=crop', category: 'Cocktails', description: 'Sweet frozen cocktail with fresh strawberries and light rum.' },
    { id: 'cc-d3', name: 'Whiskey Sour', price: 7.5, image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=800&auto=format&fit=crop', category: 'Cocktails', description: 'Smooth whiskey balanced with lemon juice and simple syrup.' }
  ],
  nyamahouse: [
    { id: 'nh-1', name: 'Kariba Bream', price: 15.0, image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=800&auto=format&fit=crop', category: 'Fish', isPopular: true, description: 'Whole bream from Lake Kariba, deep-fried to perfection.' },
    { id: 'nh-2', name: 'Sadza & Mogodu', price: 8.0, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop', category: 'Traditional', isPopular: true, description: 'Fine ground cornmeal served with cleaned ox-tripe and spinach.' },
    { id: 'nh-3', name: 'Boerewors Roll', price: 6.0, image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?q=80&w=800&auto=format&fit=crop', category: 'Grill', isPopular: true, description: 'Spiced sausage in a fresh roll with caramelized onions and relish.' },
    { id: 'nh-4', name: 'Spare Ribs (400g)', price: 19.0, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop', category: 'Grill', description: 'Slow-cooked pork ribs with a honey-soy glaze.' },
    { id: 'nh-5', name: 'Mazondo (Cow Heels)', price: 9.5, image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=800&auto=format&fit=crop', category: 'Traditional', description: 'Tender cow heels slow-cooked in a rich iron-pot gravy.' },
    { id: 'nh-6', name: 'Maheu (500ml)', price: 2.5, imageTag: 'traditional-maheu', category: 'Drinks', description: 'Traditional non-alcoholic fermented corn beverage.' }
  ]
};

export function getMenuForBrand(brandId: string): MenuItem[] {
  return MENUS[brandId] || MENUS.chopchop;
}
