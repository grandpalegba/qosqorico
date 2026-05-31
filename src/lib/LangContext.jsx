import { createContext, useContext, useState } from "react";


const LangContext = createContext({ lang: "es", setLang: () => {} });


export function LangProvider({ children }) {
const [lang, setLang] = useState(() => localStorage.getItem("lang") ||
"es");
const changeLang = (l) => { setLang(l); localStorage.setItem("lang", l); };
return <LangContext.Provider value={{ lang, setLang: changeLang
}}>{children}</LangContext.Provider>;
}


export function useLang() {
return useContext(LangContext);
}


export const T = {
es: {
    discover: "Descubre Cusco",
    discoverSub: "Servicios premium curados por los mejores locales de la ciudad imperial.",
    login: "Ingresar",
    register: "Registrarse",
    back: "Volver",
    protagonists: "Conoce a los protagonistas",
    soon: "Los protagonistas de esta serie serán revelados pronto.",
    services: "Servicios",
    bookView: "Ver Servicios y Reservar",
    book: "Reservar",
    episodes: "Episodios",
    servicesPanel: "Servicios & Productos",
    synopsis: "Sinopsis",
    synopsisLong: "Historia completa",
    keywords: "Palabras clave",
    payment: "Pago seguro",
    payCard: "Tarjeta bancaria",
    payYape: "Yape",
    payWith: "Pagar con",
    cardNumber: "Número de tarjeta",
    cardName: "Nombre en la tarjeta",
    expiry: "Vencimiento",

     cvv: "CVV",
     confirmPay: "Confirmar pago",
     yapePhone: "Número de teléfono Yape",
     yapeConfirm: "Pagar con Yape",
     totalToPay: "Total a pagar",
     service: "Servicio",
     provider: "Proveedor",
},
en: {
     discover: "Discover Cusco",
     discoverSub: "Premium services curated by the best locals of the imperial city.",
     login: "Log In",
     register: "Sign Up",
     back: "Back",
     protagonists: "Meet the protagonists",
     soon: "The protagonists of this series will be revealed soon.",
     services: "Services",
     bookView: "View Services & Book",
     book: "Book",
     episodes: "Episodes",
     servicesPanel: "Services & Products",
     synopsis: "Synopsis",
     synopsisLong: "Full story",
     keywords: "Keywords",
     payment: "Secure payment",
     payCard: "Bank card",
     payYape: "Yape",
     payWith: "Pay with",
     cardNumber: "Card number",
     cardName: "Cardholder name",
     expiry: "Expiry",
     cvv: "CVV",
     confirmPay: "Confirm payment",
     yapePhone: "Yape phone number",
     yapeConfirm: "Pay with Yape",
     totalToPay: "Total to pay",
     service: "Service",
     provider: "Provider",
},
}
