function init() {

    var input = document.getElementById("hex-input");
    var undo = document.getElementById("undo");
    var random = document.getElementById("random");
    var stack = []; // stack to keep track of all hexa typed;
    var framerate = 60; // frames per second;
    input.placeholder = generateRandomHexa();
    document.body.style.backgroundColor = "rgb(255,255,255)";

    input.addEventListener("input", () => {

        input.placeholder = generateRandomHexa();
        var hexa = input.value;
        if (isValidHexa(hexa)){
            transition(hexa, framerate);
            stack.push(hexa);
        }

    })

    undo.addEventListener("click", () => {

        if (stack.length > 1){
            stack.pop();
            var hexa = stack.pop();
            stack.push(hexa);
            input.value = hexa;
            transition(hexa,framerate);
        }

    })

    random.addEventListener("click", () => {
        let hexa = generateRandomHexa();
        input.value = hexa;
        stack.push(hexa);
        transition(hexa, framerate);
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

    var regex = /[a-f0-9]{6}/i; // regular expression - six-digit hexadecimal;
    if (!regex.test(hexa)) return 0;
    return 1;

}


function isBrightColor(red, green, blue) { // arithmetic mean between red, green and blue > 2^7;

    var result = (red + green + blue) / 3 > (256 / 2);
    return result;

}

function textColor(red, green, blue) { // transforms text acording to contrast;

    var title = document.getElementById("main");
    let contrast = isBrightColor(red, green, blue);
    title.className = contrast ? "wtb" : "btw";
    title.style.color = contrast ? "black" : "white";

}

async function transition(hexa, framerate) { // animation

    var bs = document.body.style;
    var bg = bs.backgroundColor;

    bg = bg.split(",");
    var regex = /[0-9]{1,3}/; // get the r,g,b values from bg string;

    var from = [];
    var progr = [];

    // indexes (arrays from, diff and to): 0 = red, 1 = green, 2 = blue;
    for(var i = 0; i <= 2; i++){
        from[i] = parseInt(bg[i].match(regex));
        progr[i] = parseInt(bg[i].match(regex));
    }

    var to = [parseInt(hexa[0] + hexa[1], 16),parseInt(hexa[2] + hexa[3], 16),parseInt(hexa[4] + hexa[5], 16)];

    textColor(to[0], to[1], to[2]);

    for (var i = 0; i < framerate; i++) {
        for(var j = 0; j <=2; j++)
            progr[j] += (to[j] - from[j]) / framerate;
        bs.backgroundColor = "rgb(" + Math.round(progr[0]) + ", " + Math.round(progr[1]) + ", " + Math.round(progr[1]) + ")";
        await sleep(1000 / framerate);
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


document.addEventListener('DOMContentLoaded', init);