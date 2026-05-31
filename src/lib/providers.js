// Gender-specific portrait pools
const FEMALE_PORTRAITS = [


"https://images.unsplash.com/photo-1531746790095-e16def12e1cd?w=600&h=900&fit=crop&crop=faces",


"https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&h=900&fit=crop&crop=faces",


"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=900&fit=crop&crop=faces",


"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=900&fit=crop&crop=faces",


"https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=600&h=900&fit=crop&crop=faces",


"https://images.unsplash.com/photo-1598520106830-8c45c2035460?w=600&h=900&fit=crop&crop=faces",


"https://images.unsplash.com/photo-1521119989659-a83eee488004?w=600&h=900&fit=crop&crop=faces",

"https://images.unsplash.com/photo-1614289371518-722f2615943d?w=600&h=900&fit=crop&crop=faces",


"https://images.unsplash.com/photo-1557555187-23d685287bc3?w=600&h=900&fit=crop&crop=faces",
];


const MALE_PORTRAITS = [


"https://images.unsplash.com/photo-1622253694242-abeb37a33e97?w=600&h=900&fit=crop&crop=faces",


"https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=900&fit=crop&crop=faces",


"https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=600&h=900&fit=crop&crop=faces",


"https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=600&h=900&fit=crop&crop=faces",


"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=900&fit=crop&crop=faces",


"https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=600&h=900&fit=crop&crop=faces",


"https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&h=900&fit=crop&crop=faces",


"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=900&fit=crop&crop=faces",


"https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=600&h=900&fit=crop&crop=faces",


"https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&h=900&fit=crop&crop=faces",
];

const NAMES = [
{ name: "Lucía", full_name: "Lucía Mamani Quispe", gender: "f" },
{ name: "Andrés", full_name: "Andrés Ccopa Huanca", gender: "m" },
{ name: "Sofía", full_name: "Sofía Rondón Pérez", gender: "f" },
{ name: "Carlos", full_name: "Carlos Apaza Condori", gender: "m" },
{ name: "Elena", full_name: "Elena Vargas Ttito", gender: "f" },
{ name: "Miguel", full_name: "Miguel Huallpa Soto", gender: "m" },
{ name: "Valentina", full_name: "Valentina Cruz Flores", gender: "f" },
{ name: "Diego", full_name: "Diego Puma Ccasa", gender: "m" },
{ name: "Camila", full_name: "Camila Quispe León", gender: "f" },
{ name: "Fernando", full_name: "Fernando Aguilar Meza", gender: "m" },
{ name: "Isabel", full_name: "Isabel Cusihuamán Torres", gender: "f" },
{ name: "Rodrigo", full_name: "Rodrigo Palomino Quiñe", gender: "m" },
{ name: "Pilar", full_name: "Pilar Zamora Huayhua", gender: "f" },
{ name: "Sebastián", full_name: "Sebastián Inca Colque", gender: "m" },
{ name: "Natalia", full_name: "Natalia Ochoa Surco", gender: "f" },
{ name: "Tomás", full_name: "Tomás Bellido Ccori", gender: "m" },
{ name: "Alejandra", full_name: "Alejandra Moreno Cayo", gender: "f" },
{ name: "Javier", full_name: "Javier Zúñiga Mamani", gender: "m" },
{ name: "Renata", full_name: "Renata Pacheco Asto", gender: "f" },
{ name: "Emilio", full_name: "Emilio Soria Huanca", gender: "m" },
];


const SERIES_QUESTIONS = {
// EL CENTRO
"El Ombligo del Mundo": [
     "¿Cuál es la piedra o muro específico que más te conecta con el pasado inca?",
     "Cuéntanos una historia sobre cómo la energía de esta ciudad cambió tu forma de ver el mundo.",
     "Si pudieras retroceder 500 años, ¿qué pregunta le harías a los constructores de este lugar?",
     "¿Cómo explicas a alguien que no conoce Cusco por qué este sitio es el verdadero 'centro'?"
],
"Corazón de Oro": [
     "¿Cuál es el secreto mejor guardado que has escuchado sobre el Coricancha?",
     "¿Alguna vez has sentido una presencia o historia antigua al caminar cerca de estos muros?",

  "¿Qué significa para ti el oro, más allá de su valor material, en el contexto andino?",
  "Cuéntanos una anécdota de cómo la historia de este templo ha influido en tu vida diaria."
],
"Guardianes de la Plaza": [
  "¿Cómo describirías la evolución de la Plaza de Armas a través de los años?",
  "Cuéntanos sobre un personaje emblemático de la plaza que ya no esté, pero que extrañes.",
  "¿Cuál es el momento del día en que la plaza te cuenta su mejor historia?",
  "Si los bancos de la plaza hablaran, ¿qué secreto sobre Cusco revelarían primero?"
],
// CHINCHAYSUYU
"Vivir a 3400m": [
  "¿Cuál fue el día más difícil que tuviste que pasar aclimatándote a la altura?",
  "¿Qué remedio casero o ritual te salvó la vida en tus primeros días aquí?",
  "Describe el momento en que finalmente sentiste que tus pulmones 'se hicieron amigos' de los Andes.",
  "¿Qué consejo le darías a tu 'yo' del pasado que llegó a Cusco sin saber nada de la altura?"
],
"El Mundo en Cusco": [
  "¿Cómo fue la primera vez que decidiste que Cusco sería tu hogar permanente?",
  "¿Qué es lo que más extrañas de tu país de origen y cómo lo has reemplazado aquí?",
  "Cuéntanos una historia sobre cómo una tradición local cambió tu visión del mundo.",
  "¿En qué momento sentiste que finalmente dejaste de ser un extranjero y empezaste a ser un cusqueño?"
],
"El Oro del Valle": [
  "¿Cuál es la historia detrás del primer café que realmente te voló la cabeza?",
  "¿Cómo cambió tu forma de percibir el café después de visitar los valles donde se cultiva?",

  "¿Qué aroma te transporta instantáneamente a los campos de café en los Andes?",
  "Cuéntanos sobre un momento compartido con un caficultor que te enseñó algo sobre la humildad."
],
"Pisco Salvaje": [
  "¿Cuál es la noche más inolvidable que has vivido en un bar oculto de Cusco?",
  "¿Cómo describirías la primera vez que probaste un Pisco Sour perfectamente preparado?",
  "¿Qué historia de amor o desamor ha comenzado con un brindis de Pisco?",
  "Si tu vida fuera un cóctel basado en Pisco, ¿qué ingredientes tendría y por qué?"
],
"Hilos del Inca": [
  "¿Cuál es la prenda de alpaca que guardas como si fuera un tesoro y por qué?",
  "Cuéntanos sobre la primera vez que viste un tejido que te hizo llorar de emoción.",
  "¿Qué historia cuenta el diseño del tejido que llevas puesto hoy?",
  "¿Cómo ha cambiado tu relación con la moda desde que conoces el valor del hilo inca?"
],
"Manos de Barro": [
  "¿Cuál es la pieza de cerámica más especial que has visto crear desde cero?",
  "¿Qué sentiste al tocar el barro crudo por primera vez en San Blas?",
  "Cuéntanos una historia sobre un maestro alfarero que te haya dado una lección de vida.",
  "¿Por qué crees que el barro de Cusco guarda tantas memorias de la civilización?"
],
"Nómadas del Ande": [
  "¿Cuál es la mejor vista que has tenido mientras trabajabas en Cusco?",
  "¿Cómo fue el día en que decidiste dejar la oficina tradicional para trabajar desde las montañas?",
  "¿Qué reto inesperado te dio Cusco mientras intentabas ser productivo?",
  "Cuéntanos cómo el silencio de los Andes ayuda (o dificulta) tu creatividad."
],
"La Vía Rápida": [

  "¿Cuál es la carretera o ruta de Cusco que más respeto te causa?",
  "Cuéntanos una anécdota increíble que ocurrió en un viaje por carretera hacia lo profundo de los Andes.",
  "¿Qué historia te contó un chofer local que cambió tu perspectiva sobre la región?",
  "¿Cuál es el paisaje que siempre te obliga a detener el auto y respirar?"
],
"Refugios Ocultos": [
  "¿Cuál es el rincón más pacífico que has encontrado en una casona antigua?",
  "¿Qué historia fantasmagórica o mágica escuchaste sobre el hotel donde te quedaste?",
  "¿Cómo es despertarse en un lugar donde la arquitectura inca es parte de tu habitación?",
  "Si pudieras vivir en una de estas casas para siempre, ¿cuál elegirías y por qué?"
],
"Herbolaria Nocturna": [
  "¿Cuál es el remedio o infusión más extraña que has probado y que realmente funcionó?",
  "¿Qué historia te contó un vendedor de emolientes que te marcó para siempre?",
  "¿Cómo ha cambiado tu relación con la medicina tradicional desde que vives aquí?",
  "Describe una noche donde una infusión fue la solución a todos tus problemas."
],
// ANTISUYU
"La Vía Wachuma": [
  "¿Cómo describirías el momento exacto en que sentiste la conexión con la naturaleza durante un ritual?",
  "¿Cuál es la enseñanza más valiosa que el San Pedro te ha dejado para tu vida diaria?",
  "¿Qué miedo tuviste antes de tu primera ceremonia y cómo lo superaste?",
  "Cuéntanos una historia sobre cómo esta planta cambió tu forma de ver tu propósito."
],
"Hijos de la Selva": [
  "¿Cómo fue tu primer encuentro real con la selva dentro de los Andes?",
  "¿Qué significa 'sanar' realmente para ti, después de conocer la sabiduría amazónica?",

  "Cuéntanos un sueño o visión que hayas tenido y que te ayudó a tomar una decisión difícil.",
  "¿Qué es lo que más te sorprendió de la humildad de los chamanes de la selva?"
],
"Sacerdotes del Ande": [
  "¿Qué sentiste la primera vez que participaste en una ofrenda a la Pachamama?",
  "¿Cómo fue la lectura de coca que te dejó sin palabras?",
  "¿Qué historia te contó un Altomisayoq que te hizo cuestionar tu realidad?",
  "¿Cómo ha cambiado tu forma de pedir permiso a la tierra antes de hacer algo importante?"
],
"Cuerpos y Energía": [
  "¿Cuál es la sensación física más intensa que has tenido tras un masaje andino?",
  "¿Qué bloqueos emocionales sentiste liberarse durante una terapia de piedras calientes?",
  "Cuéntanos cómo esta experiencia de bienestar cambió tu energía para el resto de tu viaje.",
  "¿Qué te dijo el terapeuta sobre tu cuerpo que nunca habías notado?"
],
"Ecos del Viento": [
  "¿Cuál es el sonido que más te conecta con el espíritu de los Andes?",
  "¿Cómo fue la experiencia de sanación a través del sonido que más te impactó?",
  "¿Qué emoción despertó en ti una flauta de bambú en medio del silencio de la montaña?",
  "Cuéntanos sobre una vez que el sonido te transportó a otro lugar y tiempo."
],
"Respiro Andino": [
  "¿Qué pensamientos cruzaron por tu mente durante tu meditación más profunda en el Valle?",
  "¿Cómo es el silencio en el Valle Sagrado comparado con el silencio de la ciudad?",
  "Cuéntanos una historia de transformación personal que ocurrió en un retiro de yoga.",
  "¿Qué es lo que más has aprendido sobre la paciencia viviendo en la naturaleza?"

],
"La Alquimia del Cacao": [
  "¿Cómo fue la primera vez que probaste un chocolate hecho con cacao real de la selva peruana?",
  "¿Qué sentiste durante una ceremonia de cacao que no puedes explicar con palabras?",
  "Cuéntanos la historia de un maestro chocolatero que te enseñó a apreciar el sabor puro.",
  "¿Qué es lo que más te conecta con el corazón después de una ceremonia de cacao?"
],
"Santuarios Verdes": [
  "¿Qué historia de resiliencia viste en un proyecto de permacultura que te inspiró?",
  "¿Cómo fue la primera vez que comiste algo que tú mismo ayudaste a cultivar?",
  "¿Qué lección de la tierra te ha servido para solucionar un problema en tu vida?",
  "¿Cómo imaginas el futuro de Cusco si todos viviéramos de forma más sostenible?"
],
"El Ave Visionaria": [
  "¿Qué cuadro o pieza de arte te hizo sentir que podías ver más allá de lo físico?",
  "¿Cuál es la historia detrás de la obra de arte más significativa que has encontrado en Cusco?",
  "¿Qué animal o símbolo andino sientes que representa tu personalidad y por qué?",
  "Cuéntanos sobre una vez que el arte te ayudó a entender una parte de ti que ignorabas."
],
// COLLASUYU
"Muros de Sombra": [
  "¿Cuál es el sitio arqueológico menos conocido que te ha dejado más impresionado?",
  "¿Qué teoría o historia loca has escuchado sobre cómo se construyeron estos muros?",
  "Cuéntanos sobre una vez que estuviste solo frente a una ruina y sentiste algo especial.",
  "¿Cómo explicas a alguien que no cree en lo ancestral la magia de estas piedras?"

],
"Las Tejedoras": [
  "¿Qué historia te contó una tejedora mientras trabajaba en su telar?",
  "¿Cuál es el textil que consideras una obra maestra y qué dice su diseño?",
  "¿Qué has aprendido sobre la paciencia viendo cómo se teje un diseño tradicional?",
  "Cuéntanos cómo fue tu experiencia tratando de aprender un punto de tejido."
],
"Cerámica Sagrada": [
  "¿Qué historia te ha contado una pieza de cerámica que compraste en el Valle?",
  "¿Cuál es el taller de cerámica que tiene la energía más auténtica para ti?",
  "¿Qué sentiste al ver la diferencia entre la cerámica industrial y la ancestral?",
  "Cuéntanos cómo el barro te ha enseñado a aceptar las imperfecciones."
],
"Frutos de Altura": [
  "¿Cuál es el alimento andino más sorprendente que has probado en un mercado local?",
  "¿Cómo fue la experiencia de comprar ingredientes en Pisac para cocinar algo nuevo?",
  "Cuéntanos una historia sobre cómo un fruto de altura te salvó el día.",
  "¿Qué es lo que más extrañas del sabor de los productos de Cusco cuando viajas?"
],
"Guardianes de la Piedra": [
  "¿Qué historia de lucha comunitaria te hizo ver la protección de la tierra de otra manera?",
  "¿Qué te dijo un líder local que te hizo cuestionar tu estilo de vida?",
  "¿Cómo ha cambiado tu forma de ver el turismo tras conocer a quienes protegen estos lugares?",
  "Cuéntanos una anécdota donde la comunidad te recibió como si fueras uno más de ellos."
],
"Fuego y Sabor": [
  "¿Cuál es el secreto de la pachamanca que nadie te había dicho antes?",
  "¿Cómo fue tu primera experiencia cocinando con fuego a leña en el campo?",

  "Cuéntanos una historia de una comida familiar que te hizo sentir como en casa en Cusco.",
  "¿Qué ingrediente local es el que nunca falta en tu cocina desde que viniste a Perú?"
],
"La Cuna de la Chicha": [
  "¿Cuál es la anécdota más divertida que te pasó en una chichería tradicional?",
  "¿Qué significado tiene para ti el acto de compartir una chicha con extraños?",
  "¿Cómo fue la primera vez que probaste chicha de jora y qué pensaste?",
  "Cuéntanos una historia sobre cómo una chichería te ayudó a hacer amigos locales."
],
"Jinetes del Salkantay": [
  "¿Cuál es el momento más desafiante que viviste sobre un caballo en las montañas?",
  "¿Qué historia te contaron sobre los antiguos caminos que recorren los jinetes?",
  "¿Qué lección te dio tu caballo durante una expedición difícil?",
  "Cuéntanos cómo es la sensación de llegar a una ruina olvidada después de horas de cabalgata."
],
"La Lengua Madre": [
  "¿Qué palabra en quechua ha cambiado tu forma de ver el mundo?",
  "¿Cómo fue la primera vez que escuchaste a alguien hablar quechua en la calle?",
  "¿Qué historia te contó un hablante nativo sobre el origen de un nombre de lugar?",
  "¿Qué es lo que más te cuesta aprender del quechua y por qué te fascina?"
],
// CUNTISUYU
"Espuma de Altura": [
  "¿Cuál es la cerveza artesanal más creativa que has probado en Cusco?",
  "¿Qué historia hay detrás de la micro-cervecería que más te gusta?",
  "¿Cómo fue la noche en que descubriste que la cerveza andina es un mundo aparte?",
  "¿Qué ingredientes locales le pondrías a una cerveza si fueras un maestro cervecero?"
],
"El Laboratorio": [

  "¿Cuál es el plato de alta cocina que te hizo llorar o emocionarte al probarlo?",
  "¿Qué técnica culinaria te sorprendió más en un restaurante de autor?",
  "Cuéntanos sobre una cena donde la comida te hizo sentir que estabas en el futuro.",
  "¿Qué es lo más arriesgado que has comido por probar una nueva experiencia culinaria?"
],
"Ritmos Híbridos": [
  "¿Cuál es la canción que suena en tu cabeza cuando piensas en la noche cusqueña?",
  "¿Cómo fue la primera vez que bailaste electro-andino hasta el amanecer?",
  "¿Qué historia te contó un DJ local sobre la fusión musical en la ciudad?",
  "¿Qué sientes cuando los instrumentos andinos se mezclan con los beats electrónicos?"
],
"El Escenario Oculto": [
  "¿Cuál es el show más íntimo o privado al que has asistido en Cusco?",
  "¿Qué músico local te hizo sentir que estabas viendo a una estrella mundial?",
  "Cuéntanos la historia de una noche de jazz que terminó de una forma inesperada.",
  "¿Qué es lo que hace que los escenarios subterráneos de Cusco sean tan especiales?"
],
"Tinta Inca": [
  "¿Qué significado tiene el tatuaje que te hiciste en Cusco para ti?",
  "¿Cómo fue el proceso de elegir un diseño andino que representara tu vida?",
  "Cuéntanos una historia sobre el artista que marcó tu piel para siempre.",
  "¿Qué sentiste al ver por primera vez tu diseño terminado?"
],
"Plata y Fuego": [
  "¿Cuál es la joya que compraste en Cusco y qué historia lleva consigo?",
  "¿Qué te dijo el artesano mientras forjaba tu pieza de plata?",
  "Cuéntanos sobre el proceso de diseño de una pieza única que hiciste a medida.",
  "¿Qué significa para ti llevar algo que ha pasado por el fuego y el martillo andino?"
],

"Cielos de Noche": [
     "¿Cuál es el mejor recuerdo que tienes mirando las estrellas desde un rooftop?",
     "¿Qué sentiste al ver Cusco iluminarse bajo la luz de la luna?",
     "Cuéntanos una historia de amor o reflexión que ocurrió en una terraza a gran altura.",
     "¿Por qué crees que el cielo de Cusco se ve diferente a cualquier otro en el mundo?"
],
"Humo y Brasas": [
     "¿Cuál es el anticucho que te hizo volver a la misma esquina tres veces?",
     "¿Qué historia te contó la señora que prepara los picarones más famosos de la calle?",
     "¿Cómo es el ambiente de una noche de brasas cuando el frío de Cusco aprieta?",
     "Cuéntanos la mejor anécdota que hayas tenido comiendo comida callejera después de la fiesta."
],
"Cuerpos en Movimiento": [
     "¿Cómo te hizo sentir ver una obra de teatro o danza inspirada en la altitud?",
     "¿Qué historia de sacrificio te contaron los bailarines sobre su entrenamiento?",
     "¿Qué parte de una performance te hizo sentir la conexión con los Apus?",
     "¿Cómo fue la experiencia de ver el cuerpo humano desafiar la altura en un escenario?"
],
"Mar en los Andes": [
     "¿Cuál es el ceviche más increíble que has probado en Cusco?",
     "¿Qué historia te contó el chef sobre cómo trae el pescado fresco del mar?",
     "¿Cómo fue la experiencia de comer algo tan fresco en un lugar tan lejos del océano?",
     "¿Por qué crees que el ceviche en Cusco sabe diferente al de la costa?"
]
};


const FALLBACK_QUESTIONS = [
"¿Cómo llegaste hasta aquí?",
"¿Cuál es tu secreto mejor guardado en Cusco?",
"¿Qué hace único tu trabajo?",

"¿Qué mensaje dejas al mundo?"
];


const EPISODE_SUBTITLES_ES = ["Episodio 1", "Episodio 2", "Episodio 3",
"Episodio 4"];
const EPISODE_SUBTITLES_EN = ["Episode 1", "Episode 2", "Episode 3", "Episode 4"];
const EPISODE_SUBTITLES = EPISODE_SUBTITLES_ES;


const THUMBNAIL_POOL = [


"https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&h=700&fit=crop",


"https://images.unsplash.com/photo-1580502304784-8985b7eb7260?w=400&h=700&fit=crop",


"https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=700&fit=crop",


"https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=700&fit=crop",


"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=700&fit=crop",


"https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=700&fit=crop",


"https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=700&fit=crop",


"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=700&fit=crop",


"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=700&fit=crop",


"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=700&fit=crop",

"https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=700&fit=crop",


"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=700&fit=crop",
];


const DURATIONS = ["2:48", "3:24", "4:10", "3:55", "5:01", "2:30", "4:35",
"3:15"];
const LOCATIONS = ["Centro Histórico, Cusco", "San Blas, Cusco", "Chinchero, Valle Sagrado", "Pisac, Valle Sagrado", "Ollantaytambo", "Urubamba, Valle Sagrado", "Sacsayhuamán, Cusco"];
const LANGUAGES_POOL = [["Español", "Quechua"], ["Español", "Inglés"],
["Español"], ["Français", "Español"], ["Español", "Quechua", "Inglés"]];
const RATINGS = [4.7, 4.8, 4.9, 4.6, 4.8, 4.9, 4.7];


// Known detailed providers
const KNOWN_PROVIDERS = {
"provider-maria": {
     id: "provider-maria",
     name: "María",
     full_name: "María Quispe Huamán",
     gender: "f",
     series: "Las Tejedoras",
     suyu: "collasuyu",
     tagline: "Maestra del telar de cintura en Chinchero",
     bio: "Nacida en la comunidad de Chinchero, María aprendió el arte del telar a los 7 años de manos de su abuela. Hoy es reconocida como una de las últimas guardianas de los patrones textiles incas originales. Cada hilo que teje cuenta una historia de más de 500 años.",
     poster_url:
"https://images.unsplash.com/photo-1531746790095-e16def12e1cd?w=600&h=900&fit=crop&crop=faces",
     cover_url:
"https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&h=600&fit=crop",
     episodes: [
      { title: "¿Qué historia te contó una tejedora mientras trabajaba en su telar?", subtitle: "Episodio 1 · Origen", description: "María cuenta cómo su abuela le enseñó los secretos del telar ancestral en las montañas de  Chinchero.", thumbnail_url:
"https://images.unsplash.com/photo-1531746790095-e16def12e1cd?w=400&h=700&fit=crop&crop=faces", duration: "3:24" },
     { title: "¿Cuál es el textil que consideras una obra maestra y qué dice su diseño?", subtitle: "Episodio 2 · Revelación", description: "Los patrones ocultos en cada textil que conectan con la cosmovisión andina.",
thumbnail_url:
"https://images.unsplash.com/photo-1489367874814-f5d040621dd8?w=400&h=700&fit=crop", duration: "4:12" },
     { title: "¿Qué has aprendido sobre la paciencia viendo cómo se teje un diseño tradicional?", subtitle: "Episodio 3 · Maestría", description: "La técnica del telar de cintura: un arte que pocos dominan en el mundo moderno.", thumbnail_url:
"https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=700&fit=crop", duration: "5:01" },
     { title: "Cuéntanos cómo fue tu experiencia tratando de aprender un punto de tejido.", subtitle: "Episodio 4 · Legado", description: "Por qué preservar el arte textil inca es una forma de resistencia cultural y amor por la tierra.", thumbnail_url:
"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=700&fit=crop", duration: "2:48" }
  ],
  services: [
     { name: "Clase Magistral de Telar", description: "3 horas de inmersión en el arte del telar de cintura. Aprende a crear tus propios diseños andinos.", price: 40, currency: "USD", duration: "3 horas" },
     { name: "Tour Textil Chinchero", description: "Visita guiada al taller y a la comunidad de tejedoras. Incluye demostración de tintes naturales.",
price: 25, currency: "USD", duration: "2 horas" },
     { name: "Textil Personalizado", description: "Encarga un textil único con diseño y colores a tu medida. Envío internacional disponible.", price:
120, currency: "USD", duration: "1 semana" }
  ],
  location: "Chinchero, Valle Sagrado",
  rating: 4.9,
  languages: ["Quechua", "Español"]
},
"provider-mateo": {
  id: "provider-mateo",
  name: "Mateo",
  full_name: "Dr. Mateo Flores Condori",

  gender: "m",
  series: "Vivir a 3400m",
  suyu: "chinchaysuyu",
  tagline: "Médico de altitud y experto en aclimatación",
  bio: "El Dr. Mateo lleva 15 años atendiendo a viajeros que llegan a Cusco sin preparación para la altura. Su clínica móvil ha salvado incontables vacaciones y vidas. Combina la medicina moderna con remedios ancestrales como el mate de coca.",
  poster_url:
"https://images.unsplash.com/photo-1622253694242-abeb37a33e97?w=600&h=900&fit=crop&crop=faces",
  cover_url:
"https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&h=600&fit=crop",
  episodes: [
    { title: "¿Cuál fue el día más difícil que tuviste que pasar aclimatándote a la altura?", subtitle: "Episodio 1 · Origen", description:
"Mateo explica por qué dejó Lima para dedicarse a la medicina de altitud en Cusco.", thumbnail_url:
"https://images.unsplash.com/photo-1622253694242-abeb37a33e97?w=400&h=700&fit=crop&crop=faces", duration: "2:48" },
    { title: "¿Qué remedio casero o ritual te salvó la vida en tus primeros días aquí?", subtitle: "Episodio 2 · Revelación", description: "Los remedios naturales que realmente funcionan contra el soroche de altura.",
thumbnail_url:
"https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=700&fit=crop", duration: "3:35" },
    { title: "Describe el momento en que sentiste que tus pulmones 'se hicieron amigos' de los Andes.", subtitle: "Episodio 3 · Maestría",
description: "El protocolo de aclimatación perfecto para los primeros 48 horas en Cusco.", thumbnail_url:
"https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=700&fit=crop", duration: "4:20" },
    { title: "¿Qué consejo le darías a tu 'yo' del pasado que llegó a Cusco sin saber nada de la altura?", subtitle: "Episodio 4 · Legado", description:
"Los 10 errores más comunes de los viajeros y cómo evitar el soroche definitivamente.", thumbnail_url:
"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=700&fit=crop", duration: "3:55" }
  ],
  services: [

     { name: "Consulta en Hotel", description: "Visita médica a tu hotel con oxímetro, estetoscopio y oxígeno portátil. Disponible 24/7.", price: 60,
currency: "USD", duration: "45 min" },
     { name: "Kit de Aclimatación", description: "Pack completo: oxígeno medicinal, mate de coca artesanal y guía de adaptación a la altitud.", price:
35, currency: "USD", duration: "Entrega" },
     { name: "Acompañamiento Trek", description: "Médico de acompañamiento para trekkings de altura. Monitoreo constante de saturación y pulso.", price:
200, currency: "USD", duration: "1 día" }
  ],
  location: "Centro Histórico, Cusco",
  rating: 4.8,
  languages: ["Español", "Inglés"]
},
"provider-julien": {
  id: "provider-julien",
  name: "Julien",
  full_name: "Julien Moreau",
  gender: "m",
  series: "El Mundo en Cusco",
  suyu: "chinchaysuyu",
  tagline: "Chef de crêperie francesa en el corazón de Cusco",
  bio: "Julien dejó Lyon hace 8 años con una sartén y un sueño. Hoy su crêperie en San Blas es un punto de encuentro donde la mantequilla francesa se encuentra con el queso cusqueño. Su 'Crêpe Pachamama' con hierbas andinas es legendaria.",
  poster_url:
"https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=900&fit=crop&crop=faces",
  cover_url:
"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=600&fit=crop",
  episodes: [
     { title: "¿Cómo fue la primera vez que decidiste que Cusco sería tu hogar permanente?", subtitle: "Episodio 1 · Origen", description: "Julien cuenta cómo un viaje de mochilero a los 25 años cambió su vida para siempre.", thumbnail_url:
"https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=700&fit=crop&crop=faces", duration: "3:10" },
     { title: "¿Qué es lo que más extrañas de tu país de origen y cómo lo has reemplazado aquí?", subtitle: "Episodio 2 · Revelación", description: "La  fusión perfecta entre la cocina francesa y los ingredientes andinos que nadie esperaba.", thumbnail_url:
"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=700&fit=crop", duration: "4:05" },
      { title: "Cuéntanos una historia sobre cómo una tradición local cambió tu visión del mundo.", subtitle: "Episodio 3 · Maestría", description: "La receta secreta de la Crêpe Pachamama: masa de quinoa, relleno de queso y hierbas de altura.", thumbnail_url:
"https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400&h=700&fit=crop", duration: "3:45" },
      { title: "¿En qué momento sentiste que dejaste de ser un extranjero y empezaste a ser un cusqueño?", subtitle: "Episodio 4 · Legado", description:
"Construir un puente culinario entre Francia y los Andes: el restaurante que Julien sueña para el próximo año.", thumbnail_url:
"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=700&fit=crop", duration: "2:30" }
     ],
     services: [
      { name: "Reserva de Mesa", description: "Mesa para 2 con menú degustación de 5 tiempos. Maridaje de pisco incluido.", price: 45, currency:
"USD", duration: "2 horas" },
      { name: "Clase de Crêpes", description: "Aprende a hacer crêpes con técnica francesa y rellenos andinos. Incluye degustación y recetario.",
price: 55, currency: "USD", duration: "2.5 horas" },
      { name: "Catering Privado", description: "Chef a domicilio para grupos de hasta 12 personas. Menú personalizado según preferencias.", price: 180,
currency: "USD", duration: "4 horas" }
     ],
     location: "San Blas, Cusco",
     rating: 4.7,
     languages: ["Français", "Español", "English"]
}
};


function seededIndex(str, max) {
let hash = 0;
for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i))
% 997;
return Math.abs(hash) % max;
}

function generateProvider(seriesName, suyuId, slot) {
const key = `${seriesName}-${slot}`;
const nameIdx = seededIndex(key + "name", NAMES.length);
const locIdx = seededIndex(key + "loc", LOCATIONS.length);
const langIdx = seededIndex(key + "lang", LANGUAGES_POOL.length);
const ratingIdx = seededIndex(key + "rating", RATINGS.length);
const qSet = 0; // unused — kept for stable key generation
const thumbBase = seededIndex(key + "thumb", THUMBNAIL_POOL.length);


const person = NAMES[nameIdx];
const questions = SERIES_QUESTIONS[seriesName] || FALLBACK_QUESTIONS;


// Gender-appropriate portrait
const pool = person.gender === "f" ? FEMALE_PORTRAITS : MALE_PORTRAITS;
const portraitIdx = seededIndex(key + "portrait", pool.length);
const poster_url = pool[portraitIdx];


return {
  id: `${suyuId}-${seriesName.toLowerCase().replace(/\s+/g, "-")}-${slot}`,
  name: person.name,
  full_name: person.full_name,
  gender: person.gender,
  series: seriesName,
  suyu: suyuId,
  tagline: `Protagonista de ${seriesName}`,
  bio: `${person.name} es una figura clave en la escena de "${seriesName}"
en Cusco. Con años de experiencia y una pasión profunda por su oficio,
comparte su saber con quienes desean una conexión auténtica con la cultura
andina.`,
  poster_url,
  cover_url:
"https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1200&h=600&fit=crop",
  episodes: questions.map((q, i) => ({
    title: q,
    subtitle: EPISODE_SUBTITLES[i],
    description: `${person.name} responde con honestidad y profundidad a
esta pregunta fundamental sobre su vida y su relación con Cusco.`,
    thumbnail_url: THUMBNAIL_POOL[(thumbBase + i) % THUMBNAIL_POOL.length],
    duration: DURATIONS[seededIndex(key + i, DURATIONS.length)]
  })),

    services: [
     {
         name: `Sesión con ${person.name}`,
         description: `Una experiencia personalizada e íntima de 2 horas con
${person.name} en el corazón de Cusco.`,
         price: 35 + seededIndex(key + "price1", 10) * 5,
         currency: "USD",
         duration: "2 horas"
     },
     {
         name: "Taller Intensivo",
         description: `Jornada completa de inmersión. ${person.name} revela
todos sus secretos y técnicas exclusivas.`,
         price: 80 + seededIndex(key + "price2", 12) * 10,
         currency: "USD",
         duration: "1 día"
     }
    ],
    location: LOCATIONS[locIdx],
    rating: RATINGS[ratingIdx],
    languages: LANGUAGES_POOL[langIdx]
};
}


export function getProvidersForSeries(seriesName, suyuId) {
const known = Object.values(KNOWN_PROVIDERS).filter(p => p.series ===
seriesName);
const result = [...known];
for (let slot = result.length; result.length < 4; slot++) {
    result.push(generateProvider(seriesName, suyuId, slot));
}
return result;
}


export function getProviderById(id) {
if (KNOWN_PROVIDERS[id]) return KNOWN_PROVIDERS[id];
// Parse: suyuId-series-slug-slot
const parts = id.split("-");
const slot = parseInt(parts[parts.length - 1]);
const suyuId = parts[0];
// Reconstruct series name from slug (rejoin middle parts)

 const seriesSlug = parts.slice(1, parts.length - 1).join("-");
 // Generate with the same key as was used to create this id
 const reconstructed = seriesSlug.replace(/-/g, " ").replace(/\b\w/g, c =>
c.toUpperCase());
 // Case-insensitive match against known SERIES_QUESTIONS keys
 const seriesName = Object.keys(SERIES_QUESTIONS).find(k => k.toLowerCase()
=== reconstructed.toLowerCase()) || reconstructed;
 return generateProvider(seriesName, suyuId, slot);
}
