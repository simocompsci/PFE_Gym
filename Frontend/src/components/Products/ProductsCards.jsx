import React from 'react';

const products = [
    {
        name: 'HydroSync Pro Water Bottle',
        image: 'https://imgs.search.brave.com/twCNCnJmuRsTKJZgtXDXwkHZXOedbeSlPSUBX0MOT7Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTcy/NDEzOTkyL3Bob3Rv/L3NpbHZlci1ib3R0/bGUuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPXhGMXFtbzRm/Vld3MTVGaDJJaklX/NVZuRDlLV0xiUV9o/dkdFaHV4SXRvTU09',
        sizes: ['300 ml', '500 ml', '800 ml', '1 Litre'],
        selectedSize: '800 ml',
        description: 'Stay on top of your daily water intake with this innovative bottle featuring built-in hydration reminders and Bluetooth connectivity.',
        price: 137,
        currency: '$',
    },
    {
        name: 'Smart Fitness Tracker',
        image: 'https://imgs.search.brave.com/YkSA2abH0HeTCEoh25BhXnx3RPD9Eh-MVDhhIJRm2SQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzF2ZE5qc3RKTEwu/anBn',
        sizes: ['S', 'M', 'L'],
        selectedSize: 'M',
        description: 'Track your workouts and health metrics with this stylish and waterproof fitness tracker.',
        price: 89,
        currency: '$',
    },
    {
        name: 'Ergo Yoga Mat',
        image: 'https://imgs.search.brave.com/8JMK0jgUCl15w6deTcpm-ZWVFBNzFGBaV9ZAH8X4jmY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFJZnZOYXkxc0wu/anBn',
        sizes: ['Standard', 'Large'],
        selectedSize: 'Standard',
        description: 'Premium non-slip yoga mat for all your stretching and yoga needs.',
        price: 45,
        currency: '$',
    },
    {
        name: 'Wireless Earbuds',
        image: 'https://imgs.search.brave.com/ozlnyR1eVc8flL5Cd-DWQmmigU9xlY2-FfNn5TqoOuo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZGlnaXRhbHRyZW5k/cy5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMjIvMDEvMS1z/a3VsbGNhbmR5LWlu/ZHktZXZvLXRydWUt/d2lyZWxlc3MtaW4t/ZWFyLWhlYWRwaG9u/ZXMtdHJ1ZS1ibGFj/ay5qcGc_cmVzaXpl/PTEyMDAsNzIwJnA9/MQ',
        sizes: ['White', 'Black'],
        selectedSize: 'Black',
        description: 'Enjoy your music with crystal clear sound and noise cancellation.',
        price: 110,
        currency: '$',
    },
    {
        name: 'Stainless Steel Shaker',
        image: 'https://imgs.search.brave.com/ONdBKCe995MRSalJ_o8wFgXw-IM_4-bHVc8DyHMzEQ4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFYS1BBc1N0Y0wu/anBn',
        sizes: ['500 ml', '700 ml'],
        selectedSize: '700 ml',
        description: 'Mix your protein shakes on the go with this durable shaker bottle.',
        price: 25,
        currency: '$',
    },
    {
        name: 'Resistance Bands Set',
        image: 'https://imgs.search.brave.com/wehOLumcbL5MqUt6loaMtNJnu7gMsQ0HCgETGcjPJkY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFzMS13Zjhzd0wu/anBn',
        sizes: ['Light', 'Medium', 'Heavy'],
        selectedSize: 'Medium',
        description: 'Versatile resistance bands for home and gym workouts.',
        price: 32,
        currency: '$',
    },
    {
        name: 'Foam Roller',
        image: 'https://imgs.search.brave.com/MURxr_-GamvrJvQV6jLPttCtlod4k51LtKEij31l3QI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzE2Lzk0LzE5/LzM2MF9GXzMxNjk0/MTkyOF83cjk3WE1S/VnYzRndCMFhhczZD/TTA3R09QcWxOZmZM/ZC5qcGc',
        sizes: ['Short', 'Long'],
        selectedSize: 'Long',
        description: 'Release muscle tension and improve recovery with this high-density foam roller.',
        price: 28,
        currency: '$',
    },
    {
        name: 'Sports Backpack',
        image: 'https://imgs.search.brave.com/dOplZBJFGej8C1lV-KYbUNUzDlHBnyl6FV2rsMptH30/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFNUFFvTlZVekwu/anBn',
        sizes: ['20L', '30L'],
        selectedSize: '30L',
        description: 'Spacious and stylish backpack for all your gym and travel needs.',
        price: 60,
        currency: '$',
    },
    {
        name: 'Digital Jump Rope',
        image: 'https://imgs.search.brave.com/aDIzvyF7G6iaEd48lVQLdkfyKN25Oz9xrf4mpdgJgBY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFGMGJZZjNET0wu/anBn',
        sizes: ['Standard'],
        selectedSize: 'Standard',
        description: 'Track your jumps and calories burned with this smart jump rope.',
        price: 35,
        currency: '$',
    },
];

const ProductsCards = () => {
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 justify-items-center py-8 px-4">
            {products.map((product, idx) => (
                <div key={idx} className="w-full max-w-[280px] bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
                    {/* Product Image Container */}
                    <div className="relative w-full p-4 bg-gray-50">
                        <div className="relative h-36 overflow-hidden rounded-lg flex items-center justify-center">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-auto transition-transform duration-500 hover:scale-105"
                                style={{ width: '200px', height: '200px' }}
                            />
                        </div>
                    </div>
                    
                    {/* Product Content */}
                    <div className="p-5 flex flex-col flex-grow">
                        {/* Product Name */}
                        <h3 className="font-bold text-sm text-[color:var(--card-foreground)] mb-2 leading-tight line-clamp-2 h-10">
                            {product.name}
                        </h3>
                        
                        {/* Product Description */}
                        <p className="text-[color:var(--muted-foreground)] text-xs mb-3 line-clamp-2 flex-grow">
                            {product.description}
                        </p>
                        
                        {/* Size Options */}
                        <div className="flex flex-wrap gap-1 mb-3">
                            {product.sizes.map((size) => (
                                <span
                                    key={size}
                                    className={`px-2 py-0.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${size === product.selectedSize
                                        ? 'bg-[color:var(--primary)] text-white border-[color:var(--primary)] shadow-sm'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    {size}
                                </span>
                            ))}
                        </div>
                        
                        {/* Price */}
                        <div className="mt-auto pt-3 border-t border-gray-100">
                            <div className="font-bold text-lg text-[color:var(--card-foreground)] tracking-tight">
                                {product.currency}{product.price}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductsCards;
