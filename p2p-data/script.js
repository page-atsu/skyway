const Peer = window.Peer;

(async function main() {
  const localId = document.getElementById('js-local-id');
  const localText = document.getElementById('js-local-text');
  const connectTrigger = document.getElementById('js-connect-trigger');
  const closeTrigger = document.getElementById('js-close-trigger');
  const sendTrigger1 = document.getElementById('js-send-trigger1');
  const sendTrigger2 = document.getElementById('js-send-trigger2');
  const remoteId = document.getElementById('js-remote-id');
  const messages = document.getElementById('js-messages');
  const meta = document.getElementById('js-meta');
  const sdkSrc = document.querySelector('script[src*=skyway]');
  
  const now = new Date();
  const year =  now.year();
  console.log(year);
  
  meta.innerText = `
    UA: ${navigator.userAgent}
    SDK: ${sdkSrc ? sdkSrc.src : 'unknown'}
  `.trim();

  const peer = (window.peer = new Peer({
    //key: window.__SKYWAY_KEY__,
    key: '39f05a53-160c-4ffd-a468-11cdc3be64ef',
    debug: 3,
  }));

  // Register connecter handler
  connectTrigger.addEventListener('click', () => {
    // Note that you need to ensure the peer has connected to signaling server
    // before using methods of peer instance.
    if (!peer.open) {
      return;
    }

    const dataConnection = peer.connect(remoteId.value);

    dataConnection.once('open', async () => {
      messages.textContent += `=== DataConnection has been opened 1 ===\n`;

      sendTrigger1.addEventListener('click', onClickSend1);
      sendTrigger2.addEventListener('click', onClickSend2);
    });

    dataConnection.on('data', data => {
      messages.textContent += `Remote: ${data}\n`;
    });

    dataConnection.once('close', () => {
      messages.textContent += `=== DataConnection has been closed ===\n`;
      sendTrigger1.removeEventListener('click', onClickSend1);
      sendTrigger2.removeEventListener('click', onClickSend2);      
    });

    // Register closing handler
    closeTrigger.addEventListener('click', () => dataConnection.close(true), {
      once: true,
    });
    let value1 = 1;
    function onClickSend1() {
      value1 += 1;
      const data = value1;
      //const data = localText.value;
      dataConnection.send(data);
      messages.textContent = `You1: ${data}\n`;
      localText.value = '';
    }
    function onClickSend2() {
      value1 -= 1;
      const data = value1;
      //const data = localText.value;
      dataConnection.send(data);
      messages.textContent = `You1: ${data}\n`;
      localText.value = '';
    }
  });

  peer.once('open', id => (localId.textContent = id));

  // Register connected peer handler
  peer.on('connection', dataConnection => {
    dataConnection.once('open', async () => {
      messages.textContent += `=== DataConnection has been opened 2 ===\n`;

      sendTrigger1.addEventListener('click', onClickSend1);
      sendTrigger2.addEventListener('click', onClickSend2);
    });

    dataConnection.on('data', data => {
      messages.textContent += `Remote: ${data}\n`;
    });

    dataConnection.once('close', () => {
      messages.textContent += `=== DataConnection has been closed ===\n`;
      sendTrigger1.removeEventListener('click', onClickSend1);
      sendTrigger2.removeEventListener('click', onClickSend2);
    });

    // Register closing handler
    closeTrigger.addEventListener('click', () => dataConnection.close(true), {
      once: true,
    });
    let value2 = 10;
    function onClickSend1() {
      //const data = localText.value;
      //setInterval(() => {
      value2 += 10;
      const data = value2;
      dataConnection.send(data);
      messages.textContent = `You: ${data}\n`;
      localText.value = '';
      //}, 1);
    }
    function onClickSend2() {
      //const data = localText.value;
      //setInterval(() => {
      value2 -= 10;
      const data = value2;
      dataConnection.send(data);
      messages.textContent = `You: ${data}\n`;
      localText.value = '';
      //}, 1);
    }    
  });

  peer.on('error', console.error);
})();
