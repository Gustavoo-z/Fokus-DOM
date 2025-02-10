const html = document.querySelector('html');
const botaoFoco = document.querySelector('.app__card-button--foco');
const botaoCurto = document.querySelector('.app__card-button--curto');
const botaoLongo = document.querySelector('.app__card-button--longo');
const timer = document.querySelector('#timer');
const imagem = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const botaoMusica = document.getElementById('alternar-musica');
const musica = new Audio('/sons/luna-rise-part-one.mp3');
const pause = new Audio('/sons/pause.mp3');
const play = new Audio('/sons/play.wav');
const beep = new Audio('/sons/beep.mp3');
musica.loop = true;
const botaoComecar = document.getElementById('start-pause');
let intervaloId = 0;
let tempoDecorrido = 1500;
const iniciarOuPausarBotao = document.querySelector('#start-pause span');
const iniciarOuPausarImg = document.querySelector('#start-pause img');

botaoMusica.addEventListener('change', () => {
    if(musica.paused) {
        musica.play()
    } else {
        musica.pause()
    }
})

botaoFoco.addEventListener('click', () => {
    tempoDecorrido = 1500;
    alterarContexto('foco');
    botaoFoco.classList.add('active');
})

botaoCurto.addEventListener('click', () => {
    tempoDecorrido = 300;
    alterarContexto('descanso-curto');
    botaoCurto.classList.add('active');
})

botaoLongo.addEventListener('click', () => {
    tempoDecorrido = 900;
    alterarContexto('descanso-longo');
    botaoLongo.classList.add('active');
})

function alterarContexto(contexto) {
    mostrarTempo()
    botoes.forEach(function (contexto) {
        contexto.classList.remove('active');
    })
    html.setAttribute('data-contexto', contexto);
    imagem.setAttribute('src', `/imagens/${contexto}.png`);
    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>`
            break;
        case 'descanso-curto': 
        titulo.innerHTML = `Que tal dar uma respirada?<br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>`
            break;
        case 'descanso-longo':
            titulo.innerHTML = `Hora de voltar à superfície<br>
                <strong class="app__title-strong">Faça uma pausa longa.</strong>`
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if(tempoDecorrido <= 0) {
        beep.play()
        alert('Tempo finalizado')
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado')
            document.dispatchEvent(evento)
        }
        zerar()
        return;
    }
    tempoDecorrido -= 1;
    mostrarTempo()
}

botaoComecar.addEventListener('click', iniciarOuPausar)

function iniciarOuPausar() {
    if (tempoDecorrido === 0) {
        tempoDecorrido = 1500;
    }
    if(intervaloId) {
        pause.play()
        zerar()
        return;
    }
    play.play()
    intervaloId = setInterval(contagemRegressiva, 1000)
    iniciarOuPausarBotao.textContent = 'Pausar';
    iniciarOuPausarImg.src = '/imagens/pause.png'
}

function zerar() {
    clearInterval(intervaloId)
    iniciarOuPausarBotao.textContent = 'Começar';
    iniciarOuPausarImg.src = '/imagens/play_arrow.png'
    intervaloId = null
}

function mostrarTempo() {
    const tempo =  new Date(tempoDecorrido * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'})
    timer.innerHTML = `${tempoFormatado}`
}

mostrarTempo()