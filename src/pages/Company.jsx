import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Banner from '@/components/Banner'

export default function Company() {
    return <>
        <Header />

        <Banner className='text-center'>
            <h1>
                <span className='text-primary'>Peace of&nbsp;Mind</span><br />
                Without Relying on&nbsp;Trust
            </h1>

            <p className='lead opacity-50'>
                Mailum is&nbsp;committed to&nbsp;keeping the Internet an&nbsp;anonymous space free from surveillance.
            </p>
        </Banner>

        <Footer />
    </>
}