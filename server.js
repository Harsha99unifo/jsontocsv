'use strict';

const Hapi = require('@hapi/hapi');

let format = require('date-format');

const xlsx = require('xlsx');

let readJsonStream = require('read-json-stream').default;


const init = async () => {

    const server = Hapi.server({
        port: 8080,
        host: 'localhost'
    });
   
    server.route({
            method:'POST',
            path:'/',
            handler:  (request, h)=>
            {
              readJsonStream('jobJsonData.json').done((err,jobData)=>{
                if(err){
                   console.log(err);
                }
                else
                { 
                    
                   // manually adding the serialnumber(SNo) to the jobData 
                   jobData.map( (x,i) => x.SNO = i+1);

                   const setSheetDate = format('MM-dd-yyyy',new Date());
                   const newBook = xlsx.utils.book_new();
                   const newSheet = xlsx.utils.json_to_sheet(jobData,{header: ['SNO']});
                    
                   xlsx.utils.book_append_sheet(newBook,newSheet,setSheetDate);

                   xlsx.writeFile(newBook,"DIALY_DICE_REPORT.xlsx");
                   
                }
                
              });
              return h.response("200,ok");
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
