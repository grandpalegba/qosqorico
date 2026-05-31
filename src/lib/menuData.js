export const MENU_CATEGORIES = [
 {
     id: "starters",
     name: "Entradas",
     subtitle: "Starters",
     items: [
      {
          id: "causa",
          name: "Causa Limeña",
          description: "Layered yellow potato terrine with aji amarillo, avocado, and aji de gallina filling, garnished with micro herbs and huancaina drizzle.",
          price: 18,
          image:
"https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop",
          tags: ["gluten-free", "vegetarian"],
          dietary_options: ["vegan", "gluten-free", "nut-free", "dairy-free"],
          customizations: ["Extra avocado", "No aji amarillo", "Extra huancaina", "Served cold", "Served warm"]
      },
      {
          id: "ceviche",
          name: "Ceviche Clásico",
          description: "Tiger's milk cured sea bass with red onion, aji limo, choclo, cancha, and sweet potato. A Peruvian icon.",
          price: 24,
          image:
"https://images.unsplash.com/photo-1535400255456-984e0a4a3a1b?w=600&h=400&fit=crop",
          tags: ["gluten-free", "seafood"],
          dietary_options: ["gluten-free", "dairy-free", "nut-free"],
          customizations: ["Extra leche de tigre", "Mild heat", "Extra choclo",
"No onion", "Extra aji limo"]
      },
      {
          id: "anticucho",
          name: "Anticuchos de Corazón",

            description: "Grilled beef heart skewers marinated in aji panca and cumin, served with golden corn and rocoto sauce.",
            price: 16,
            image:
"https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop",
            tags: ["gluten-free"],
            dietary_options: ["gluten-free", "dairy-free", "nut-free"],
            customizations: ["Extra rocoto sauce", "Well done", "Medium rare", "No corn", "Double skewer"]
        }
    ]
},
{
    id: "mains",
    name: "Platos Principales",
    subtitle: "Main Courses",
    items: [
        {
            id: "lomo",
            name: "Lomo Saltado",
            description: "Wok-tossed sirloin strips with tomatoes, red onion, soy, and aji amarillo. Served with crispy fries and jasmine rice.",
            price: 38,
            image:
"https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=600&h=400&fit=crop",
            tags: ["popular"],
            dietary_options: ["dairy-free", "nut-free"],
            customizations: ["Extra fries", "Brown rice", "No soy sauce", "Extra vegetables", "Spicy", "Mild"]
        },
        {
            id: "aji-gallina",
            name: "Ají de Gallina",
            description: "Shredded chicken in a velvety aji amarillo cream sauce with walnuts and parmesan, served over white rice with olives and egg.",
            price: 32,
            image:
"https://images.unsplash.com/photo-1574484284002-952d92a03a52?w=600&h=400&fit=crop",

            tags: ["signature"],
            dietary_options: ["gluten-free", "nut-free"],
            customizations: ["No walnuts", "Extra sauce", "No egg", "No olives",
"Brown rice", "Extra cheese"]
        },
        {
            id: "trucha",
            name: "Trucha Andina",
            description: "Pan-seared Andean trout with quinoa pilaf, purple potato puree, and chimichurri de huacatay.",
            price: 42,
            image:
"https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=400&fit=crop",
            tags: ["gluten-free", "chef's pick"],
            dietary_options: ["gluten-free", "dairy-free", "nut-free"],
            customizations: ["No chimichurri", "Extra quinoa", "Rare", "Medium",
"Well done", "Extra potato"]
        },
        {
            id: "alpaca",
            name: "Alpaca al Horno",
            description: "Slow-roasted alpaca loin with Cusco maize polenta, baby beets, and elderberry reduction.",
            price: 52,
            image:
"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
            tags: ["gluten-free", "signature"],
            dietary_options: ["gluten-free", "dairy-free", "nut-free"],
            customizations: ["No beets", "Extra reduction", "Medium rare",
"Medium", "Well done", "Extra polenta"]
        }
    ]
},
{
    id: "desserts",
    name: "Postres",
    subtitle: "Desserts",
    items: [
        {

            id: "picarones",
            name: "Picarones con Miel",
            description: "Sweet potato and squash fritters drizzled with chancaca syrup perfumed with clove and cinnamon.",
            price: 14,
            image:
"https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop",
            tags: ["vegan", "popular"],
            dietary_options: ["vegan", "dairy-free", "nut-free"],
            customizations: ["Extra syrup", "No cinnamon", "Extra crispy", "Served warm", "Powdered sugar"]
        },
        {
            id: "suspiro",
            name: "Suspiro a la Limeña",
            description: "Manjar blanco custard topped with Italian meringue scented with port wine and cinnamon.",
            price: 12,
            image:
"https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=400&fit=crop",
            tags: ["vegetarian"],
            dietary_options: ["gluten-free", "vegetarian", "nut-free"],
            customizations: ["Extra meringue", "No port wine", "Extra caramel",
"Chilled", "Room temperature"]
        }
    ]
},
{
    id: "drinks",
    name: "Bebidas",
    subtitle: "Drinks",
    items: [
        {
            id: "pisco-sour",
            name: "Pisco Sour Clásico",
            description: "Peruvian pisco shaken with fresh lime, egg white, simple syrup, and Angostura bitters. Timeless.",
            price: 16,

             image:
"https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&h=400&fit=crop",
             tags: ["cocktail"],
             dietary_options: ["gluten-free", "dairy-free"],
             customizations: ["Extra pisco", "No egg white (vegan)", "Less sweet",
"More sour", "Blended"]
         },
         {
             id: "chicha-morada",
             name: "Chicha Morada",
             description: "Traditional purple corn drink simmered with pineapple rind, cinnamon, clove, and lime. Chilled.",
             price: 8,
             image:
"https://images.unsplash.com/photo-1526364163958-d28b83db5f70?w=600&h=400&fit=crop",
             tags: ["non-alcoholic", "vegan"],
             dietary_options: ["vegan", "gluten-free", "dairy-free", "nut-free"],
             customizations: ["Less sweet", "Extra lime", "Sparkling", "Over ice",
"Warm"]
         }
     ]
}
];


export const DIETARY_LABELS = {
"vegan": { label: "Vegan", color: "bg-green-100 text-green-800 border-green-200" },
"vegetarian": { label: "Vegetarian", color: "bg-lime-100 text-lime-800 border-lime-200" },
"gluten-free": { label: "Gluten Free", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
"dairy-free": { label: "Dairy Free", color: "bg-blue-100 text-blue-800 border-blue-200" },
"nut-free": { label: "Nut Free", color: "bg-orange-100 text-orange-800 border-orange-200" },
"seafood": { label: "Seafood", color: "bg-cyan-100 text-cyan-800 border-cyan-200" }
}
