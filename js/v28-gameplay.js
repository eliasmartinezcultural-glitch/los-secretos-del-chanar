/* V28.11 — gameplay core: missions, interaction, progression, exploration */
(function(){'use strict';
const G=window.ChanarV28Gameplay={version:'28.11',activeMission:null,completed:[],flags:{},history:[],interactions:0};
G.missions={explore:{title:'Primer recorrido',description:'Recorré las calles y conocé el pueblo.',steps:[{id:'walk',text:'Recorré una zona del pueblo.'},{id:'meet',text:'Hablá con un habitante.'}],reward:{type:'knowledge',value:1}},daily:{title:'Una mañana en Chañar',description:'Viví una pequeña rutina cotidiana.',steps:[{id:'shop',text:'Visitá un comercio.'},{id:'return',text:'Volvé a recorrer el barrio.'}],reward:{type:'money',value:500}}};
G.start=function(id){const m=G.missions[id];if(!m)return null;G.activeMission={id:id,index:0};G.history.push({type:'mission_start',id:id,time:Date.now()});return m};
G.progress=function(action){const m=G.activeMission;if(!m)return false;const step=m&&G.missions[m.id]&&G.missions[m.id].steps[m.index];if(!step||step.id!==action)return false;m.index++;if(m.index>=G.missions[m.id].steps.length){G.complete(m.id);return true}return false};
G.complete=function(id){if(G.completed.indexOf(id)<0)G.completed.push(id);G.flags['mission_'+id]=true;G.history.push({type:'mission_complete',id:id,time:Date.now()});G.activeMission=null;};
G.interact=function(target){G.interactions++;G.history.push({type:'interaction',target:String(target||'unknown'),time:Date.now()});return true};
G.discover=function(key){if(!key)return false;G.flags['discover_'+key]=true;G.history.push({type:'discovery',key:key,time:Date.now()});return true};
G.status=function(){return{version:G.version,activeMission:G.activeMission,completed:G.completed.slice(),flags:Object.assign({},G.flags),interactions:G.interactions}};
G.rule='La jugabilidad une exploración, conversación, tareas, descubrimientos y progreso; la historia documentada podrá alimentar misiones sin modificar el núcleo.';
})();
