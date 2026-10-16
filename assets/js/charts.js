/* Компонент графиков (Chart.js). Все ряды — тестовые. */
const COLORS=["#087E9C","#18A5A0","#123246","#3C8768"];window.BKCharts={};
function drawChart(canvas,cfg,{mini=false}={}){if(BKCharts[canvas.id])BKCharts[canvas.id].destroy();
 BKCharts[canvas.id]=new Chart(canvas,{type:cfg.type,data:{labels:cfg.labels,datasets:cfg.sets.map((d,i)=>{const c=cfg.green&&i===0?"#3C8768":COLORS[i%4];return{label:d.label,data:d.data,borderColor:c,backgroundColor:c+(cfg.type==="bar"?"cc":"22"),fill:cfg.type==="line"&&i===0,tension:.35,pointRadius:mini?0:3,borderWidth:2,borderRadius:4}})},
 options:{animation:BK.reduced?false:{duration:700},responsive:true,maintainAspectRatio:false,plugins:{legend:{display:!mini,position:"bottom",labels:{font:{family:"Manrope"},boxWidth:12}},subtitle:{display:!mini,text:"Тестовые данные — значения условные",color:"#8a5a00",font:{size:11}}},scales:{x:{grid:{display:false},ticks:{display:!mini}},y:{grid:{color:"#eef2f4"},ticks:{display:!mini}}}}});}
async function seriesChart(canvas,key,opts){const S=await DataAPI.series(),s=S[key];drawChart(canvas,{type:s.type,labels:S.labels,sets:s.sets,green:key==="forests"},opts);
 const t=canvas.closest("[data-chart-wrap]")?.querySelector("[data-chart-title]");if(t)t.textContent=s.title;}
window.drawChart=drawChart;window.seriesChart=seriesChart;
