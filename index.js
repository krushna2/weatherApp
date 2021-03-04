const http = require("http");
const fs = require("fs");

var requests = require('requests');
const replaceVal = (tempval,orgVal)=>{
    let temperature = tempval.replace("{%tempvalue%}",orgVal.main.temp-273.15);
    const minTemp = orgVal.main.temp_min-273.15;
    // const minTempCelcius =(minTemp−273.15 );
    const maxTemp = orgVal.main.temp_max-273.15;
    // const maxTempCelcius = (maxTemp - 32) / 1.8;
    temperature = temperature.replace("{%tempmin%}",minTemp);
    temperature = temperature.replace("{%tempmax%}", maxTemp);
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
server.listen(8000,"localhost");