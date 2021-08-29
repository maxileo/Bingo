
const express = require('express');
const socketIO = require('socket.io');

const port=process.env.PORT || 3000;

const server = express()
    .use(express.static('public'))
    .listen(port, ()=> console.log('Listening'));

const io =socketIO(server);
io.on('connection', newConnection);

let gameStarted=false;
let foundLine=false;
let foundBingo=false;

function randomIntFromInterval(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let numereAlese=[];
let posibilitatiNumereDeAles=[];
let nrPosibNrAles=90;
let numereAlesePanaAcum=[];
let k=1;

k=1;
function newConnection(socket)
{
    console.log("we just gone a new one boiiiiii  " + socket.id);

    socket.on("start", start);
    socket.on("linie", checkLinie);
    socket.on("bingo", checkBingo);

    function checkBingo(x)
    {
        if (foundBingo==false)
        {
            let ok=true;
            for (let j=0; j<15; j++)
            {
                if (numereAlesePanaAcum[x[j]]==0)
                    ok=false;
            }
            if (ok==true)
            {
                console.log("bingo");
                socket.emit("correctBingoYou");
                socket.broadcast.emit("correctBingoSomeone");
                clearInterval(alesNumere);
                gameStarted=false;
                foundLine=false;
            }
            else
            {
                socket.emit("wrongBingoYou");
                socket.broadcast.emit("wrongBingoSomeone");
                clearInterval(alesNumere);
                setTimeout(function(){
                    startInterval(socket);
                }, 4000);
            }
            foundBingo=true;
        }
    }

    function checkLinie(x)
    {
        if (foundLine==false && foundBingo==false)
        {
            console.log(x);
            console.log(x[0]);
            let ok=true;
            for (let j=0; j<5; j++)
            {
                if (numereAlesePanaAcum[x[j]]!=1)
                    ok=false;
            }
            if (ok==true)
            {
                if (foundLine==false)
                {
                    console.log("linie corecta");
                    socket.emit("linieCorectaYou");
                    socket.broadcast.emit("linieCorectaSomeone");
                    clearInterval(alesNumere);
                    setTimeout(function(){
                        startInterval(socket);
                    }, 4000);
                    foundLine=true;
                }
            }
            else
            {
                console.log("linie gresita");
                socket.emit("linieGresitaYou");
                socket.broadcast.emit("linieGresitaSomeone");
                clearInterval(alesNumere);
                setTimeout(function(){
                    startInterval(socket);
                }, 4000);
            }
        }
    }
    function start()
    {
        //clearInterval(alesNumere);
        foundBingo=false;
        foundLine=false;
        //numereAlese=[];
        //console.log(numereAlese);
        if (gameStarted==false)
        {
            nrPosibNrAles=90;
            for (let i=1; i<=90; i++)
            {
                posibilitatiNumereDeAles[i]=i;
                numereAlesePanaAcum[i]=0;
                numereAlese[i]=0;
            }
            //console.log(posibilitatiNumereDeAles);
            let hm=1;
            while (nrPosibNrAles>0)
            {
                let rand=randomIntFromInterval(1, nrPosibNrAles);
                numereAlese[hm]=posibilitatiNumereDeAles[rand];
                hm++;
                //console.log(numereAlese[k]);
                for (let j=rand; j<nrPosibNrAles; j++)
                posibilitatiNumereDeAles[j]=posibilitatiNumereDeAles[j+1];
                nrPosibNrAles--;
            }
            console.log("started game");
            k=1;
            startInterval(socket);
            gameStarted=true;
        }
    }

}

let alesNumere;

function startInterval(socket)
{
    //k=1;
    alesNumere=setInterval(function()
        {
            if (k<=90)
            {
                socket.emit("number", numereAlese[k]);
                socket.broadcast.emit("number", numereAlese[k]);
                numereAlesePanaAcum[numereAlese[k]]=1;
                socket.emit("numereAlese", numereAlesePanaAcum);
                socket.broadcast.emit("numereAlese", numereAlesePanaAcum);
            }    
            k++;



            console.log(""+numereAlese[k-1]);
            if (typeof numereAlese[k-1] === 'undefined')
            {
                clearInterval(alesNumere);
                gameStarted=false;
                foundBingo=false;
                foundLine=false;
            }

            if (k>90)
            {
                clearInterval(alesNumere);
                gameStarted=false;
                foundLine=false;
                foundBingo=false;
            }
            //console.log(numereAlesePanaAcum);
        }, 2500);
}