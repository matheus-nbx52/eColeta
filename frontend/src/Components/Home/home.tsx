import Barra_de_navegacao from '../Barra-de-navegacao/barra-de-navegacao'
import './home.css'
import '../../CSS/global.css'
import Card_morador from '../Card-morador/card-morador'
import Card_coletor from '../Card-coletor/card-coletor'
import Card_cooperativa from '../Card-cooperativa/card-cooperativa'
import Hero from '../Hero/hero'
//import Como_funciona from '../Como-funciona/como-funciona'



export default function Home() {
    return (
        <>
            <Barra_de_navegacao />

            <div className="home-container">
                <section className='hero'>
                    <Hero/>

                </section>
                <section className='cads'>
                    <Card_morador />
                    <Card_coletor />
                    <Card_cooperativa />


                </section>

               {/* <section className='Como-funciona-container'>
                    <Como_funciona/>

                </section>*/}
            </div>
        </>
    )
}
