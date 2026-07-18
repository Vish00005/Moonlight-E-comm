import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const dummyProducts = [
  { 
    name: 'Minimalist Silver Ring', 
    category: 'Rings', 
    image: 'https://images.unsplash.com/photo-1605100804763-247f661214ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 
    price: 120.00,
    description: 'A beautifully crafted sterling silver ring featuring a sleek, minimalist band. Perfect for everyday wear, it adds a touch of understated elegance to any outfit. Made from 925 sterling silver, ensuring durability and a brilliant shine.',
    countInStock: 10
  },
  { 
    name: 'Delicate Pearl Necklace', 
    category: 'Necklaces', 
    image: 'https://images.unsplash.com/photo-1599643478524-fb66f70a0066?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 
    price: 210.00,
    description: 'This timeless necklace features a single, luminous freshwater pearl suspended on a fine 14k gold-filled chain. An essential classic that seamlessly transitions from day to night. Length: 18 inches.',
    countInStock: 5
  },
  { 
    name: 'Classic Gold Bracelet', 
    category: 'Bracelets', 
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 
    price: 185.00,
    description: 'Our classic gold chain bracelet is designed to be worn alone for a subtle statement or stacked for impact. Plated in 18k gold over brass, offering both luxury and longevity.',
    countInStock: 15
  },
  { 
    name: 'Simple Drop Earrings', 
    category: 'Earrings', 
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 
    price: 95.00,
    description: 'Elegant and lightweight, these drop earrings feature clear cubic zirconia stones catching light beautifully with every movement. Hypoallergenic posts make them comfortable for sensitive ears.',
    countInStock: 20
  },
  { 
    name: 'Vintage Signet Ring', 
    category: 'Rings', 
    image: 'https://images.unsplash.com/photo-1605100804763-247f661214ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 
    price: 140.00,
    description: 'A modern take on a classic vintage signet design. Crafted with brushed gold texture and a smooth, unengraved face. An heirloom-quality piece designed to last.',
    countInStock: 8
  },
  { 
    name: 'Crystal Pendant', 
    category: 'Pendants', 
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 
    price: 175.00,
    description: 'A striking clear quartz crystal pendant wrapped in silver wire, hanging from an adjustable chain. Known for its clarity and aesthetic appeal, this piece is a bold yet refined accessory.',
    countInStock: 12
  },
  { 
    name: 'Timeless Leather Watch', 
    category: 'Watches', 
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 
    price: 320.00,
    description: 'Featuring a minimalist white dial encased in rose gold, paired with a genuine Italian leather strap. Water-resistant up to 30 meters, powered by a precise quartz movement.',
    countInStock: 4
  },
  { 
    name: 'Diamond Studs', 
    category: 'Earrings', 
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', 
    price: 450.00,
    description: 'The ultimate staple. Lab-grown diamonds set in a secure four-prong white gold setting. Subtle, brilliant, and ethically sourced. Total carat weight: 0.5 ct.',
    countInStock: 3
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    await Product.deleteMany(); // Clear existing products
    await Product.insertMany(dummyProducts);
    
    console.log('Products Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
