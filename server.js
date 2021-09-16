'use strict';
const Hapi = require('@hapi/hapi');
/*const createCsvWriter = require('csv-writer').createObjectCsvWriter;*/
const writeCSV = require('write-csv');
let format = require('date-format');
const date=format('dd-MM-yyyy',new Date());
const xlsx = require('xlsx');
console.log(date);
//read jsonfile
var readJsonStream = require('read-json-stream').default;
//onst jsondata =  readjson('./data.json');
console.log(readJsonStream);
/*const csvWriter=createCsvWriter({
      path: "T:/jsontocsv/geek_data.csv",
      header: [
         {id:"id"},
          {id: "name"},
          {id: "phoneNumber"}
      ]
});*/


const init = async () => {

    const server = Hapi.server({
        port: 8000,
        host: 'localhost'
    });

    server.route({
            method:'POST',
            path:'/',
            handler:  (request, h)=>
            {
              readJsonStream('data.json').done((err,datagot)=>{
                if(err){
                   console.log(err);
                }
                else
                { 
                    //console.log(date);              
                    /**const writeCsv = require('write-csv');
                    writeCSV('gree_data.csv', data);   
                    //csvWriter.writeRecords(data).then(()=> console.log('data uploaded into csv sucessfully'));
                   */const newBook = xlsx.utils.book_new();
                   const newSheet = xlsx.utils.json_to_sheet(datagot);
                   xlsx.utils.book_append_sheet(newBook,newSheet,date);
                   xlsx.writeFile(newBook,"DIALY_DICE_REPORT.xlsx");
                   
                      
                }
                
              });
              return h.response("hellow");
            }
    });
    await server.start();
    console.log('Server running on %s', server.info.uri);

 process.on('unhandledRejection', (err) => {

      console.log(err);
      process.exit(1);
 });
}            
init();
