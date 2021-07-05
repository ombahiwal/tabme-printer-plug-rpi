
// const { app, BrowserWindow } = require('electron')


// start of logic
// var load_page = "index.html";
require('dotenv').config()
const escpos = require('escpos');
const _ = require('lodash');
// install escpos-usb adapter module manually
escpos.USB = require('escpos-usb');
// Select the adapter based on your printer type

// const device  = new escpos.Network('localhost');
// const device  = new escpos.Serial('/dev/usb/lp0');
var device;
var printer;
const options = { encoding: "UTF8", width:50 /* default */ }
// encoding is optional
try{
  device  = new escpos.USB(); 
  printer = new escpos.Printer(device, options);
}catch(e){
  console.log('Could not find printer', e);
  load_page = "error.html";
  // process.exit();
}
const express = require('express');
const https = require('https');
const fs = require('fs');
const axios = require('axios');

// var key = fs.readFileSync(__dirname + '/selfsigned.key');
// var cert = fs.readFileSync(__dirname + '/selfsigned.crt');
// var options_serv = {
//   key: key,
//   cert: cert
// };

const app_express = express();
app_express.use(express.json({limit: '50mb'}));
app_express.use(express.urlencoded({limit: '50mb'}));
app_express.use(express.json());
app_express.use(express.urlencoded({ extended: false }));
const port = 9000;
var cors = require ('cors');
app_express.use(cors());
const API_URL_DATA = "https://api.tabme.io/api/v1/ds/";

var new_order_data = 0;
var new_orders_idxs = [];

function containsObject(obj, list) {
  var res = _.find(list, function(val){ return _.isEqual(obj, val)});
  return (_.isObject(res))? true:false;
 }

function format_name_uscore(name){
  return name.split('_')[0];
}

const txt_options = (options, flag=true)=>{
  // var strarr = []
  var str = "-";
  ;
  options.map((opt)=>{
    if(opt.values.length >0){
      str = str + format_name_uscore(opt.title)+ ":" ; 
      opt.values.map((val)=>{
        str = str+val.value+" ";
      });
      str += "";
    }      
    });
    if(options.length === 0 && flag){
      return "-"
    }
  return str
}


function printOrder(order){


  try{

    
    var newObj;
  var txt ="";
  var count_opt=0;
  var options_desc = "";
  var print_table_options = [];
  var print_table_simple = [];
  var order_type_str = "";
  // var order = req.body.order;
// Sample Order
//   var order =  {"_id":"5fd0ce94284f6803079d05e3",
//   "user":{"fname":"test","lname":"tes","email":"tets@dtsdn.com","phone":"6363636","guest":true},"user_email":"tets@dtsdn.com","rname":"Stöckert's Bakery","menu_id":"5f4908c3e25e870846903598","tablenum":0,"isComplete":false,"open":false,"status":"Cancelled","gastro_id":"5f4298d1a1f2d03aedeb6cb3","cart":{"dishes":[{"dish_id":"5f4908c3e25e8708469035b0","name":"Wasser","optionSets":[{"option_dish_count":1,"option_price":0,"optionset":[]}],"dishCount":1,"basePrice":4,"optionPrice":0,"totalPrice":4,"discount":0}],"itemCount":1,"cartTotal":4,"taxlabel":"included","taxpercent":0,"tax":0,"discountpercent":0,"promo":0,"tip":0,"currency":"EUR","totalCost":4,"notes":"","tablenum":"0","pmethod":"Stripe Express"},"paymentInfo":"5fd0ce94cbf0967260783d9b","createdAt":"2020-12-09T13:18:12.667Z","updatedAt":"2020-12-09T13:20:52.416Z","__v":0};
// var order = {"_id":"6040e3cc0089fe5923603c3f","user":{"fname":"Chaitrali","lname":"Pathak","email":"info@tabme.info","phone":"09860711867","guest":true},"user_email":"info@tabme.info","rname":"UFO Fries & Corn","menu_id":"5fb573d9e7165709f792d1dd","tablenum":1,"isComplete":true,"open":false,"status":"Completed","gastro_id":"5fb5428b8e072d468ec56655","cart":{"dishes":[{"dish_id":"5fb65063e7165709f792d2e3","name":"Szechwan Cheese Fries","optionSets":[{"option_dish_count":1,"option_price":0,"optionset":[]}],"dishCount":1,"basePrice":120,"optionPrice":0,"totalPrice":120,"discount":0},{"dish_id":"5fb6e868e7165709f792d94d","name":"Classic Cheesy Nachos","optionSets":[{"option_dish_count":1,"option_price":0,"optionset":[]}],"dishCount":1,"basePrice":160,"optionPrice":0,"totalPrice":160,"discount":0}],"itemCount":2,"cartTotal":280,"taxlabel":"included","taxpercent":0,"tax":0,"discountpercent":0,"promo":0,"tip":0,"currency":"INR","totalCost":280,"notes":"","tablenum":"1","pmethod":"CASH / External"},"paymentInfo":"6040e3cb3e3d2c7ed89ac499","createdAt":"2021-03-04T13:42:36.914Z","updatedAt":{"$date":"2021-03-06T23:13:43.593Z"},"__v":0};
// var order = {"_id":"60461896b5f14f4a9d3b51d5","user":{"_id":"5f809edb173c4d0f0430f38d","fname":"Om","lname":"Bahiwal","email":"bahiwal@aol.com","password":"","phone":"9373130909","address":"1, 63 Aditya Nagar, Garkheda ","zip":"431009","region":"Maharashtra","country":"India","createdAt":"2020-10-09T17:33:15.877Z","updatedAt":"2021-03-07T21:19:33.963Z","__v":0},"user_email":"bahiwal@aol.com","rname":"Asian Fusion","menu_id":"5f4908c3e25e870846903598","tablenum":0,"isComplete":false,"open":true,"status":"Received","gastro_id":"5f4298d1a1f2d03aedeb6cb3","cart":{"dishes":[{"dish_id":"5f4908c3e25e8708469035b6","name":"Manchurian Balls","optionSets":[{"option_dish_count":1,"option_price":0.1,"optionset":[{"title":"Garlic AddOn","_id":"5f4908c3e25e8708469035b7","required":false,"type":"single","values":[{"_id":"5f4908c3e25e8708469035b8","addPrice":0.1,"value":"Yes"}]}]}],"dishCount":1,"basePrice":4,"optionPrice":0.1,"totalPrice":4.1,"discount":0},{"dish_id":"603a3bee838e655716a82943","name":"Water","optionSets":[{"option_dish_count":1,"option_price":0,"optionset":[]}],"dishCount":1,"basePrice":123,"optionPrice":0,"totalPrice":123,"discount":0},{"dish_id":"5f4908c3e25e8708469035a3","name":"Arrabbiata","optionSets":[{"option_dish_count":1,"option_price":1,"optionset":[{"title":"Sauce","_id":"5f4908c3e25e8708469035a4","required":true,"type":"single","values":[{"_id":"5f4908c3e25e8708469035a7","addPrice":1,"value":"Green"}]}]},{"option_dish_count":1,"option_price":1,"optionset":[{"title":"Sauce","_id":"5f4908c3e25e8708469035a4","required":true,"type":"single","values":[{"_id":"5f4908c3e25e8708469035a6","addPrice":1,"value":"White"}]}]}],"dishCount":2,"basePrice":2,"optionPrice":2,"totalPrice":6,"discount":0},{"dish_id":"5f4908c3e25e8708469035ad","name":"Chicken Tikka Masala","optionSets":[{"option_dish_count":1,"option_price":0,"optionset":[]}],"dishCount":1,"basePrice":9,"optionPrice":0,"totalPrice":9,"discount":0}],"itemCount":5,"cartTotal":142.1,"taxlabel":"included","taxpercent":0,"tax":0,"discountpercent":0,"promo":0,"tip":14.21,"currency":"EUR","totalCost":156.31,"notes":"Test Notes","tablenum":"0","pmethod":"CASH / External"},"paymentInfo":"604618953e3d2c7ed89ac49e","createdAt":{"$date":"2021-03-08T12:29:10.234Z"},"updatedAt":"2021-03-08T12:29:10.234Z","__v":0};
    // var order = {"_id":"604622c6b5f14f4a9d3b51e0","user":{"_id":"5f809edb173c4d0f0430f38d","fname":"Om","lname":"Bahiwal","email":"bahiwal@aol.com","password":"","phone":"9373130909","address":"1, 63 Aditya Nagar, Garkheda ","zip":"431009","region":"Maharashtra","country":"India","createdAt":"2020-10-09T17:33:15.877Z","updatedAt":"2021-03-07T21:19:33.963Z","__v":0},"user_email":"bahiwal@aol.com","rname":"Asian Fusion","menu_id":"602d59ab73c1911ce3cdb0d3","tablenum":0,"isComplete":false,"open":true,"status":"Preparing","gastro_id":"5f4298d1a1f2d03aedeb6cb3","cart":{"dishes":[{"dish_id":"602d59ab73c1911ce3cdb0d4","name":"test","optionSets":[{"option_dish_count":1,"option_price":14,"optionset":[{"title":"test","_id":"60462258b5f14f4a9d3b51d7","required":true,"type":"multiple","values":[{"_id":"60462258b5f14f4a9d3b51d8","addPrice":1,"value":"q"},{"_id":"60462258b5f14f4a9d3b51d9","addPrice":1,"value":"Hello"},{"_id":"60462258b5f14f4a9d3b51da","addPrice":12,"value":"Tomato Sauce saft"}]}]}],"dishCount":1,"basePrice":22,"optionPrice":14,"totalPrice":36,"discount":0}],"itemCount":1,"cartTotal":36,"taxlabel":"included","taxpercent":0,"tax":0,"discountpercent":0,"promo":0,"tip":0,"currency":"EUR","totalCost":36,"notes":"Hi, I want the test dish very spicy","tablenum":"0","pmethod":"CASH / External"},"paymentInfo":"604622c53e3d2c7ed89ac49f","createdAt":"2021-03-08T13:12:38.440Z","updatedAt":{"$date":"2021-03-08T13:12:51.923Z"},"__v":0}
    // var order = {"_id":"60462947b5f14f4a9d3b51fc","user":{"_id":"5f809edb173c4d0f0430f38d","fname":"Om","lname":"Bahiwal","email":"bahiwal@aol.com","password":"","phone":"9373130909","address":"1, 63 Aditya Nagar, Garkheda ","zip":"431009","region":"Maharashtra","country":"India","createdAt":"2020-10-09T17:33:15.877Z","updatedAt":"2021-03-07T21:19:33.963Z","__v":0},"user_email":"bahiwal@aol.com","rname":"Asian Fusion","menu_id":"602d59ab73c1911ce3cdb0d3","tablenum":0,"isComplete":false,"open":true,"status":"Preparing","gastro_id":"5f4298d1a1f2d03aedeb6cb3","cart":{"dishes":[{"dish_id":"602d59ab73c1911ce3cdb0d4","name":"test","optionSets":[{"option_dish_count":1,"option_price":15,"optionset":[{"title":"test","_id":"604628e7b5f14f4a9d3b51ed","required":true,"type":"multiple","values":[{"_id":"604628e7b5f14f4a9d3b51ee","addPrice":1,"value":"q"},{"_id":"604628e7b5f14f4a9d3b51ef","addPrice":1,"value":"Hello"},{"_id":"604628e7b5f14f4a9d3b51f0","addPrice":12,"value":"Tomato Sauce saft"}]},{"title":"Test2","_id":"604628e7b5f14f4a9d3b51f1","required":true,"type":"single","values":[{"_id":"604628e7b5f14f4a9d3b51f2","addPrice":1,"value":"Hu"}]}]},{"option_dish_count":1,"option_price":13,"optionset":[{"title":"Test2","_id":"604628e7b5f14f4a9d3b51f1","required":true,"type":"single","values":[{"_id":"604628e7b5f14f4a9d3b51f3","addPrice":1,"value":"Huw"}]},{"title":"test","_id":"604628e7b5f14f4a9d3b51ed","required":true,"type":"multiple","values":[{"_id":"604628e7b5f14f4a9d3b51f0","addPrice":12,"value":"Tomato Sauce saft"}]}]},{"option_dish_count":1,"option_price":14,"optionset":[{"title":"Test2","_id":"604628e7b5f14f4a9d3b51f1","required":true,"type":"single","values":[{"_id":"604628e7b5f14f4a9d3b51f3","addPrice":1,"value":"Huw"}]},{"title":"test","_id":"604628e7b5f14f4a9d3b51ed","required":true,"type":"multiple","values":[{"_id":"604628e7b5f14f4a9d3b51ef","addPrice":1,"value":"Hello"},{"_id":"604628e7b5f14f4a9d3b51f0","addPrice":12,"value":"Tomato Sauce saft"}]}]}],"dishCount":3,"basePrice":22,"optionPrice":42,"totalPrice":108,"discount":0}],"itemCount":3,"cartTotal":108,"taxlabel":"included","taxpercent":0,"tax":0,"discountpercent":0,"promo":0,"tip":16.2,"currency":"EUR","totalCost":124.2,"notes":"Test cats","tablenum":"0","pmethod":"CASH / External"},"paymentInfo":"604629473e3d2c7ed89ac4a1","createdAt":"2021-03-08T13:40:23.449Z","updatedAt":{"$date":"2021-03-08T13:40:27.293Z"},"__v":0}
  console.log(order.createdAt);
    var createdAt = `${(new Date(order.createdAt)).toString().slice(0, 25)}`;
    var order_type_str = "";
  
    switch(parseInt(order.cart.tablenum)){
        case -1:
            order_type_str = `PICKUP-${String(parseInt(order._id.slice(18, 24), 16)).slice(5,8)}`;
            break;
        case -2:
            order_type_str = `DELIVERY-${String(parseInt(order._id.slice(18, 24), 16)).slice(5,8)}`;
            break;
        case -4:
            order_type_str = `${order.cart.order_label}-${String(parseInt(order._id.slice(18, 24), 16)).slice(5,8)}`;
        default:
            order_type_str = `Table No.${order.tablenum}`;

    }
    if(order.cart.itemCount % 2 === 0){
      
    }

  order.cart.dishes.map((dish)=>{
        dish.optionSets.map((optobj)=>{
          count_opt +=1;
          newObj = new Object({});
          options_desc = ""
          if(optobj.optionset.length >0){
              txt = txt_options(optobj.optionset);
              if(txt !== "")
                  options_desc += `${txt}`;
          }
           if(options_desc === ""){
              options_desc = null;
            }
            newObj.item =  dish.name.slice(0, 17);
            newObj.basePrice = dish.basePrice.toFixed(2).toString();
            newObj.quantity = optobj.option_dish_count;
            newObj.addonPrice = optobj.option_price.toFixed(2).toString();
            newObj.amount = (parseFloat(newObj.basePrice) + parseFloat(newObj.addonPrice)) * newObj.quantity;
            newObj.description = options_desc;
            // invoice.items.push(newObj);
            console.log(`${newObj.item} x${newObj.quantity}`, `${newObj.item} x${newObj.quantity}`.length)
            // print_table_options.push({text:``, align:"LEFT", width:0.001, style:"B"});
            print_table_options.push({text:`${newObj.item} x${newObj.quantity}`, align:"LEFT", width:0.058, style:"B"});
            print_table_options.push({text:`${newObj.amount.toFixed(2).toString()}`, align:"LEFT", width:0.021});
            
            print_table_simple.push([`${newObj.item} x${newObj.quantity}`, `${newObj.amount.toFixed(2).toString()}`]);
            
            if(newObj.description){
                // split the string into parts of 20
                var desc_arr = newObj.description.match(/.{1,17}/g);
                console.log(desc_arr)
                desc_arr.map(desc=>{
                    console.log(desc);
                    print_table_options.push({text:` ${desc.slice(0,19)}`, align:"LEFT", width:0.058});
                    print_table_options.push({text:`.`, align:"LEFT", width:0.02});
                    print_table_simple.push([` ${desc.slice(0,19)}`, ` `]);
                })                
            }
            
            console.log(newObj);
            });
            
        });
        

        if(order.cart.promo){
            print_table_options.push({ text:"promo", align:"LEFT", width:0.058});
            print_table_options.push({ text:`${order.cart.promo.toFixed(2).toString()}`, align:"LEFT", width:0.021});
            print_table_simple.push([`promo`, `${order.cart.promo.toFixed(2).toString()}`]);
        }

        if(order.cart.tip){
            print_table_options.push({ text:"tip", align:"LEFT", width:0.058});
            print_table_options.push({ text:`${order.cart.tip.toFixed(2).toString()}`, align:"LEFT", width:0.021});
            print_table_simple.push([`tip`, `${order.cart.tip.toFixed(2).toString()}`]);
        }
        //     // print_table_options.push({text:`1234567890123456789 x99`, align:"LEFT", width:0.058, style:"B"});
        //     // print_table_options.push({text:`9999.99`, align:"LEFT", width:0.021});

            print_table_options.push({ text:"Total", align:"LEFT", width:0.058, style: 'B' })
            print_table_options.push({text:`${order.cart.totalCost.toFixed(2).toString()}`, align:"LEFT", width:0.021, style:"B"});
            print_table_simple.push([`Total`, `${order.cart.totalCost.toFixed(2).toString()}`]);
    
        
        
            //     { text:"Chicken Tikka -x90", align:"LEFT", width:0.055, style: 'B' },
            //     { text:"19999", align:"RIGHT", width:0.020}, 
            //     // { text:"", align:"LEFT", width:0.077 },
            //     // { text:"", align:"LEFT", width:0.001},   
            //     //   { text:"Butter Naan", align:"LEFT", width:0.055, style: 'B' },
            //     //   { text:"900.00", align:"LEFT", width:0.023},     
          
            //     //   { text:"promo", align:"LEFT", width:0.055},
            //     //   { text:"00.00", align:"LEFT", width:0.023}, 
          
            //     //   { text:"Total", align:"LEFT", width:0.055, style: 'B' },
            //     //   { text:"1900.00", align:"LEFT", width:0.023, style: 'B'}, 
            //     ]
            console.log(print_table_simple);
    device.open(function(error){
        printer
        .font('a')
        .align('ct')
        .style('bu')
        .text('                              \n')
        .size(1, 1)
        .text('tabme.')
        .size(0.01, 0.01)
        .text(`${order.rname}\n`)
        .size(1, 0.75)
        .text(order_type_str)
        .size(0.5, 0.25)
        .text('                ');
        printer
        .size(0.01, 0.01)
        .table(["Dish / Q", `Pr(${order.cart.currency})`]);
        print_table_simple.map(prow=>{
          printer
            .size(0.01, 0.01)
          .table(prow);
        });

        // .tableCustom(
        //     print_table_options,
        //   { encoding: 'cp857', size: [0.1, 0.1] } // Optional
        // )
        printer
        .size(0.01, 0.01)
        .text(order.cart.notes ? order.cart.notes : '' )
        .text(`${order.user.fname} ${order.user.lname}`)
        .text(`${order.cart.pmethod} | OID : ${String(order._id.slice(18, 24).toUpperCase())}`)
        .text(createdAt)
        .text('- - this is not a receipt - -    \n')
          printer.beep(1,100);
          printer.cut().close();
          
      });
      return true
    }catch(e){
        console.log(e);
        return false     
    }

}

async function fetchOpenOrdersAndPrint(r_id){
  var newOrders = await axios.post(API_URL_DATA+'order/fetch/open', {restaurant_id:r_id, open:true})  
  newOrders = newOrders.data.orders
  // console.log(newOrders.data.orders);
  newOrders.map(neueOrder=>{
    if(!containsObject(neueOrder, new_orders_idxs)){
      // sendToPrinter(order);
      printOrder(neueOrder);
      new_orders_idxs.push(neueOrder);
      // return true;
      }else{
        // return true
        // console.log('order already printed');
      }    
    // sleep(2000);
  });
}


app_express.post('/print/order', (req, res)=>{
    console.log('ORDER PRINT RECEIPT REQUEST - ', req.body.order);
    printOrder(req.body.order);
});

app_express.post('/print/test', (req, res)=>{

});


app_express.get('/', (req, res) => {
    res.send('Hello World!');
  })
//   var server = https.createServer(options_serv, app_express);


  function testPrint(){
      device.open(function(error){
        console.log(error)
        printer
        .font('a')
        .align('ct')
        .style('bu')
        .size(1, 1)
        .text('tabme.\n Hello!')
        .cut().close();
      });
  }



app_express.listen(port, () => {
  // testPrint()
  setInterval(()=>{fetchOpenOrdersAndPrint(process.env.RESTAURANT_ID)}, 10000);
  // setInterval(()=>{console.log(new_order_data); new_order_data +=1;}, 1000);
  console.log(`${process.env.RESTAURANT_ID}Printing Server listening at https://localhost:${port}`);
})




// end of logic for app
function createWindow (file_name) {
  const win = new BrowserWindow({
    width: 500,
    height: 500,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile(file_name);
}

// app.whenReady().then(()=>{
//   createWindow(load_page);
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }else{
    
//   }
  
//   process.exit()
// })

// app.on('activate', () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow()
//   }
// })


//npx @electron-forge/cli import
//npm run make
