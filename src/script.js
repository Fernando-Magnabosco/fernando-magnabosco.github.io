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
    textColor(to.red, to.green, to.blue);
    for (var i = 0; i < framerate; i++) {

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