/* LOS SECRETOS DEL CHAÑAR — ECONOMY V23 */
(function(){"use strict";
const prices={bread:1200,mate:2800,groceries:4500};
function init(){if(typeof player.money!=="number")player.money=12000;if(typeof player.groceries!=="number")player.groceries=0}
function buy(item){init();const p=prices[item];if(!p)return false;if(player.money<p){window.ChanarV20?.bus.emit("economy:insufficient",{item,price:p});return false}player.money-=p;if(item==="bread")player.bread=(player.bread||0)+1;if(item==="mate")player.mate=(player.mate||0)+1;if(item==="groceries")player.groceries++;window.ChanarV20?.bus.emit("economy:purchase",{item,price:p});return true}
function earn(amount,reason="trabajo"){init();player.money+=Math.max(0,amount);window.ChanarV20?.bus.emit("economy:income",{amount,reason})}
function workPay(role){return role&&role.toLowerCase().includes("rural")?5200:4200}
window.ChanarEconomy={prices,init,buy,earn,workPay};init();})();
