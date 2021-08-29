
let socket;

let casute=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
let bifate=[];
let alese=[];

let posibilitati=[];
let nrPosibilitati=90;
let cifre=[];

function numereAlese(x)
{
    for (let i=1; i<=90; i++)
    {
        if (x[i]==1)
        {
            numereMici[i-1].style.color="black";
        }
        else
            numereMici[i-1].style.color="white";
    }
}

function newBilet()
{
    for (let i=0; i<=27; i++)
    {
        bifate[i]=0;
        casute[i]=0;
    }

    for (let i=0; i<butoane.length; i++)
    {
        butoane[i].classList.remove("column2");
        butoane[i].classList.add("column");
    }

    for (let i=1; i<=90; i++)
    {
        posibilitati[i]=i;
    }
    nrPosibilitati=90;

    for (let i=0; i<=9; i++)
        cifre[i]=0;

    function randomIntFromInterval(min, max) 
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // punem prima oara cate un numar pe fiecare coloana
    for (let j=0; j<9; j++)
    {
        let numarRandom=randomIntFromInterval(j*10+1, (j+1)*10);
        alese[j]=numarRandom;
        let k=1;
        while (posibilitati[k]!=numarRandom)
            k++;
        for (; k<nrPosibilitati; k++)
            posibilitati[k]=posibilitati[k+1];
        nrPosibilitati--;
    }

    // alegem restul de numere
    for (let j=9; j<15; j++)
    {
        let numarRandom=Math.floor((Math.random() * nrPosibilitati) + 1);
        alese[j]=posibilitati[numarRandom];
        let care=Math.floor(alese[j]/10);
        if (alese[j]%10==0)
            care--;
        cifre[care]++;
        
        // sa nu avem mai mult de 3 pe aceeasi coloana
        if (cifre[care]>2)
        {
            j--;
            cifre[care]--;
        }
        else
        {
            // aici scoatem numarul ales din posibilitati
            for (let k=numarRandom; k<nrPosibilitati; k++)
                posibilitati[k]=posibilitati[k+1];
            nrPosibilitati--;
        }
    }
    // sortam vectorul de numere alese
    alese.sort(function(a, b){return a - b});
    
    // stergem orice innerText
    for (let k=0; k<numere.length; k++)
        numere[k].innerText="";

    // gasim o configurare buna a pozitiilor
    gasit=0;
    configuram(0);

    // punem numerele pe locurile lor
    let nrCol=0;
    for (let i=0; i<15; i++)
    {
        if (i>0)
        {
            let a=Math.floor(alese[i]/10);
                if (alese[i]%10==0)
                    a--;
            let b=Math.floor(alese[i-1]/10);
                if (alese[i-1]%10==0)
                    b--;
            if (a>b)
                nrCol++;
        }

        let ceCol=cepozitii[i]-1;
        let val=ceCol*9+nrCol;
        casute[val]=alese[i];
        numere[val].innerText=alese[i];
    }

    for (let i=0; i<butoane.length; i++)
    {
        if (casute[i]==0)
            butoane[i].classList.add("column2");
    }
}


window.onload=()=>{

    socket=io();

    socket.on('number', newNumber);
    socket.on("linieCorectaYou", linieCorectaYou);
    socket.on("linieCorectaSomeone", linieCorectaSomeone);
    socket.on("linieGresitaYou", linieGresitaYou);
    socket.on("linieGresitaSomeone", linieGresitaSomeone);
    socket.on("correctBingoYou", bingoCorectYou);
    socket.on("correctBingoSomeone", bingoCorectSomeone);
    socket.on("wrongBingoYou", bingoGresitYou);
    socket.on("wrongBingoSomeone", bingoGresitSomeone);

    socket.on("numereAlese", numereAlese);

    newBilet();
    
}

function newNumber(data)
{
    numarAles.innerText=data;
}

var ticket=document.getElementById("ticket");

var start=document.getElementById("start");
var info=document.getElementById("informatii");
var numarAles=document.getElementById("numarAles");

var numereMici=document.getElementsByClassName("numarMic");

var numere=document.getElementsByClassName('number');
var butoane=document.getElementsByClassName('column');
var completed=document.getElementsByClassName('completed');
var linieB=document.getElementById("linie");
var bingoB=document.getElementById("bingo");
linieB.addEventListener("click", ()=>{checkLine();});
bingoB.addEventListener("click", ()=>{checkBingo();});
start.addEventListener("click", ()=>{startGame();});
ticket.addEventListener("click", ()=>{changeTicket();});

for (let i=0; i<butoane.length; i++)
{
    butoane[i].addEventListener("click", ()=>{
        clicked(i);
    });
}

function linieCorectaYou(){
    info.innerText="CORRECT LINE, CONGRATULATIONS!";
    setTimeout(function(){
        info.innerText="";
    }, 3900);
}
function linieCorectaSomeone(){
    info.innerText="SOMEONE JUST GOT A CORRECT LINE!";
    setTimeout(function(){
        info.innerText="";
    }, 3900);
}
function linieGresitaYou(){
    info.innerText="WRONG LINE, BE MORE CAREFUL!";
    setTimeout(function(){
        info.innerText="";
    }, 3900);
}
function linieGresitaSomeone(){
    info.innerText="SOMEONE JUST GOT A WRONG LINE!";
    setTimeout(function(){
        info.innerText="";
    }, 3900);
}

function bingoCorectYou(){
    gameIsStarted=false;
    info.innerText="CORRECT BINGO, CONGRATULATIONS!";
    setTimeout(function(){
        info.innerText="";
    }, 3900);
}
function bingoCorectSomeone(){
    gameIsStarted=false;
    info.innerText="SOMEONE JUST GOT BINGO!";
    setTimeout(function(){
        info.innerText="";
    }, 3900);
}
function bingoGresitYou(){
    info.innerText="WRONG BINGO, BE MORE CAREFUL!";
    setTimeout(function(){
        info.innerText="";
    }, 3900);
}
function bingoGresitSomeone(){
    info.innerText="SOMEONE JUST GOT A WRONG BINGO!";
    setTimeout(function(){
        info.innerText="";
    }, 3900);
}

function changeTicket()
{
    if (gameIsStarted==false)
        newBilet();
}


let indici=[];
let ind=0;

function checkBingo()
{
    k=0;
    let numereBingo=[];
    for (let i=0; i<27; i++)
    {
        if (casute[i]!=0 && bifate[i]==1)
        {
            numereBingo[k]=casute[i];
            k++;
        }
    }
    if (k==15)
        socket.emit("bingo", numereBingo);
}

let gameIsStarted=false;
function startGame()
{
    socket.emit("start");
    gameIsStarted=true;
}

function checkLine()
{
    let nu=false;
    let h=0;
    for (let i=0; i<3; i++)
    {
        nu=false;
        h=0;
        for (let nrCol=0; nrCol<9; nrCol++)
        {
            let val=i*9+nrCol;
            if (bifate[val]==0 && casute[val]!=0)
                nu=true;
            if (casute[val]!=0)
            {
                indici[h]=val;
                h++;
            }
        }
        // daca avem o linie complet umpluta
        if (nu==false)
        {
            console.log("avem linie boiiii");
            for (let j=0; j<5; j++)
               completed[indici[j]].style.backgroundColor="rgb(252, 196, 28)";
            let numereLinie=[];
            for (let j=0; j<5; j++)
            {
                numereLinie[j]=casute[indici[j]];
            }
            socket.emit("linie", numereLinie);
            
            // sa le punem inapoi culoarea coral
            setTimeout(function(){ schimbaCuloarea(i); }, 1500);
        }
    }
}
// schimbam culoarea la loc
function schimbaCuloarea(i)
{
    let h=0;
    for (let nrCol=0; nrCol<9; nrCol++)
        {
            let val=i*9+nrCol;
            if (casute[val]!=0)
            {
                indici[h]=val;
                h++;
            }
        }
    for (let j=0; j<5; j++)
        completed[indici[j]].style.backgroundColor="coral";
}

function clicked(h)
{
    if (casute[h]!=0)
    {
        if (bifate[h]==0)
        {
            completed[h].style.display="block";
            numere[h].style.color="white";
            bifate[h]=1;
        }
        else
        {
            completed[h].style.display="none";
            numere[h].style.color="coral";
            bifate[h]=0;
        }
    }
}



let cepozitii=[];
let unde=[];
let nr=[0, 0, 0, 0];
let gasit=0;
function configuram(k)
{
    if (gasit<1)
    {
        if (k==15)
        {
            let nr1=0, nr2=0, nr3=0;
            for (let i=0; i<15; i++)
            {
                if (unde[i]==1)
                    nr1++;
                if (unde[i]==2)
                    nr2++;
                if (unde[i]==3)
                    nr3++;
            }
            if (nr1==5 && nr2==5 && nr3==5)
            {
                let i;
                for (i=1; i<15; i++)
                {
                    let a=Math.floor(alese[i]/10);
                    if (alese[i]%10==0)
                        a--;
                    let b=Math.floor(alese[i-1]/10);
                    if (alese[i-1]%10==0)
                            b--;
                    let c;
                    if (i>=2)
                    {
                        c=Math.floor(alese[i-2]/10);
                            if (alese[i-2]%10==0)
                                c--;
                    }
                    if (a==b && unde[i]==unde[i-1])
                        break;
                    if (i>=2)
                        if (a==c && unde[i]==unde[i-2])
                            break;
                }
                if (i==15)
                {
                    //console.log(unde);
                    gasit++;
                    for (let i=0; i<15; i++)
                        cepozitii[i]=unde[i];
                    return;
                }
            }
        }
        else
        {
            unde[k]=1;
            configuram(k+1);
            unde[k]=2;
            configuram(k+1);
            unde[k]=3;
            configuram(k+1);
        }
    }
}