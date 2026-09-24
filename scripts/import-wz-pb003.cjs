const adapt=require('../content-bank-adapters.js');
module.exports=require('./reviewed-wz-bank.cjs')({number:'003',spreadsheetId:'1mMc2hglfJ6ezofPujrZRXnZnWwl0PWhwV7SNkNe8h20',sourceCount:640,itemCount:425,previous:[...adapt(require('../Lessen/woorden-zinnen.json')).items,...adapt(require('../data/wz-pb002.js')).items]},require.main===module);
