import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useLang } from "../lib/LangContext";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


// Fix default leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
 iconRetinaUrl:
"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
 iconUrl:
"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png"
,
 shadowUrl:
"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


const ZONE_COORDS = {
 "Centro Histórico, Cusco": [-13.5183, -71.9785],
 "San Blas, Cusco": [-13.5156, -71.9768],
 "Chinchero, Valle Sagrado": [-13.4059, -72.0556],
 "Pisac, Valle Sagrado": [-13.4167, -71.8458],
 "Ollantaytambo": [-13.2575, -72.2640],
 "Urubamba, Valle Sagrado": [-13.3167, -72.1167],
 "Sacsayhuamán, Cusco": [-13.5086, -71.9817],
};


const ALL_ZONES = Object.keys(ZONE_COORDS);


// Sample providers per zone for display

const ZONE_PROVIDERS = {
"Centro Histórico, Cusco": { series: ["El Ombligo del Mundo", "Guardianes de la Plaza", "Pisco Salvaje"], count: 12 },
"San Blas, Cusco": { series: ["Manos de Barro", "El Mundo en Cusco", "Tinta Inca"], count: 8 },
"Chinchero, Valle Sagrado": { series: ["Las Tejedoras", "Hilos del Inca"],
count: 5 },
"Pisac, Valle Sagrado": { series: ["Frutos de Altura", "Cerámica Sagrada"],
count: 6 },
"Ollantaytambo": { series: ["Muros de Sombra", "Guardianes de la Piedra"],
count: 4 },
"Urubamba, Valle Sagrado": { series: ["Respiro Andino", "Santuarios Verdes"], count: 7 },
"Sacsayhuamán, Cusco": { series: ["Sacerdotes del Ande", "Ecos del Viento"],
count: 3 },
};


export default function ProvidersMap() {
const { lang } = useLang();
const [activeZone, setActiveZone] = useState(null);
const navigate = useNavigate();


const filteredZones = activeZone ? [activeZone] : ALL_ZONES;


return (
     <div className="px-4 md:px-0 mb-10">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            {lang === "es" ? "Proveedores en el mapa" : "Providers on the map"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {lang === "es" ? "Filtra por zona para explorar experiencias cercanas" : "Filter by zone to explore nearby experiences"}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveZone(null)}

              className={`text-xs px-3 py-1 rounded-full border
transition-colors ${!activeZone ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"}`}
          >
              {lang === "es" ? "Todas" : "All"}
          </button>
          {ALL_ZONES.map(z => (
              <button
                  key={z}
                  onClick={() => setActiveZone(activeZone === z ? null : z)}
                  className={`text-xs px-3 py-1 rounded-full border
transition-colors ${activeZone === z ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"}`}
              >
                  {z.split(",")[0]}
              </button>
          ))}
      </div>
    </div>
    <div className="rounded-2xl overflow-hidden border border-border shadow-sm" style={{ height: 360 }}>
      <MapContainer
          center={[-13.4167, -72.0556]}
          zoom={10}
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom={false}
      >
          <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a
href="https://openstreetmap.org">OpenStreetMap</a>'
          />
          {filteredZones.map(zone => {
              const coords = ZONE_COORDS[zone];
              const info = ZONE_PROVIDERS[zone];
              if (!coords) return null;
              return (
                  <Marker key={zone} position={coords}>
                   <Popup>
                     <div className="text-sm min-w-[160px]">
                        <p className="font-bold text-foreground mb-1">{zone}</p>

                      <p className="text-muted-foreground text-xs mb-2">
                        {info?.count} {lang === "es" ? "proveedores" :
"providers"}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {info?.series.slice(0, 2).map(s => (
                             <span key={s} className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                  </Popup>
                 </Marker>
             );
           })}
        </MapContainer>
      </div>
    </div>
 );
}
