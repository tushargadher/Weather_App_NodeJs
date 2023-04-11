const http = require('http');
const fs = require('fs');
const requests = require('requests');
const port = "5000";
const hostname = "localhost";

const htmlFile = fs.readFileSync('home.html', 'utf-8');
const errorPage = fs.readFileSync('404.html', 'utf-8');
// console.log(htmlFile);

const replaceVal = (tempVal, orgVal) => {

    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);
    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests('https://api.openweathermap.org/data/2.5/weather?q=surat&appid=19479dfda8faeaf3d46205f944706655')
            .on('data', (chunk) => {
                // console.log(chunk);
                const parseData = JSON.parse(chunk);
                const arrData = [parseData];
                // res.end(arrData);
                // console.log(arrData);
                const realTimeData = arrData.map((val) => replaceVal(htmlFile, val)).join("");
                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }

    else {
        res.end(errorPage);
    }

});

server.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
}) 