const ngrok = require("@ngrok/ngrok");

async function main(){
    const listener = await ngrok.forward({ proto: "http",addr: 3001, authtoken: "2gaLlBdNTkqgtb7AlDenlFQkNre_4977z51UKYudRWEtrQ1gG" });
    console.log(listener.url());
}

main();