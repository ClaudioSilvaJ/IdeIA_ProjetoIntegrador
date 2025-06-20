import SwiperCarrocel from "../../components/Swiper/Swiper"


function Projects() {

  return (
    <div className="flex flex-col w-full items-center h-full md:h-screen p-4 justify-center bg-gradient-to-t from-rose-950 to-orange-700">
      <img src="logo.png" alt="AI App" className="absolute top-10 left-10 object-cover"/>
      <div className="absolute top-8 right-8 border-2 border-white/50 hover:border-white/70 hover:bg-amber-600 rounded-full cursor-pointer w-16 p-4" onClick={() => window.history.back()}>
        <img src="voltar.png" alt="Voltar" style={{ filter: 'invert(1)' }}/>
      </div>
      <div onClick={() => window.location.href = '/chat'} className="flex flex-col w-full md:max-w-[55vw] lg:max-w-[35vw] xl:max-w-[25vw] bg-orange-400/30 hover:bg-orange-400/70 cursor-pointer backdrop-blur-lg p-4 rounded-4xl border-orange-500/50 border-2 justify-center text-center items-center lg:mb-5 mb-8 p-8 mt-42 lg:mt-0">
        <img src="logo_solo.png" alt="AI App" className="w-24 h-24 mb-4"/>
        <h1 className="text-white text-2xl md:text-3xl mb-5 font-bold">
          Iniciar Chat
        </h1>
      </div>
      
      
      <div className="flex flex-col w-full md:max-w-[55vw] lg:max-w-[35vw] xl:max-w-[25vw] backdrop-blur-lg rounded-4xl border-orange-500/50 border-2 justify-center text-center items-center lg:mb-0 mb-8 p-8">
        <p className="text-gray-100 text-lg md:text-xl font-semibold mb-5">
          Entenda como será a interação com o chat e a geração de ideias de aplicativos!
        </p>
        <button className="w-full md:w-1/2 mt-4 bg-rose-900/40 px-4 py-2 rounded-4xl hover:bg-orange-500 hover:text-white transition-colors border-orange-400/60 border-2 text-lg font-bold cursor-pointer" onClick={() => window.location.href = '/chat'}>
          Iniciar Chat
        </button>
      </div>
    </div>

  )
}

export default Projects
