const adapt=require('../content-bank-adapters.js');
module.exports=require('./reviewed-wz-bank.cjs')({number:'004',spreadsheetId:'1NGWFma8tAiU1ygnhfhXtT0NJw68KaAvST9HYSJO_h8c',sourceCount:960,itemCount:598,previous:[...adapt(require('../Lessen/woorden-zinnen.json')).items,...adapt(require('../data/wz-pb002.js')).items,...require('../data/wz-pb003.js').items]},require.main===module);
