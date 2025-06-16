import React, { useEffect, useState } from 'react';

function MessageBox({ message }) {
  const [numero, setNumero] = useState('------');

  async function computeHash() {
    const encoder = new TextEncoder();
    const data = encoder.encode(message.user_id);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);
    const hashInt = ((hashArray[0] << 24) | (hashArray[1] << 16) | (hashArray[2] << 8) | hashArray[3]) >>> 0;
    const numero6Digitos = hashInt % 1_000_000;
    return numero6Digitos.toString().padStart(6, '0');
  }

  function dateToString(date) {
    const dateFormated = new Date(date)
      .toLocaleString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      .replace(',', '');
    return dateFormated;
  }

  useEffect(() => {
    console.log('MessageBox useEffect', message);
    if (message.user_id && message.user_id !== 'IA') {
      computeHash(message.user_id).then(setNumero);
    } else {
      setNumero('IA');
    }
  }, [message.user_id]);

  return (
    <div className="flex flex-col w-full p-4 shadow-md border-b border-neutral-600 hover:bg-neutral-200">
      <div className="flex flex-row justify-between items-center mb-2 text-xl font-bold text-black ">
        <p>Usuário - {numero}</p>
        <p className="text-sm opacity-50">{dateToString(message.timestamp)}</p>
      </div>
      <div className="text-black">{message.message}</div>
    </div>
  );
}

export default MessageBox;
