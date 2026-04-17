
export interface BrandConfig {
  id: string;
  name: string;
  tagline: string;
  primaryColor: string;
  primaryColorRGB: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  whatsapp: string;
  backgroundImage: string;
  playlists: {
    morning: string;
    lunch: string;
    dinner: string;
  };
}

export const BRANDS: Record<string, BrandConfig> = {
  chopchop: {
    id: 'chopchop',
    name: "Chop Chop",
    tagline: "Where Harare Eats",
    primaryColor: "#FF4E00",
    primaryColorRGB: "255, 78, 0",
    backgroundColor: "#0A0502",
    textColor: "#F8F4F0",
    accentColor: "#D4AF37",
    whatsapp: "+263779388560",
    backgroundImage: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop",
    playlists: {
      morning: "Afro-Chill Morning",
      lunch: "Urban Soul Lunch",
      dinner: "Afrobeats Grill Mix"
    }
  },
  nyamahouse: {
    id: 'nyamahouse',
    name: "Nyama House",
    tagline: "The Soul of the Grill",
    primaryColor: "#FFB800",
    primaryColorRGB: "255, 184, 0",
    backgroundColor: "#0F110A",
    textColor: "#ECF0E1",
    accentColor: "#84A98C",
    whatsapp: "+263771234567",
    backgroundImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop",
    playlists: {
      morning: "Nature Sounds & Acoustic",
      lunch: "Afro-Jazz Selection",
      dinner: "Tribal House Deep Mix"
    }
  }
};

export function getBrandFromURL(): BrandConfig {
  if (typeof window === 'undefined') return BRANDS.chopchop;
  const params = new URLSearchParams(window.location.search);
  const brandId = params.get('brand')?.toLowerCase();
  return (brandId && BRANDS[brandId]) || BRANDS.chopchop;
}
