let num1, num2, correctAnswer;
let intentos = 0;
let timerInterval, totalTimerInterval;
let timer, totalTimer = 0;
let inicio, totalInicio;
let score = 0;
let targetScore = 0;
let isDifficult = false;
let doublePointThreshold, pointThreshold, maxResponseTime;
let repitiendo = false;
let vidas = 3;
let specials = null;

function loadRecords(setBests) {

    document.querySelectorAll("button").forEach(button => {
        button.disabled = document.getElementById("tipoElegido").selectedIndex === 0;
    });

    ['noob', 'pro', '50', '100', '50_d', '100_d'].forEach( (key, i) => {
        const preKey = document.getElementById("tipoElegido").value;
        if (setBests === 0 ) {
            localStorage.removeItem(`${preKey}_${key}`);  
        } else if (setBests === 1) {
            localStorage.setItem(`${preKey}_${key}`, `${i+1}`); 
        } else {
            const bestTime = localStorage.getItem(`${preKey}_${key}`);
            document.getElementById(`bestTime${key}`).innerText = bestTime ? `${bestTime} s` : '--';
        }
    });

}

loadRecords(2);

function generateSessionId() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
const sessionId = generateSessionId();
document.getElementById("session").innerText = `Sesión: ${sessionId}`;

function selectOption(target, difficult) {
    const nivel = difficult
        ? "dificil"
        : "facil";
    targetScore = target;
    isDifficult = difficult;
    doublePointThreshold = (difficult ? 2 : 3) + (document.getElementById("tipoElegido").selectedIndex - 1);
    pointThreshold = doublePointThreshold * 2;
    maxResponseTime = doublePointThreshold * 3;

    const preKey = document.getElementById("tipoElegido").value;
    let key = `${target}${isDifficult ? '_d' : ''}`;

    if (target === 10) {
        specials = 'pro';
        key = 'pro';
        targetScore = 50;
        document.getElementById("selected").innerHTML = `Seleccionado: PRO NIGHMARE HARDCORE.`;
        document.getElementById("vidas").style.display = "block";
        document.getElementById("vidas").innerHTML = `Vidas restantes: 3.`;
    } else {
        document.getElementById("selected").innerHTML = `Seleccionado: ${target} puntos ${nivel}.`;
    }
    document.getElementById("infoDoble").innerHTML = `Punto doble: ${doublePointThreshold}s.`
    document.getElementById("infoNormal").innerHTML = `Punto normal: ${pointThreshold}s.`
    document.getElementById("infoMaxTime").innerHTML = `Tiempo máx: ${maxResponseTime}s.`

    document.getElementById("startOptions").style.display = "none";
    document.getElementById("records").style.display = "none";
    document.getElementById("container").style.display = "block";

    if (target === 5) {
        specials = 'noob';
        key = 'noob';
        targetScore = 50;
        document.getElementById("selected").innerHTML = `Seleccionado: NOOB.`;
        document.getElementById("infoDoble").style.display = "none";
        document.getElementById("infoNormal").style.display = "none";
        document.getElementById("infoMaxTime").style.display = "none";
    }

    // Mostrar el mejor tiempo para la opción seleccionada
    const bestTime = parseFloat(localStorage.getItem(`${preKey}_${key}`)) || null;
    document.getElementById("bestTime").innerText = bestTime
        ? `Mejor tiempo: ${bestTime.toFixed(1)} s`
        : "Mejor tiempo: --";
    startTotalTimer(); // Iniciar el cronómetro total
    generateProblem();
}
function generateProblem() {
    intentos++;
    clearInterval(timerInterval);
    if (specials != 'noob') document.getElementById("timer").innerText = `Tiempo: 0.0 s`;
    document.getElementById("problem").innerText = "";
    document.getElementById("result").innerText = "";
    document.getElementById("nextButton").style.display = "none";
    document.getElementById("answer").value = "";
    document.getElementById("answer").disabled = false;
    num1 = Math.floor(Math.random() * (9 - 3 + 1)) + 3; // Número entre 3 y 9
    num2 = Math.floor(Math.random() * (9 - 4 + 1)) + 4; // Número entre 4 y 9
    num3 = Math.floor(Math.random() * (9 - 5 + 1)) + 5; // Número entre 5 y 9

    if (document.getElementById("tipoElegido").value === "M") {
        correctAnswer = num1 * num2;
        document.getElementById("problem").innerText = `${num1} x ${num2} = ?`;

    } else if (document.getElementById("tipoElegido").value === "MR") {
        correctAnswer = num1 * num2 - num3;
        document.getElementById("problem").innerText = `( ${num1} x ${num2} ) - ${num3} = ?`;

    } else if (document.getElementById("tipoElegido").value === "D") {
        correctAnswer = num1;
        document.getElementById("problem").innerText = ` ${num1 * num2} / ${num2} = ?`;

    } else if (document.getElementById("tipoElegido").value === "DS") {
        correctAnswer = num1 + num3;
        document.getElementById("problem").innerText = `( ${num1 * num2} / ${num2} ) + ${num3} = ?`;
    }
    document.getElementById("answer").focus();
    startTimer();

}
function startTimer() {
    timer = 0.0;
    inicio = Date.now();
    repitiendo = false;
    if (specials != 'noob') timerInterval = setInterval(() => {
        timer = ((Date.now() - inicio) / 100) / 10.0;
        document.getElementById("timer").innerText = `Tiempo: ${timer.toFixed(1)} s`;
        if (timer >= maxResponseTime) {
            clearInterval(timerInterval);
            handleTimeout();
            document.getElementById("timer").innerText = `Tiempo: ${maxResponseTime.toFixed(1)} s`;
        }
    }, 100);
}
function startTotalTimer() {
    totalTimer = 0.0;
    totalInicio = Date.now();
    totalTimerInterval = setInterval(() => {
        totalTimer = ((Date.now() - totalInicio) / 100) / 10.0;
        document.getElementById("totalTime").innerText = `Tiempo total: ${totalTimer.toFixed(1)} s`;
    }, 100);
}
function stopTotalTimer() {
    document.getElementById("answer").disabled = true;
    clearInterval(totalTimerInterval);
    const preKey = document.getElementById("tipoElegido").value;
    const key = specials  
                ? specials
                : `${targetScore}${isDifficult ? '_d' : ''}`;
    const previousBest = parseFloat(localStorage.getItem(`${preKey}_${key}`)) || Infinity;
    document.getElementById("score").innerText = `Puntuación: ${score} puntos en ${intentos} intentos.`;
    if (totalTimer < previousBest) {
        localStorage.setItem(`${preKey}_${key}`, totalTimer.toFixed(1));
        document.getElementById("bestTime").innerText = `Mejor tiempo: ${totalTimer.toFixed(1)} s`;
        alert(`¡Nuevo récord! Terminaste en ${totalTimer.toFixed(1)} segundos.`);
    } else {
        alert(`Terminaste en ${totalTimer.toFixed(1)} segundos. Tu récord es ${previousBest.toFixed(1)} segundos.`);
    }
}
function handleTimeout() {
    const resultElement = document.getElementById("result");
    if (isDifficult) {
        resultElement.innerText = `Tiempo agotado. Introduce la respuesta correcta para continuar.`;
        document.getElementById("timer").focus();
    } else {
        resultElement.innerText = `Tiempo agotado. La respuesta correcta era ${correctAnswer}.`;
    }
    resultElement.style.color = "red";
    if (!repitiendo) updateScore(-1);
    repite();
}
function handleEnter(event) {
    if (event.key === "Enter") {
        clearInterval(timerInterval);
        const userAnswer = parseInt(document.getElementById("answer").value);
        const resultElement = document.getElementById("result");
        if (userAnswer === correctAnswer) {
            resultElement.style.color = "green";
            if (!repitiendo) {
                if (specials === 'noob') {
                    updateScore(1);
                    resultElement.innerText = "¡Correcto! Has ganado 1 punto.";
                } else {
                    if (timer <= doublePointThreshold) {
                        updateScore(2);
                        resultElement.innerText = "¡Correcto! Has ganado 2 puntos.";
                    } else if (timer <= pointThreshold) {
                        updateScore(1);
                        resultElement.innerText = "¡Correcto! Has ganado 1 punto.";
                    } else {
                        resultElement.innerText = "¡Correcto!";
                    }
                }
            } else {
                resultElement.innerText = "¡Correcto!";
            }
            if (score < targetScore) {
                siguiente();
            } else {
                stopTotalTimer();
            }
        } else {

            if (isNaN(userAnswer)) {
                resultElement.innerText = `Incorrecto. Tu respuesta no era un numero. `;
            } else {
                resultElement.innerText = `Incorrecto. Tu respuesta fue: "${userAnswer}". `;
            }

            if (isDifficult) {
                resultElement.innerText += `Introduce la respuesta correcta para continuar.`;
            } else {
                resultElement.innerText = `La respuesta correcta era ${correctAnswer}.`;
            }

            resultElement.style.color = "red";
            if ((isDifficult || !repitiendo) && specials != 'noob') updateScore(-1);
            if (specials === 'pro') updateVidas(-1);
            repite();
        }
    }
}

function repite() {
    repitiendo = true;
    document.getElementById("answer").value = "";
    if (isDifficult) {
        document.activeElement.blur();
    } else {
        document.getElementById("answer").focus();
    }
}

function siguiente() {
    document.getElementById("answer").disabled = true;
    document.getElementById("nextButton").style.display = "inline-block";
    document.getElementById("nextButton").focus();
}

function updateScore(points) {
    score += points;
    if (score < 0) score = 0;
    document.getElementById("score").innerText = `Puntuación: ${score}`;
}

function updateVidas(points) {
    vidas += points;
    document.getElementById("vidas").innerText = `Vidas restantes: ${vidas}`;
    if (vidas < 1) {
        document.getElementById("result").innerText = `La respuesta correcta era ${correctAnswer}.`;
        document.getElementById("answer").disabled = true;
        clearInterval(totalTimerInterval);
        setTimeout(() => {
            alert(`Te has quedado sin vidas. Vas de PRO y no llegas a NOOB.`);
        }, 1);
    }
}