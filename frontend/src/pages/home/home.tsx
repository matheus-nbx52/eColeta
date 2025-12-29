import Barra_de_navegacao from '../../Components/Barra-de-navegacao/barra-de-navegacao'
import './home.css'
import '../../CSS/global.css'
import Card_morador from '../../Components/Card-morador/card-morador'
import Card_coletor from '../../Components/Card-coletor/card-coletor'
import Card_cooperativa from '../../Components/Card-cooperativa/card-cooperativa'
import Hero from '../../Components/Hero/hero'
import Como_funciona from '../../Components/Como-funciona/como-funciona'
import Footer from '../../Components/Footer/footer'


export default function Home() {
    return (
        <div className="home-page">
            <Barra_de_navegacao />

            <div className="home-container">
                <section className='hero'>
                    <Hero />
                </section>

                <section className='cards'>
                    <Card_morador />
                    <Card_coletor />
                    <Card_cooperativa />
                </section>

                <section className='como-funciona-container'>
                    <Como_funciona />
                </section>
            </div>

            <Footer />
        </div>
    );
}