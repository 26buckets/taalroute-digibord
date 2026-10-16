import {clean,sentenceText} from './model.mjs';
import {validate} from './grammar.mjs';
/** Normalize whitespace/case in displayed answers, without conflating punctuation or word order. */
export const canonicalAnswer = text => clean(text).toLocaleLowerCase('nl');
export function groupAnswers(model,answers) {
 const groups=new Map();
 for(const answer of answers){
  const text=sentenceText(model,answer.order),key=canonicalAnswer(text);
  if(!groups.has(key))groups.set(key,{key,text,count:0,order:answer.order,status:validate(model,answer.order).status});
  groups.get(key).count++;
 }
 return [...groups.values()].sort((a,b)=>b.count-a.count||a.key.localeCompare(b.key,'nl'));
}
