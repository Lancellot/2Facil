function base32ToHex(base32) {
  const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  let hex = "";

  for (let i = 0; i < base32.length; i++) {
    const val = base32chars.indexOf(base32.charAt(i).toUpperCase());
    bits += val.toString(2).padStart(5, "0");
  }

  for (let i = 0; i + 4 <= bits.length; i += 4) {
    const chunk = bits.substr(i, 4);
    hex += parseInt(chunk, 2).toString(16);
  }

  return hex;
}

function generateHMAC(keyHex, counterHex) {
  const key = new Uint8Array(keyHex.match(/.{2}/g).map(byte => parseInt(byte, 16)));
  const counter = new Uint8Array(counterHex.match(/.{2}/g).map(byte => parseInt(byte, 16)));

  const cryptoKey = window.crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  return cryptoKey.then(key =>
    window.crypto.subtle.sign("HMAC", key, counter)
  );
}

async function generateTOTP() {
  const secretKey = document.getElementById("secretKey").textContent;

  if (!secretKey) {
    alert("A chave secreta não foi definida no HTML.");
    return;
  }

  const now = new Date(); // Obtém o horário atual do computador
  const timeStep = 30; // Intervalo de 30 segundos
  const epoch = Math.floor(now.getTime() / 1000);
  const counter = Math.floor(epoch / timeStep);

  const keyHex = base32ToHex(secretKey.replace(/ /g, ""));
  const counterHex = counter.toString(16).padStart(16, "0");

  const hmac = await generateHMAC(keyHex, counterHex);
  const hmacArray = new Uint8Array(hmac);

  const offset = hmacArray[hmacArray.length - 1] & 0xf;
  const binary =
    ((hmacArray[offset] & 0x7f) << 24) |
    ((hmacArray[offset + 1] & 0xff) << 16) |
    ((hmacArray[offset + 2] & 0xff) << 8) |
    (hmacArray[offset + 3] & 0xff);

  const totp = (binary % 1000000).toString().padStart(6, "0");

  // Atualiza o TOTP na interface
  document.getElementById("totpCode").textContent = totp;

  // Atualiza os campos de data e hora na interface
  document.getElementById("date").value = now.toISOString().split("T")[0];
  document.getElementById("time").value = now.toTimeString().split(":").slice(0, 2).join(":");
}

// Atualiza o horário automaticamente ao carregar
window.onload = function () {
  generateTOTP(); // Gera o TOTP inicial baseado no horário do computador
};
