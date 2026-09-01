/* LOS SECRETOS DEL CHAÑAR — SEASONAL TERRITORY V23 */
(function(){"use strict";
const seasons=[
 {id:"verano",label:"VERANO",days:1,fruit:true,vine:true},
 {id:"otono",label:"OTOÑO",days:31,fruit:true,vine:true},
 {id:"invierno",label:"INVIERNO",days:61,fruit:false,vine:false},
 {id:"primavera",label:"PRIMAVERA",days:91,fruit:true,vine:true}
];
function current(){const d=((world.day-1)%120)+1;return d<31?seasons[0]:d<61?seasons[1]:d<91?seasons[2]:seasons[3]}
function state(){const s=current();return {season:s.id,label:s.label,fruit:s.fruit,vine:s.vine}}
window.ChanarSeason={current,state,seasons};
})();
