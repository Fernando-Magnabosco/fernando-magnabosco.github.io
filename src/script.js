var framerate = 60; // frames per second;
var divStack = document.getElementById("stack");


function init() {
    
    var stop = true;
    
    var input = document.getElementById("hex-input");
    var random = document.getElementById("random");
    var sButton = document.getElementById("sbutton");
    var fade = document.getElementById("fade");

    var stack = []; // stack to keep track of all hexa typed;

    input.placeholder = generateRandomHexa();
    document.body.style.backgroundColor = "rgb(255,255,255)";
    boxColor(isBrightColor(255, 255, 255));

    var parity = false;
    sButton.addEventListener("click", ()=>{
        
        if(!parity){
            sButton.children[0].classList.add("r-180");
            sButton.children[0].classList.remove("r-360");
            sButton.children[0].style.transform = "rotate(180deg)";
        } else{
            sButton.children[0].classList.add("r-360");
            sButton.children[0].classList.remove("r-180");
            sButton.children[0].style.transform = "rotate(360deg)";
        }
        if(parity) while(divStack.children.length > 1) divStack.removeChild(divStack.lastChild);
        else updateStack(divStack,stack);
        parity = !parity;
    });

    input.addEventListener("input", () => {

        stop = true;
        input.placeholder = generateRandomHexa();
        var hexa = input.value;
        if (isValidHexa(hexa)) {
            update(stack, hexa);

        }

    })

    input.addEventListener("click", () => {

        if (!input.value.length) {
            var hexa = input.placeholder;
            input.value = input.placeholder;
            update(stack, hexa);
        }

    })

    fade.addEventListener("click", async () => {

        stop = !stop;

        if (input.value = "fading") input.value = "paused";
        while (!stop) {

            var hexa = generateRandomHexa();
            input.value = "fading"
            await update(stack, hexa);
        }


    })

    random.addEventListener("click", () => {
        stop = true;
        var hexa = generateRandomHexa();
        input.value = hexa;
        update(stack, hexa);
    })

}

function updateStack(div,stack){

    while(div.children.length > 1) div.removeChild(div.lastChild);
    for(let i = 0; i < stack.length; i++){

        var button = document.createElement("button");
        button.classList = "round-corners stack-child";
        button.style.height = div.height;
        button.style.backgroundColor = stack[i];
        button.addEventListener("click", ()=>{
            update(stack,stack[i]);
        })
        div.appendChild(button);
    }

}

async function update(stack, hexa) {

    push(stack, hexa);
    await transition(hexa);

}

function push(stack, value) {

    stack.push(value);
    if(stack.length > 5)
        stack.shift();

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
        console.log(div.children[2].children);
        if(i == 2) var child = div.children[i].children[0];
        else var child = div.children[i];
        child.classList.toggle("bg-wtb", contrast);
        child.classList.toggle("bg-btw", !contrast);
        child.style.backgroundColor = contrast ? "black" : "white";
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function transition(hexa) { // animation

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
            {
            div.children[j].style.color = string;
            if(j == 2) div.children[j].children[0].style.color = string;
        }


        await sleep(1000 / framerate);
    }

}



document.addEventListener('DOMContentLoaded', init);