
    // --- VARIABILI ---

    window.onload = function(){
        document.body.className += "caricata"
    }

//classe segni 
const classex = "x";
const classeo = "o";
let difficolta = "";

//tutte le possibili combinazioni che portano un giocatore alla vittoria
const combinazioniVincenti = [

    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]

]
// senza la linea "defer" in html questo comando non funzionerebbe !
// querySelectorAll ritorna tutti gli elementi che hanno data-* all'interno del file HTML (serve 'defer')
// in questa sezione importiamo tutti gli elementi di HTML che dovranno essere letti e modificati (quadranti,area di gioco e messaggi)
const quadrantielm = document.querySelectorAll('[data-quadrante]');
const areaGioco = document.getElementById('areaGioco');
const messaggioVittoriaTesto = document.querySelector('[data-messagioVittoriaTesto');
const messaggioVittoria = document.getElementById('messaggioVittoria');
const restartPuls = document.getElementById('pulsanteRestart');
const PulsantiScelta = document.getElementById('PulsantiScelta');
const iniziaO = document.getElementById('iniziaO');
const diffFacile = document.getElementById('facile');

const diffDifficile = document.getElementById('difficile');
// variabile che farà da "pendolo" per gestire lo scambio dei turni
let turnoCerchio;

    // --- CODICE --- 
// Attesa Della scelta tra chi deve pertire
iniziaO.addEventListener('click',AttendiScelta);

// Impostazioni per la difficoltà
diffFacile.addEventListener('click',cambiaDifficolta);
diffDifficile.addEventListener('click',cambiaDifficolta);
 difficolta = 'difficile';
diffDifficile.classList.add('attivato');
// funzione che svuota la griglia ed aggiunge eventListeners per la pressione dei quadranti
inizioGioco();

//imposta l'eventListener nel pulsante di restart
restartPuls.addEventListener('click',inizioGioco);

// imposta l'areae di gioco per l'inizio della partita
function inizioGioco(){
    turnoCerchio = false;
   
    // richiama la funzione una sola volta dopo la pressione di una cella
    quadrantielm.forEach(quadrante => {
    // Svuota la griglia ( serve per reset, ad inizio 1° gioco sarà impercettibile)
    quadrante.classList.remove(classex);
    quadrante.classList.remove(classeo);    
    quadrante.removeEventListener('click',gestisciClick)
    // aggiunge eventi che rilevano la pressione di un pulsante i quali richiameranno poi la funzione "gestisci Click"
    quadrante.addEventListener('click', gestisciClick, {once: true});   
    })

    // abilita la griglia per mostrare gli effetti di hover creati in CSS 
    effettiHover();

    // Resetta Il gioco
    messaggioVittoria.classList.remove('vittoria');

if ( turnoCerchio == true){
    loopPossMov();
}

}

function AttendiScelta (){
    turnoCerchio = true;
    loopPossMov();
    PulsantiScelta.classList.add('invisibile');
    iniziaO.removeEventListener('click',AttendiScelta);
}

// questa si può definire come la "funzione principale", viene richiamata ad ogni click e richiama di conseguenza le altre funzioni
// che avranno i loro scopi, come controllare lo stato del gioco, piazzare segni e cambiare il giocatore attivo

 function gestisciClick (e) {

    PulsantiScelta.classList.add('invisibile');
    iniziaO.removeEventListener('click',AttendiScelta);
    //contiene il quadrante che è stato premuto, tutto ritornato dagli eventListener impostati nella funzione di InizioGioco
    const quadranteBers = e.target;
    //controlla di chi è il turno attuale a cambia lo stato di classeattuale
    //const classeattuale = turnoCerchio ? classeo : classex;
    
    //piazzare segno
    piazzaSegno(quadranteBers,classex);
    
    turnoCerchio = false;
    //controllare stato vittoria
    if(ControlloVittoria(classex)){
        fineGioco(false);
    } 
    //controlla stato stallo
    else if(èpareggio()){
        fineGioco(true);
    } else {
    //scambio turni
    scambiaTurni();

    effettiHover();

    // MINIMAX
    loopPossMov();
    }
    
    
 }

 /* in base al bersaglio inviato dalla funzione gestisciClick
    entra la lista di classi del bersaglio e lo modifica aggiungendo 
    la "o" o la "x" nell nome della classe, in questo modo il CSS 
    renderizzerà quel particolare quadrante con una x o una o dentro */
 function piazzaSegno(quadranteBers){
    quadranteBers.classList.add(classex);
 }

 //Scambia il turno...
 function scambiaTurni(){
    turnoCerchio = !turnoCerchio;
    
 }

 // rimuove ogni tipo di aggiunta al nome della classe e lo rimpiazza 
 // con l'attuale segno per gli effetti di hover
 // (NB: modificando il "nome" della classe dell'area di gioco otteniamo gli effetti di hover mentre modificando il nome della classe dei singoli quadranti otteniamo l'effettivo segno (grazie al CSS programmato prima))
 function effettiHover(){
    areaGioco.classList.remove(classex); // <- NB: modifichiamo l'area di gioco e non i quadranti altrimenti il simbilo non sarebbbe in "stile hover"
    areaGioco.classList.remove(classeo);

    
    areaGioco.classList.add(classex);
    

 }

function ControlloVittoria(classAtt){
    
    // .some ritorna true se trova un l'elemento dell array che ritorna true data la funzione all'interno di some
    // dunque questa funzione controlla se in ogni combinazione vincente ci sono tutti i segni uguali alla classe attuale (che è anche il segno del giocatore che sta al momento giocando)
    return combinazioniVincenti.some(combinazione => {
        // every controlla che ogni elemento in un array soddisfi una condizione
        return combinazione.every(index => {
            //ritorna vero per ogni elemento dell'array che contiene il segno attuale, se non ritorna vero in ogni caso il controllo tornerà falso al termine
            
            return quadrantielm[index].classList.contains(classAtt);
        })
    })
}

// Modifica il testo della pagina di vittoria in base al risultato della partita e mostra il risultato alla fine
function fineGioco(pareggio){

    if(pareggio){
        messaggioVittoriaTesto.innerText = "Pareggio !"
    }else{
        messaggioVittoriaTesto.innerText = (turnoCerchio ? "O" : "X") + " Vince!";
    }
    // lo so, tecnicamente non è sempre una vittoria e sarebbe da cambiare il nome 
    messaggioVittoria.classList.add('vittoria');
    PulsantiScelta.classList.remove('invisibile');
iniziaO.addEventListener('click',AttendiScelta);
}

function èpareggio(){
    // controlla tutti i quadranti e verifica che siano tutti riempiti
    // dato che quadrantielm non ha un metodo "every" bisogna decostruirlo in un array
    return [...quadrantielm].every(quadrante => {
        return quadrante.classList.contains(classex) || quadrante.classList.contains(classeo)
    })
}

function loopPossMov(){
    let miglrpunteggio = -Infinity;
    let miglrMossa;
    // richerca tra tutti i quadranti quelli liberi
    for(let i=0;i < quadrantielm.length;i++){
        if(quadrantielm[i].className == "quadrante"){
           
            // quando trova un quadrante libero aggiunge la mossa, calcola minimax e rimuove la mosssa aggiunta per poi calcolare il punteggio
            // NB: questo si ripete per ogni quandrante libero
            quadrantielm[i].classList.add(classeo);
            let punteggio = minimax(quadrantielm,0,-Infinity,+Infinity,false);
            quadrantielm[i].classList.remove(classeo);
            if(punteggio > miglrpunteggio){
                miglrpunteggio = punteggio;
                miglrMossa = quadrantielm[i];
            }
        }
    }
    
    turnoCerchio = true;
    miglrMossa.classList.add(classeo);
    miglrMossa.removeEventListener('click', gestisciClick, {once:true});
    //ri-controllare stato vittoria
    if(ControlloVittoria(classeo)){
        fineGioco(false);
    } 
    //controlla stato stallo
    else if(èpareggio()){
        
        fineGioco(true);
    } else {
    //scambio turni
    scambiaTurni();

    effettiHover();
    }
    scambiaTurni();
    
}

/* la funzione minimax controlla ogni possibile movimento recursivamente, una volta che gioca tutte le possibili partite
    le compara tra di loro in base al risultato (vinto,perso o pareggio) e ritorna Solo le mosse che portano ad una vittoria.
*/

function minimax(quadrantielm,profondita,alpha,beta,emassimizzatore){

    // condizione che termina la ricursione
if(ControlloVittoria(classeo) ){
   
    return +100 - profondita;
} else if (ControlloVittoria(classex) ){
    
    return profondita -100;
} else if (èpareggio()){
  
    return 0;
}

// se la difficoltà è impostata su possibile l'agoritmo viene limitato
if(difficolta == "facile" && profondita > 1){
    return 0;
}


// quando è il turno del massimizzatore si intende il turno dell'AI
if(emassimizzatore){
   
    let PunteggioMilgr = -Infinity;
    // analizza ogni quadrante e se vuoto piazza il segno e richiama nuovamente la funzione cambiando il turno così al prossimo ciclo di ricursione minimax calcolerà in base alla mossa dell avversario umano
    for(let i=0;i<quadrantielm.length;i++){

        if(quadrantielm[i].className == 'quadrante'){
            quadrantielm[i].classList.add(classeo);
            
            let puntegg = minimax(quadrantielm, profondita +1, alpha,beta, false);
            quadrantielm[i].classList.remove(classeo);
            PunteggioMilgr = Math.max(puntegg,PunteggioMilgr) ;
            alpha = Math.max(alpha, puntegg);
            if( beta <= alpha){
                break;               
            }
        }

    }
    // ritornare il punteggio dopo averlo comparato farà "salire" il punteggio migliore attraverso le catene di ricursione
    return PunteggioMilgr;
} else {
    
    let PunteggioMilgr = Infinity;
    for(let i=0;i<quadrantielm.length;i++){

        if(quadrantielm[i].className == 'quadrante'){
            quadrantielm[i].classList.add(classex);
            let puntegg = minimax(quadrantielm, profondita +1,alpha,beta, true);
            quadrantielm[i].classList.remove(classex);
            PunteggioMilgr = Math.min(puntegg, PunteggioMilgr) ;
            
            beta = Math.min(beta,puntegg);
            if(beta <= alpha){
                break;
            }
        }

    }
    
    return PunteggioMilgr;

}



}

function cambiaDifficolta(str){

    switch(str.target.id){
        case "facile":
            diffFacile.classList.add('attivato');
            diffDifficile.classList.remove('attivato');
            difficolta = "facile";
        break;
        case "difficile":
            diffFacile.classList.remove('attivato');
            diffDifficile.classList.add('attivato');
            difficolta = "difficile";
        break;
        default:
            console.log("Errore Funzione Difficoltà");
        break;
    }
    
}
    

