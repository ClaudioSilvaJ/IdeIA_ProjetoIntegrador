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
    return new Date(date).toLocaleString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).replace(',', '');
  }

  useEffect(() => {
    if (message.user_id && message.user_id !== 'IA') {
      computeHash(message.user_id).then(setNumero);
    } else {
      setNumero('IA');
    }
  }, [message.user_id]);

  const isUser = message.user_id !== 'IA';
  const avatarSrc = isUser ? '/user.png' : '/ia.png';

  return (
    <div className={`flex w-full px-4 py-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-center gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <img
          src={avatarSrc}
          alt={isUser ? 'Usuário' : 'IA'}
          className="w-10 h-10 rounded-full"
        />
        <div className={`max-w-[75%] p-3 rounded-2xl shadow-md text-white ${isUser ? 'bg-rose-800 text-right' : 'bg-orange-700 text-left'}`}>
          <div className="text-sm font-semibold mb-1">
            {isUser ? 'Você' : 'IA'}
          </div>
          <div className="whitespace-pre-wrap break-words">{message.message}</div>
          <div className="text-xs opacity-60 mt-1">
            {dateToString(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBox;
