export default function getRandomString(count){
    
    const options = [
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvw",
        "1234567890"
    ]

    function getRandomChar(option){
        const index = Math.floor(Math.random() * option.length);
        return option.charAt(index);
    }

    let result = "";
    while(count > 0){
        const randomOption = options[Math.floor(Math.random() * 2)];
        result += getRandomChar(randomOption);
        count --;
    }

    return result;
}