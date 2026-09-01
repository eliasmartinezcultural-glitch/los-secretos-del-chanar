/* LOS SECRETOS DEL CHAÑAR — V24 TERRITORY */
(function(){
'use strict';
window.ChanarTerritoryV24={
 version:'24.0',
 references:[
  {id:'rp7',name:'Ruta Provincial 7',type:'road'},
  {id:'rp8',name:'Ruta Provincial 8',type:'road'},
  {id:'rio-neuquen',name:'Río Neuquén',type:'water'},
  {id:'chacras',name:'Chacras productivas',type:'agriculture'},
  {id:'vinedos',name:'Viñedos',type:'vineyard'},
  {id:'alamedas',name:'Cortinas de álamos',type:'forest'},
  {id:'canales',name:'Canales y drenajes',type:'irrigation'},
  {id:'bardas',name:'Bardas',type:'landform'},
  {id:'damero',name:'Núcleo urbano en damero',type:'urban'}
 ],
 palette:{urban:'low-rise',rural:'irrigated-valley',edge:'patagonian-steppe'},
 validate:function(){return this.references.length>=9;}
};
})();
