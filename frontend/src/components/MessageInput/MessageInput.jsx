function MessageInput({ onSend, disabled }) {
  return (
    <div className="flex flex-row w-full items-center justify-center mt-4">
      <input
        type="text"
        className="w-full p-4 rounded-2xl bg-gray-100/40 backdrop-blur-lg text-black shadow-[0px_0px_20px_5px_rgba(255,_255,_255,_0.05)]"
        placeholder="Escreva uma mensagem..."
        disabled={disabled}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target.value.trim()) {
            onSend(e.target.value.trim())
            e.target.value = ''
          }
        }}
      />
    </div>
  );
}

export default MessageInput;
