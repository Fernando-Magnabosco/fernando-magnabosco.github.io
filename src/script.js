function init() {

    var input = document.getElementById("hex-input");
    var bg = document.body.style;
    bg.backgroundColor = "rgb(255,255,255)";
    input.placeholder = generateRandomHexa();

    input.addEventListener("input", () => {

        var hexa = input.value;
        if (isValidHexa(hexa))
            transition(hexa, 60);


    })

}

function generateRandomHexa() {

    var chars = "ABCDEF0123456789";
    var result = "";
    for (var i = 0; i < 6; i++)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;

}

function isValidHexa(hexa) {

    var regex = /[a-f0-9]{6}/i; // expressão regular - hexadecimal de seis digitos;
    if (!regex.test(hexa)) return 0;
    return 1;

}


function isBrightColour(red, green, blue) { // média aritmética entre r,g e b
    // maior que metade de 2^8; 

    var result = (red + green + blue) / 3 > (256 / 2);
    return result;

}

function textColour(red, green, blue) { // transforma o texto de acordo com o contraste;

    var title = document.getElementById("main");
    let contrast = isBrightColour(red, green, b);
    title.className = contrast ? "wtb" : "btw";
    title.style.color = contrast ? "black" : "white";

}

async function transition(hexa, framerate) {

    var bs = document.body.style;
    var bg = bs.backgroundColor;

    bg = bg.split(",");

    var regex = /[0-9]{1,3}/;
    var from = {

        red: parseInt(bg[0].match(regex)),
        green: parseInt(bg[1].match(regex)),
        blue: parseInt(bg[2].match(regex))
    };
    var to = {
        red: parseInt(hexa[0] + hexa[1], 16),
        green: parseInt(hexa[2] + hexa[3], 16),
        blue: parseInt(hexa[4] + hexa[5], 16)
    };

    var diff = Object.assign({}, from);
    // var a = Date.now()
    textColour(to.red, to.green, to.blue);
    for (var i = 0; i < framerate; i++) {
        console.log(bs.backgroundColor);
        diff.red += (to.red - from.red) / framerate;
        diff.green += (to.green - from.green) / framerate;
        diff.blue += (to.blue - from.blue) / framerate;
        bs.backgroundColor = "rgb(" + Math.round(diff.red) + ", " + Math.round(diff.green) + ", " + Math.round(diff.blue) + ")";
        await sleep(1000 / framerate);
    }
    // console.log(Date.now()-a + " miliseconds");




}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


document.addEventListener('DOMContentLoaded', init);