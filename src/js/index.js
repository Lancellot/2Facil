    const totp = await generateTOTPForUser(user);

    const listItem = document.createElement("div");
    listItem.innerHTML = `
      <strong>Nome:</strong> ${user.userName} <br>
      <strong>Número de OAB:</strong> ${user.oabNumber} <br>
      <strong>Código TOTP:</strong> ${totp}
    `;
    authListContainer.appendChild(listItem);
  }
}

// Função para atualizar o relógio
function updateClock() {
  const clockElement = document.getElementById("clock");
  const dateElement = document.getElementById("date");
  const now = new Date();

  // Exibe o tempo no formato de hora e minuto
  clockElement.textContent = now.toLocaleTimeString();
  dateElement.textContent = now.toLocaleDateString();
}

// Função para atualizar o temporizador
function updateTimer() {
  const timerElement = document.getElementById("timer");
  const timeStep = 30;
  const now = new Date();
  const secondsRemaining = timeStep - (now.getSeconds() % timeStep);

  // Exibe a contagem regressiva
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Atualiza os TOTPs a cada 30 segundos
setInterval(generateAllTOTPs, 30000);

// Atualiza o relógio e o timer a cada segundo
setInterval(() => {
  updateClock();
  updateTimer();
}, 1000);

// Carregar a página com os TOTPs
window.onload = function () {
  generateAllTOTPs(); // Gera todos os TOTPs para os usuários
  
  updateTimer(); // Atualiza o temporizador
};

function updateTimer() {
  const timerElement = document.getElementById("timer");
  const timeStep = 30; // Intervalo de 30 segundos
  const now = new Date();
  const secondsElapsed = now.getSeconds(); // Segundos já passados no minuto
  const secondsRemaining = timeStep - (secondsElapsed % timeStep); // Segundos restantes no ciclo de 30s

  // Exibe a contagem regressiva
  timerElement.textContent = `${String(secondsRemaining).padStart(2, '0')}s`;

  // Se atingir zero, recarregue a página
  if (secondsRemaining === 30) {
    location.reload(); // Recarrega a página para atualizar tudo
  }
}

// Atualiza o timer a cada segundo
setInterval(updateTimer, 1000);
