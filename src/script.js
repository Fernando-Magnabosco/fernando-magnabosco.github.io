function init() {

    var input = document.getElementById("hex-input");
    var undo = document.getElementById("undo");
    var random = document.getElementById("random");
    var fade = document.getElementById("fade");
    var stop = true;
    var stack = ["FFFFFF"]; // stack to keep track of all hexa typed;
    var framerate = 60; // frames per second;

    input.placeholder = generateRandomHexa();
    document.body.style.backgroundColor = "rgb(255,255,255)";
    boxColor(isBrightColor(255, 255, 255));


    input.addEventListener("input", () => {

        stop = true;
        input.placeholder = generateRandomHexa();
        var hexa = input.value;
        if (isValidHexa(hexa)) {
            update(stack, hexa, framerate);

        }

    })

    input.addEventListener("click", () => {

        if (!input.value.length) {
            var hexa = input.placeholder;
            input.value = input.placeholder;
            update(stack, hexa, framerate);
        }

    })

    var parity = false;
    undo.addEventListener("click", () => {
        stop = true;
        if (stack.length > 1) {
            stack.pop();
            var hexa = stack.pop();
            input.value = hexa;
            update(stack, hexa, framerate);
        }
        if (!parity)
            var targetH = 45 * stack.length + 45;
        else
            var targetH = 45;

        var start = parseInt(undo.style.height);
        var stackIndex = 0;
        var interval = setInterval(() => {
            if (parseInt(undo.style.height) == targetH) clearInterval(interval);
            undo.style.height = parseFloat(undo.style.height) + (targetH - start) / framerate + "%";
            if (parseInt(undo.style.height) / targetH > stackIndex / stack.length) {
                var button = document.createElement("button");
                button.innerText = stackIndex;
                button.classList.add("round-corners");
                undo.appendChild(button);
                stackIndex++;
            }
        }, 10 / framerate);

        parity = !parity;


    })

    fade.addEventListener("click", async () => {

        stop = !stop;

        if (input.value = "fading") input.value = "paused";
        while (!stop) {

            var hexa = generateRandomHexa();
            input.value = "fading"
            await update(stack, hexa, framerate);
        }


    })

    random.addEventListener("click", () => {
        stop = true;
        var hexa = generateRandomHexa();
        input.value = hexa;
        update(stack, hexa, framerate);
    })

}

async function update(stack, hexa, framerate) {

    push(stack, hexa);
    buttonColor(stack, undo);
    await transition(hexa, framerate);

}

function push(stack, value) {

    if (stack.length < 5) stack.push(value);

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

function textColor(contrast) { // transforms text acording to contrast;

    var title = document.getElementById("main");
    title.className = contrast ? "wtb" : "btw";
    title.style.color = contrast ? "black" : "white";

}

function boxColor(contrast) {

    var div = document.getElementById("boxes");
    for (var i = 0; i < div.children.length; i++) {
        div.children[i].classList.toggle("bg-wtb", contrast);
        div.children[i].classList.toggle("bg-btw", !contrast);
        div.children[i].style.backgroundColor = contrast ? "black" : "white";
    }
}

function buttonColor(stack, button) { // transforms button according to stack size;

    if (stack.length > 1) button.classList.remove("unclickable");
    else button.classList.add("unclickable");

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function transition(hexa, framerate) { // animation

    var bs = document.body.style;
    var bg = bs.backgroundColor;
    var div = document.getElementById("boxes");
    bg = bg.split(",");
    var regex = /[0-9]{1,3}/; // get the r,g,b values from bg string;

    var from = [];  // initial colors;
    var to = [];    // end colors;
    var progr = []; // progress;

    // indexes (arrays from, diff and to): 0 = red, 1 = green, 2 = blue;
    for (var i = 0; i <= 2; i++) {
        from[i] = parseInt(bg[i].match(regex));
        progr[i] = from[i];
        to[i] = parseInt(hexa[2 * i] + hexa[2 * i + 1], 16);
    }


    var contrast = isBrightColor(to[0], to[1], to[2]);
    textColor(contrast);
    boxColor(contrast);

    for (var i = 0; i < framerate; i++) {
        for (var j = 0; j <= 2; j++)
            progr[j] += (to[j] - from[j]) / framerate;

        var string = "rgb(" + Math.round(progr[0]) + ", " + Math.round(progr[1]) + ", " + Math.round(progr[2]) + ")";
        bs.backgroundColor = string;

        for (var j = 0; j < div.children.length; j++)
            div.children[j].style.color = string;



        await sleep(1000 / framerate);
    }

}



document.addEventListener('DOMContentLoaded', init);