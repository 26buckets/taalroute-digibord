import {enabled,modelIssues} from './model.mjs';
import {canonicalOrder} from './grammar.mjs';
/** @typedef {'sentenceBuild'|'reorder'|'completeSentence'|'repairSentence'} ExerciseType */
/** @typedef {{type:ExerciseType,order:string[],bank:string[],fixed:string[],instruction:string}} Exercise */
export const exerciseLabels = Object.freeze({sentenceBuild:'Zin bouwen',reorder:'Volgorde leggen',completeSentence:'Zin afmaken',repairSentence:'Foute zin verbeteren'});
export function shuffle(ids,random=Math.random) {
 const result=[...ids];
 for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
 if(result.length>1&&result.every((id,i)=>id===ids[i]))result.push(result.shift());
 return result;
}
/** @param {import('./model.mjs').SentenceModel} model @param {ExerciseType} type @returns {Exercise} */
export function createExercise(model,type,random=Math.random) {
 if(modelIssues(model).length||!Object.hasOwn(exerciseLabels,type))throw new Error('Maak eerst een geldige activiteit.');
 const canonical=canonicalOrder(model), mixed=shuffle(enabled(model).map(c=>c.id),random);
 if(type==='sentenceBuild')return {type,order:[],bank:mixed,fixed:[],instruction:'Bouw een zin met alle kaarten.'};
 if(type==='reorder')return {type,order:mixed,bank:[],fixed:[],instruction:'Leg de kaarten in een goede volgorde.'};
 if(type==='completeSentence')return {type,order:canonical.slice(0,-1),bank:canonical.slice(-1),fixed:canonical.slice(0,-1),instruction:'Maak de zin af. De eerste kaarten staan vast.'};
 // Deliberately wrong for every valid activity, even one with only subject + verb.
 const wrong=[...canonical];[wrong[0],wrong[1]]=[wrong[1],wrong[0]];
 return {type,order:wrong,bank:[],fixed:[],instruction:'Verbeter de zin door kaarten te verplaatsen.'};
}
/** Enforced both in shared UI and server, so fixed components cannot be bypassed. */
export const respectsFixed = (exercise,order) => exercise.fixed.every((id,i)=>order[i]===id);
