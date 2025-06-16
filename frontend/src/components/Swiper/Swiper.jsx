import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

const projetos = [
  {
    titulo: 'Projeto 1',
    imagem: 'img_1.jpg',
  },
  {
    titulo: 'Projeto 2',
    imagem: 'img_1.jpg',
  },
  {
    titulo: 'Projeto 3',
    imagem: 'img_1.jpg',
  },
];


function SwiperCarrocel(){
    return (
        <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={2}
        className="w-full"
        >
        {projetos.map((projeto, index) => (

            <SwiperSlide key={index}>
            <div className="flex flex-col w-full md:max-w-[55vw] lg:max-w-[35vw] xl:max-w-[25vw] bg-orange-400/20 backdrop-blur-lg p-4 rounded-4xl border-orange-500/50 border-2 justify-center text-center items-center lg:mb-0 mb-8 p-8">
                <img
                src={projeto.imagem}
                alt={projeto.titulo}
                className="rounded-xl w-full object-cover max-h-60"
                />
                <h2 className="text-white text-lg font-semibold mt-4">{projeto.titulo}</h2>
            </div>
            </SwiperSlide>
        ))}
        </Swiper>
    )

}

export default SwiperCarrocel;


