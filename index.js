const http = require("http");
const fs = require("fs");

var requests = require('requests');
const replaceVal = (tempval,orgVal)=>{
    let temp=orgVal.main.temp-273.15;
    let realTemp=temp.toFixed(2);
    let temperature = tempval.replace("{%tempvalue%}",realTemp);
    let minTemp = orgVal.main.temp_min-273.15;
    let minTemp1 = minTemp.toFixed(2);
    // const minTempCelcius =(minTemp−273.15 );
    let maxTemp = orgVal.main.temp_max-273.15;
    let maxTemp1 = maxTemp.toFixed(2);
    // const maxTempCelcius = (maxTemp - 32) / 1.8;
    temperature = temperature.replace("{%tempmin%}",minTemp1);
    temperature = temperature.replace("{%tempmax%}", maxTemp1);
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
    return temperature;
};

const homeFile=fs.readFileSync("home.html","utf-8");
const server = http.createServer((req,res)=>{
    if(req.url=="/")
    {
        requests('http://api.openweathermap.org/data/2.5/weather?q=Pune&appid=e9b1ba6231ff42bfaf60bf61f0a1ece7')
        .on('data',(chunk)=> {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrdata);
        const realTimeData = arrData.map(val=> replaceVal(homeFile,val)).join("");
        res.write(realTimeData);
        })
        .on('end',(err)=> {
        if (err) return console.log('connection closed due to errors', err);
        res.end();
        });
    }
});
server.listen(7000,"localhost");