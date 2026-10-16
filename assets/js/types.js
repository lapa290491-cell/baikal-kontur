/* Модели данных (JSDoc). Используются как контракт для будущих API.
 * @typedef {Object} SourceMeta
 * @property {string} sourceId  @property {"demo"|"api"|"manual"|"satellite"} sourceType
 * @property {string} updatedAt ISO-дата  @property {"not_verified"|"verified"|"pending"} verificationStatus  @property {boolean} isDemo
 * @typedef {SourceMeta & {id:string,layer:string,name:string,place:string,region:string,lat:number,lng:number,status:string,desc?:string,slug?:string}} MapObject
 * @typedef {SourceMeta & {slug:string,title:string,cat:string,region:string,status:string,summary:string,problem:string,goal:string,activities:string[],indicators:string[],lat:number,lng:number}} Project
 * @typedef {{slug:string,title:string,short:string,audience:string,tasks:string[],works:string[],result:string,stages:string[]}} Service
 * @typedef {{slug:string,title:string,rubric:string,date:string,author:string,lead:string,body:string[],table?:string[][],sources:string[]}} Article
 */
