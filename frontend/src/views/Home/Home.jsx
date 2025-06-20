
function Home() {

  return (
    <div className="flex flex-col w-full items-end h-screen justify-end lg:justify-center bg-gradient-to-t to-rose-950/30 from-orange-700/10 relative">
      <img src="logo.png" alt="AI App" className="absolute top-10 left-1/2 transform -translate-x-1/2 object-cover"/>
      <div className="flex flex-col w-full h-full xl:max-w-[25vw] bg-orange-400/30 backdrop-blur-lg border-orange-500/50 border-l-1 justify-center text-center items-center p-8">
        <h1 className="text-white text-2xl md:text-3xl mb-5 font-bold">
          Explore seu mundo novo de oportunidades
        </h1>
        <p className="text-gray-200 text-lg md:text-xl font-semibold mb-5">
          Você está prestes a conhecer o protótipo do APP de IA que vai mudar para
          sempre o desenvolvimento de ideias de aplicativos!
        </p>
        <p className="text-gray-100 text-lg md:text-xl font-semibold mb-5">Fique confortável e aproveite o passeio!</p>
        <button className="w-full md:w-1/2 mt-4 bg-white/20 px-4 py-2 rounded-4xl hover:bg-orange-500 hover:text-white transition-colors border-orange-400/60 border-2 text-lg font-bold cursor-pointer" onClick={() => window.location.href = '/projects'}>
          Quero conhecer
        </button>
      </div>
    </div>

  )
}

export default Home
