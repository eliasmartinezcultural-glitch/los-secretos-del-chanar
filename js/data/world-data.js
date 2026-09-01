/* LOS SECRETOS DEL CHAÑAR — WORLD DATA V20.1 */
(function () {
    "use strict";
    window.CHANAR_WORLD_DATA = {
        version: "20.1",
        zones: [
            { id: "center", name: "CENTRO DEL CHAÑAR", x: 1450, y: 1000, width: 1800, height: 1250 },
            { id: "chacras", name: "CHACRAS", x: 100, y: 400, width: 1250, height: 1900 },
            { id: "rural", name: "SECTOR RURAL", x: 200, y: 2550, width: 3700, height: 850 },
            { id: "river", name: "RIBERA", x: 4200, y: 2550, width: 1000, height: 1050 }
        ],
        buildings: [
            { id: "bakery", label: "Panadería El Chañar", kind: "business" },
            { id: "radio", label: "Radio Ocarina", kind: "radio" },
            { id: "school", label: "Escuela", kind: "school" },
            { id: "stadium", label: "Estadio", kind: "stadium" },
            { id: "museum", label: "Museo Local", kind: "museum" },
            { id: "market", label: "Almacén del Barrio", kind: "business" },
            { id: "house1", label: "Casa de Rosa", kind: "house" },
            { id: "house2", label: "Casa de Don Pedro", kind: "house" },
            { id: "house3", label: "Casa de María", kind: "house" },
            { id: "farmhouse", label: "Chacra", kind: "farm" }
        ],
        landmarks: [
            { id: "river", label: "Río", kind: "nature" },
            { id: "vineyards", label: "Viñedos", kind: "agriculture" }
        ]
    };
})();
