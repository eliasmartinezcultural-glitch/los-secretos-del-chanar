/* LOS SECRETOS DEL CHAÑAR — IDENTIDAD TERRITORIAL V21 */
(function () {
    "use strict";

    /* Referencias territoriales documentadas: el ejido combina núcleo urbano en damero,
       catastro rural cuadriculado, RP7 y Río Neuquén, con una fuerte transición ciudad/chacras. */
    window.CHANAR_IDENTITY = {
        place: "San Patricio del Chañar",
        province: "Neuquén",
        landscape: {
            river: "Río Neuquén",
            productiveArea: "chacras y viñedos",
            urbanPattern: "damero",
            mainRoute: "RP 7",
            ruralPattern: "parcelas y caminos rurales"
        },
        visualRules: {
            architecture: ["vivienda baja", "veredas simples", "frentes variados", "galerías", "patios", "alambrados rurales"],
            vegetation: ["álamos", "frutales", "vid", "vegetación de ribera", "suelo árido"],
            streetLife: ["bicicletas", "motos", "camionetas", "peatones", "perros", "herramientas rurales", "compras de barrio"],
            ruralLife: ["acequias", "caminos de chacra", "tractores", "hileras de vid", "cortinas de álamos", "galpones"],
            atmosphere: ["polvo", "viento", "sol fuerte", "atardeceres secos", "sonido de agua", "actividad de cosecha"]
        },
        landmarks: [
            { id: "rio_neuquen", name: "Río Neuquén", kind: "river", importance: 10 },
            { id: "rp7", name: "Ruta Provincial 7", kind: "route", importance: 10 },
            { id: "chacras", name: "Zona de Chacras", kind: "productive", importance: 10 },
            { id: "vineyards", name: "Viñedos", kind: "productive", importance: 9 },
            { id: "irrigation", name: "Canales y drenajes", kind: "water_infrastructure", importance: 9 }
        ],
        streetNames: [
            "Avenida Principal", "Av. Costanera", "Río Limay", "Ruca Choroi", "Calle 4", "Calle 5",
            "Calle Rural 4", "Calle Rural 8", "Calle Rural 9", "Calle Rural 16", "Calle Rural 19"
        ],
        seasons: {
            summer: ["calor", "riego", "pileta", "tardes largas", "actividad rural"],
            autumn: ["cosecha", "fruta", "hojas de álamos", "movimiento en chacras"],
            winter: ["frío", "mañanas oscuras", "menos peatones", "hogares"],
            spring: ["brotes", "verde en chacras", "viento", "más actividad al aire libre"]
        }
    };
})();
