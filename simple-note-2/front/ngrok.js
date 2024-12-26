const ngrok = require("@ngrok/ngrok");

(async function() {
    const front = await ngrok.forward({ 
        addr: 3000, 
        authtoken: "2gaLlBdNTkqgtb7AlDenlFQkNre_4977z51UKYudRWEtrQ1gG",
    });

    const back = await ngrok.forward({ 
        addr: 8000, 
        authtoken: "2gaLlBdNTkqgtb7AlDenlFQkNre_4977z51UKYudRWEtrQ1gG",
    });

    console.log(front.url(), back.url());
})()

process.stdin.resume();
