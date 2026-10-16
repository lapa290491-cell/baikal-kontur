/* Слой доступа к данным (data services). UI обращается ТОЛЬКО сюда.
   Сейчас: локальные демо-данные (window.DEMO_DATA). Для API: задайте DataAPI.baseUrl —
   get(key) начнёт делать fetch(baseUrl + "/" + key) и ожидать JSON того же формата (см. types.js). */
window.DataAPI = {
  baseUrl: null,
  async get(key){
    if (this.baseUrl){ const r = await fetch(this.baseUrl + "/" + key); if(!r.ok) throw new Error("API "+r.status); return r.json(); }
    return structuredClone(window.DEMO_DATA[key]);
  },
  objects(){return this.get("objects")}, layers(){return this.get("layers")}, regions(){return this.get("regions")}, series(){return this.get("series")},
  projects(){return this.get("projects")}, services(){return this.get("services")}, analytics(){return this.get("analytics")},
  experts(){return this.get("experts")}, cabinet(){return this.get("cabinet")},
  async project(slug){return (await this.projects()).find(p=>p.slug===slug)},
  async service(slug){return (await this.services()).find(p=>p.slug===slug)},
  async article(slug){return (await this.analytics()).find(p=>p.slug===slug)}
};
