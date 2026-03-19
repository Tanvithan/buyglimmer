export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  images: string[];
  description?: string;
  sizes?: string[];
  colors?: { name: string; hex: string; image?: string }[];
  specs?: Record<string, string>;
  reviews?: { user: string; rating: number; comment: string; date: string }[];
}

export const PRODUCTS: Product[] = [
  { 
    id: 1, 
    name: 'Cyber-Tech Hoodie', 
    price: 1299, 
    category: 'Clothing', 
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
      'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800'
    ],
    colors: [
      { name: 'Obsidian Black', hex: '#0a0a0a' },
      { name: 'Gunmetal Grey', hex: '#3d3d3d' },
      { name: 'Midnight Blue', hex: '#1a2744' },
      { name: 'Forest Green', hex: '#1a3d2e' }
    ],
    description: 'A futuristic hoodie designed for the urban landscape. Features premium cotton blend and a comfortable, relaxed fit with tactical pocketing.',
    sizes: ['S', 'M', 'L', 'XL'],
    specs: {
      'Material': '80% Organic Cotton, 20% Tech-Poly',
      'Fit': 'Oversized / Boxy',
      'Weight': '450 GSM Heavyweight',
      'Details': 'High-density Screenprint, Rubberized Aglets'
    }
  },
  { 
    id: 2, 
    name: 'Urban Joggers Pro', 
    price: 999, 
    category: 'Clothing', 
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705a1f5f13?w=800',
      'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800',
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800'
    ],
    colors: [
      { name: 'Stealth Black', hex: '#1a1a1a' },
      { name: 'Charcoal', hex: '#36454f' },
      { name: 'Olive Drab', hex: '#3d4a3d' },
      { name: 'Desert Sand', hex: '#a89f91' }
    ],
    description: 'Technical joggers with multiple pockets and a tethered fit. Ideal for both training and street style.',
    sizes: ['S', 'M', 'L'],
    specs: {
      'Material': 'Water-resistant Ripstop Nylon',
      'Finish': 'Matte Stealth Black',
      'Pockets': '6 Tactical Compartments',
      'Hardware': 'YKK Weather-sealed Zippers'
    }
  },
  { 
    id: 3, 
    name: 'Neon Runner Sneakers', 
    price: 1999, 
    category: 'Clothing', 
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800'
    ],
    description: 'High-performance sneakers with neon accents. Lightweight construction and superior cushioning.',
    sizes: ['UK 8', 'UK 9', 'UK 10'],
    specs: {
      'Upper': 'Breathable Engineered Mesh',
      'Midsole': 'Reactive Foam Core',
      'Outsole': 'High-traction Carbon Rubber',
      'Drop': '8mm'
    }
  },
  { 
    id: 4, 
    name: 'Classic Tee Essential', 
    price: 499, 
    category: 'Clothing', 
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800'
    ],
    colors: [
      { name: 'Pure White', hex: '#ffffff' },
      { name: 'Jet Black', hex: '#0a0a0a' },
      { name: 'Heather Grey', hex: '#9ca3af' },
      { name: 'Navy', hex: '#1e3a5f' },
      { name: 'Burgundy', hex: '#722f37' }
    ],
    description: 'Everyday crew neck t-shirt made from ultra-soft combed cotton. The perfect foundation for any outfit.',
    sizes: ['S', 'M', 'L', 'XL'],
    specs: {
      'Material': '100% Combed Cotton',
      'Fit': 'Regular Fit',
      'Weight': '180 GSM Light',
      'Neckline': 'Ribbed Crew Neck'
    }
  },
  { 
    id: 5, 
    name: 'Tech Jacket v2', 
    price: 1999, 
    category: 'Clothing', 
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800'
    ],
    colors: [
      { name: 'Stealth Black', hex: '#0f0f0f' },
      { name: 'Ghost White', hex: '#f8f8f8' },
      { name: 'Tactical Green', hex: '#2d4a3e' }
    ],
    description: 'High-performance outer shell designed for extreme conditions. Fully waterproof and wind-resistant.',
    sizes: ['M', 'L', 'XL'],
    specs: {
      'Membrane': '3-Layer eVent Fabric',
      'Rating': '20k Waterproof / 30k Breathability',
      'Seams': 'Fully Taped Construction',
      'Hardware': 'Aquaguard Zippers'
    }
  },
  { 
    id: 6, 
    name: 'Flex Training Shorts', 
    price: 699, 
    category: 'Clothing', 
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800'
    ],
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Navy', hex: '#1e3a5f' },
      { name: 'Grey', hex: '#6b7280' }
    ],
    description: 'Lightweight shorts with 4-way stretch fabric. Built-in liner and anti-odor technology for intense sessions.',
    sizes: ['S', 'M', 'L'],
    specs: {
      'Fabric': 'Recycled Poly-Spandex Blend',
      'Inseam': '7 inch Coverage',
      'Liner': 'Breathable Compression Liner',
      'Storage': 'Hidden Key/Phone Pockets'
    }
  },
  { 
    id: 7, 
    name: 'Oversized Hoodie', 
    price: 1499, 
    category: 'Clothing', 
    images: [
      'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800',
      'https://images.unsplash.com/photo-1556316384-12c35d3091ef?w=800'
    ],
    colors: [
      { name: 'Cream', hex: '#f5f5dc' },
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Grey', hex: '#808080' },
      { name: 'Dusty Rose', hex: '#d4a5a5' }
    ],
    description: 'Ultra-heavyweight hoodie with a dropped shoulder silhouette. Lined hood and warm fleece interior.',
    sizes: ['M', 'L', 'XL', 'XXL'],
    specs: {
      'Material': '100% French Terry Cotton',
      'Fit': 'Extreme Oversize',
      'Weight': '500 GSM Ultra-Heavy',
      'Hem': 'Double-stitched Reinforced'
    }
  },
  { 
    id: 8, 
    name: 'Cargo Tech Pants', 
    price: 1799, 
    category: 'Clothing', 
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
      'https://images.unsplash.com/photo-1624285114131-41221124618e?w=800'
    ],
    description: 'Functional cargo pants designed for utility. Articulated knees for full range of motion.',
    sizes: ['S', 'M', 'L'],
    specs: {
      'Material': 'Stretch Twill Canvas',
      'Cuffs': 'Adjustable Velcro Straps',
      'Pockets': '8 Multi-functional Slots',
      'Belt': 'Included Quick-release Webbing'
    }
  },
  { 
    id: 9, 
    name: 'Premium Smart Watch', 
    price: 1999, 
    category: 'Accessories', 
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1508685096489-77a46807e013?w=800',
      'https://images.unsplash.com/photo-1544117518-30dd5ff7a4b0?w=800'
    ],
    description: 'Advanced wearable technology encased in surgical-grade stainless steel. Sapphire crystal display.',
    specs: {
      'Display': '1.5 inch Always-on AMOLED',
      'Case': 'Grade 5 Titanium / Ceramic',
      'Battery': 'Up to 14 Days Life',
      'Waterproof': '10 ATM (100m) Rated'
    }
  },
  { 
    id: 10, 
    name: 'Designer Sunglasses', 
    price: 1299, 
    category: 'Accessories', 
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
      'https://images.unsplash.com/photo-1511499767350-a1590fdb7318?w=800',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800'
    ],
    description: 'Handcrafted acetate frames with polarized ZEISS lenses. 100% UVA/UVB protection.',
    specs: {
      'Frame': 'Handmade Japanese Acetate',
      'Lens': 'Polarized CR-39 Lenses',
      'Hinges': 'Custom 5-Barrel Design',
      'Coating': 'Anti-Reflective / Scratch'
    }
  },
  { 
    id: 11, 
    name: 'Wireless Earbuds Pro', 
    price: 1999, 
    category: 'Accessories', 
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
      'https://images.unsplash.com/photo-1588156979435-379b9d802b0a?w=800',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800'
    ],
    description: 'Industry-leading Active Noise Cancellation with spatial audio tracking. High-fidelity dynamic drivers.',
    specs: {
      'Audio': 'Hi-Res Certified LDAC Support',
      'ANC': 'Up to 45dB Reduction',
      'Mics': '6 Beamforming Microphones',
      'Charging': 'Wireless / Type-C Fast Load'
    }
  },
  { 
    id: 12, 
    name: 'Classic Leather Belt', 
    price: 599, 
    category: 'Accessories', 
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800',
      'https://images.unsplash.com/photo-1614165939092-aa4912953282?w=800',
      'https://images.unsplash.com/photo-1554992353-8d0840b377b2?w=800'
    ],
    description: 'Full-grain vegetable-tanned leather that develops a beautiful patina over time. Solid brass hardware.',
    specs: {
      'Leather': 'Full-grain Italian Hide',
      'Buckle': 'Milled Solid Brass',
      'Width': '35mm / 1.38 inch',
      'Finish': 'Hand-burnished Edges'
    }
  },
  { 
    id: 13, 
    name: 'Gold Plated Necklace', 
    price: 1899, 
    category: 'Jewelry', 
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      'https://images.unsplash.com/photo-1611085583191-a3b1a30a8a3a?w=800'
    ],
    description: '18K Gold plated chain with a minimalist geometric pendant. Tarnish-free and hypoallergenic.',
    specs: {
      'Base': '316L Surgical Stainless Steel',
      'Plating': '5x PVD 18K Gold Dip',
      'Length': '22 inch / Adjustable',
      'Clasp': 'Heavy-duty Lobster Lock'
    }
  },
  { 
    id: 14, 
    name: 'Diamond Stud Earrings', 
    price: 1499, 
    category: 'Jewelry', 
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
      'https://images.unsplash.com/photo-1588444837495-c6cfaf50c8a9?w=800',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800'
    ],
    description: 'Lab-grown VVS diamonds set in solid 14K white gold. Brilliant round cut with maximum sparkle.',
    specs: {
      'Stone': '0.5 CT Total Lab Diamond',
      'Clarity': 'VVS+ Collection Grade',
      'Metal': '14K Solid White Gold',
      'Setting': 'Four-Prong Secure Fit'
    }
  },
  { 
    id: 15, 
    name: 'Silver Bracelet', 
    price: 999, 
    category: 'Jewelry', 
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800'
    ],
    description: 'Malleable .925 sterling silver cuff. Brushed finish with custom etched serial number on interior.',
    specs: {
      'Metal': '.925 Sterling Silver',
      'Finish': 'Matte Brushed / Oxidized',
      'Origin': 'Hand-cast in Mumbai Hub',
      'Sizing': 'Universal Adjustable Cuff'
    }
  },
  { 
    id: 16, 
    name: 'Minimalist Ring', 
    price: 1499, 
    category: 'Jewelry', 
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
      'https://images.unsplash.com/photo-1599459183200-59c2661c0500?w=800',
      'https://images.unsplash.com/photo-1598560942065-27a92263435c?w=800'
    ],
    description: 'A singular band of brushed titanium. Lightweight, indestructible, and eternally stylish.',
    sizes: ['7', '8', '9', '10', '11'],
    specs: {
      'Material': 'Aero-grade Titanium',
      'Profile': '4mm Comfort Fit',
      'Weight': 'Under 2 Grams',
      'Engraving': 'Signature SABBPE Hallmark'
    }
  },
  { 
    id: 17, 
    name: 'Denim Jacket Classic', 
    price: 1799, 
    category: 'Clothing', 
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800',
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800',
      'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800'
    ],
    description: 'Raw indigo selvage denim. Tailored fit with branded shank buttons and reinforced seams.',
    sizes: ['M', 'L', 'XL'],
    specs: {
      'Denim': '14oz Raw Japanese Selvage',
      'Buttons': 'Embossed Metal Shanks',
      'Pockets': '4 Exterior / 2 Hidden Deep',
      'Fit': 'Slim Authentic Silhouette'
    }
  },
  { 
    id: 18, 
    name: 'Running Track Pants', 
    price: 1199, 
    category: 'Clothing', 
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
      'https://images.unsplash.com/photo-1552066334-9a66248b6c59?w=800',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800'
    ],
    description: 'Lightweight tech-fleece pants with a tapered leg. Reflective accents for night visibility.',
    sizes: ['S', 'M', 'L'],
    specs: {
      'Material': 'Double-knit Tech Fleece',
      'Waist': 'Structured Elastic + Drawcord',
      'Reflectivity': '3M Scotchlite Heat-press',
      'Zippers': 'Invisible Side Storage'
    }
  },
  { 
    id: 19, 
    name: 'Graphic Print Tee', 
    price: 699, 
    category: 'Clothing', 
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800',
      'https://images.unsplash.com/photo-1574180563860-563d30124e23?w=800'
    ],
    description: 'Premium heavyweight tee featuring seasonal vanguard graphics. High-density screenprint quality.',
    sizes: ['S', 'M', 'L', 'XL'],
    specs: {
      'Material': '100% Combed Heavy Cotton',
      'Print': 'Crackle-effect Screenprint',
      'Weight': '240 GSM Heavyweight',
      'Shoulder': 'Reinforced Neck-tap'
    }
  },
  { 
    id: 20, 
    name: 'Canvas Backpack', 
    price: 1599, 
    category: 'Accessories', 
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800',
      'https://images.unsplash.com/photo-1491633589863-6c31745d31b4?w=800'
    ],
    description: 'Weather-resistant waxed canvas with leather trim. Padded compartment for 16-inch terminals.',
    specs: {
      'Capacity': '25 Liters / Expandable',
      'Laptop': 'Padded (Fits 16 inch)',
      'Shell': '18oz Waxed Army Canvas',
      'Hardware': 'Solid Brass / YKK Zippers'
    }
  },
  { 
    id: 21, 
    name: 'Aviator Sunglasses', 
    price: 999, 
    category: 'Accessories', 
    images: [
      'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800',
      'https://images.unsplash.com/photo-1509333303107-16065606a237?w=800',
      'https://images.unsplash.com/photo-1549439602-43ebcb2327af?w=800'
    ],
    description: 'Classic teardrop silhouette with ultra-thin titanium frames. Gradient polarized lenses.',
    specs: {
      'Frame': 'Aerospace Beta-Titanium',
      'Lenses': 'Polarized 1.1mm Glass',
      'Weight': '12 Grams (Ultralight)',
      'UV': '100% Core UVA Protection'
    }
  },
  { 
    id: 22, 
    name: 'Leather Wallet', 
    price: 799, 
    category: 'Accessories', 
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
      'https://images.unsplash.com/photo-1606503153255-59d818c150fc?w=800',
      'https://images.unsplash.com/photo-1555529733-d8207e1496f0?w=800'
    ],
    description: 'Bifold wallet in pebbled calfskin. RFID-blocking technology for digital signals protection.',
    specs: {
      'Material': 'Italian Pebbled Calfskin',
      'Utility': '8 Card Slots / 2 Cash Fold',
      'Protection': '360 RFID Blocking Lining',
      'Lining': 'Smooth Nappa Leather'
    }
  },
  { 
    id: 23, 
    name: 'Chrono Sport Watch', 
    price: 1999, 
    category: 'Accessories', 
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800',
      'https://images.unsplash.com/photo-1549925244-64478832a520?w=800'
    ],
    description: 'Precision chronograph with tachymeter scale. Brushed metal case and reinforced rubber strap.',
    specs: {
      'Movement': 'Swiss Ronda Quartz Chrono',
      'Case': '316L Stainless (42mm)',
      'Glass': 'Anti-Reflective Mineral',
      'Strap': 'High-density FKM Rubber'
    }
  },
  { 
    id: 24, 
    name: 'Bluetooth Speaker', 
    price: 1799, 
    category: 'Accessories', 
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800',
      'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800',
      'https://images.unsplash.com/photo-1545454675-3531b543ba5b?w=800'
    ],
    description: 'Rugged dust and waterproof speaker with 360-degree sonic projection.',
    specs: {
      'Audio': 'Dual 10W Neo-Drivers',
      'Rating': 'IP67 Dust/Waterproof',
      'Battery': '20 Hours Transmission',
      'Range': '30m Wireless Reach'
    }
  },
  { 
    id: 25, 
    name: 'Statement Ring Set', 
    price: 899, 
    category: 'Jewelry', 
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
      'https://images.unsplash.com/photo-1599459183200-59c2661c0500?w=800',
      'https://images.unsplash.com/photo-1588444837495-c6cfaf50c8a9?w=800'
    ],
    description: 'Set of 3 stackable rings in varied finishes: Matte, Polished, and Distressed.',
    specs: {
      'Material': 'Mixed Alloy / Steel Base',
      'Finish': 'Polished, Matte, Oxidized',
      'Width': 'Varying 2mm - 6mm',
      'Set': '3 Pieces Included'
    }
  },
  { 
    id: 26, 
    name: 'Pearl Pendant Necklace', 
    price: 1499, 
    category: 'Jewelry', 
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800',
      'https://images.unsplash.com/photo-1596944229900-125904774838?w=800'
    ],
    description: 'Natural Tahitian pearl on a fine sterling silver chain. Each pearl is unique in shape and luster.',
    specs: {
      'Stone': '8-10mm AAA Tahitian Pearl',
      'Luster': 'High Metallic Finish',
      'Chain': 'Sterling Silver Fine Link',
      'Length': '18 inch / Princess'
    }
  },
  { 
    id: 27, 
    name: 'Hoop Earrings Gold', 
    price: 1199, 
    category: 'Jewelry', 
    images: [
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800',
      'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800',
      'https://images.unsplash.com/photo-1586104185018-634a053c734b?w=800'
    ],
    description: 'Chunky 18K gold vermeil hoops. Lightweight hollow construction for all-day comfort.',
    specs: {
      'Base': '925 Sterling Silver',
      'Plating': '2.5 Micron 18K Gold',
      'Diameter': '30mm Large Profile',
      'Weight': '4g Per Earring'
    }
  },
  { 
    id: 28, 
    name: 'Chain Bracelet Silver', 
    price: 1299, 
    category: 'Jewelry', 
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'
    ],
    description: 'Heavy curb link bracelet in polished surgical steel. Industrial aesthetic with carabiner clasp.',
    specs: {
      'Material': '316L Polished Steel',
      'Type': 'Flat Curb Link (10mm wide)',
      'Clasp': 'Tactical Carabiner Lock',
      'Finish': 'High Mirror Polish'
    }
  },
  { 
    id: 29, 
    name: 'Crossbody Bag', 
    price: 1499, 
    category: 'Accessories', 
    images: [
      'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800',
      'https://images.unsplash.com/photo-1559563458-527698bf5295?w=800',
      'https://images.unsplash.com/photo-1544816153-199d82175e42?w=800'
    ],
    description: 'Minimalist sling bag in smooth top-grain leather. Quick-access magnetic closure.',
    specs: {
      'Shell': 'Premium Top-grain Cowhide',
      'Strap': 'Seatbelt Weave Nylon',
      'Volume': '4.5 Liters Compact',
      'Lock': 'Fidlock Magnetic Slide'
    }
  },
  { 
    id: 30, 
    name: 'Fedora Hat', 
    price: 799, 
    category: 'Accessories', 
    images: [
      'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=800',
      'https://images.unsplash.com/photo-1528653245450-42289c89498a?w=800',
      'https://images.unsplash.com/photo-1517423502376-06447d933c05?w=800'
    ],
    description: 'Wide-brim fedora in structured wool felt. Grosgrain ribbon detail with SABBPE pin.',
    specs: {
      'Material': '100% Australian Wool Felt',
      'Brim': '8cm Structured Edge',
      'Band': 'Cotton Grosgrain Ribbon',
      'Interior': 'Satin Lining + Leather Band'
    }
  },
  { 
    id: 31, 
    name: 'Vanguard Bomber Jacket', 
    price: 1799, 
    category: 'Clothing', 
    images: [
      'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800',
      'https://images.unsplash.com/photo-1548883354-94bcfe3211bb?w=800',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800'
    ],
    description: 'A classic bomber silhouette redesigned for the future. Features a metallic sheen and thermal insulation.',
    sizes: ['S', 'M', 'L', 'XL'],
    specs: {
      'Shell': 'Polished Flight Nylon',
      'Lining': 'Quilted Thermal Satin',
      'Fill': 'Eco-down Insulation',
      'Zippers': 'Dual-way Vanguard Pulls'
    }
  },
  { 
    id: 34, 
    name: 'Signal Messenger Bag', 
    price: 1499, 
    category: 'Accessories', 
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800',
      'https://images.unsplash.com/photo-1509762774605-f07235a08f1f?w=800'
    ],
    description: 'A technical messenger bag with rapid-deployment straps and magnetic Fidlock buckles.',
    specs: {
      'Shell': '500D Cordura Nylon',
      'Hardware': 'Fidlock V-Buckles',
      'Volume': '12 Liters',
      'Lining': 'High-viz Orange Ripstop'
    }
  },
  { 
    id: 35, 
    name: 'Stealth Windbreaker', 
    price: 1699, 
    category: 'Clothing', 
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800'
    ],
    colors: [
      { name: 'Midnight Black', hex: '#1a1a1a' },
      { name: 'Stealth Grey', hex: '#4a4a4a' },
      { name: 'Navy Blue', hex: '#1e3a5f' }
    ],
    description: 'Ultra-light windbreaker with packable technology. Matte black finish with reflective piping.',
    sizes: ['S', 'M', 'L', 'XL'],
    specs: {
      'Fabric': 'DWR Coated Technical Silk',
      'Packability': 'Pocket-integrating Stow',
      'Venting': 'Laser-cut Underarm Ports',
      'Visibility': 'Stealth Reflective Tape'
    }
  },
  { 
    id: 36, 
    name: 'Urban Cargo Pants', 
    price: 1499, 
    category: 'Clothing', 
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
      'https://images.unsplash.com/photo-1624285114131-41221124618e?w=800'
    ],
    colors: [
      { name: 'Khaki', hex: '#c3b091' },
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Olive', hex: '#556b2f' }
    ],
    description: 'Functional cargo pants with multiple utility pockets. Perfect for everyday wear.',
    sizes: ['S', 'M', 'L', 'XL'],
    specs: {
      'Material': 'Cotton Twill',
      'Pockets': '8 Multi-functional',
      'Fit': 'Relaxed Fit',
      'Closure': 'Button & Zipper'
    }
  },
  { 
    id: 37, 
    name: 'Performance Tank Top', 
    price: 599, 
    category: 'Clothing', 
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800',
      'https://images.unsplash.com/photo-1574180563860-563d30124e23?w=800',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'
    ],
    colors: [
      { name: 'White', hex: '#ffffff' },
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Red', hex: '#dc143c' }
    ],
    description: 'Breathable performance tank top for workouts and casual wear.',
    sizes: ['S', 'M', 'L', 'XL'],
    specs: {
      'Material': 'Polyester Blend',
      'Fit': 'Slim Fit',
      'Feature': 'Quick Dry',
      'Neck': 'Round Neck'
    }
  }
];
