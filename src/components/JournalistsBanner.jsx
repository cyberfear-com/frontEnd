import classNames from 'classnames'
import { Pagination } from 'swiper'
import { register } from 'swiper/element';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import 'swiper/css' 
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import styles from './JournalistsBanner.module.scss'
import lhnLogo from '@/assets/testimonials/logo-lhn.png'
import bhwLogo from '@/assets/testimonials/logo-bhw.png'
import monericaLogo from '@/assets/testimonials/logo-monerica.png'
import prLogo from '@/assets/testimonials/logo-publishedreporter.png'
import xmrLogo from '@/assets/testimonials/logo-xmr.png'
import { ReactComponent as QuoteSymbolSVG } from '@/assets/quote-symbol.svg'
import { ReactComponent as LarrIconSVG } from '@/assets/larr-icon.svg'
import { ReactComponent as RarrIconSVG } from '@/assets/rarr-icon.svg'
import { useRef, useEffect } from 'react'

register()

const testimonials = [
    {
        content: `
            Tutanota, another popular email
            provider, does a better job with data
            encryption. They not only encrypt the
            email body, but also the subject.
            However, sender and recipient
            information is left unencrypted.
            <strong
                >The only email service we found to
                encrypt all of these 3 elements is
                Mailum.</strong
            >
            `,
        author: 'Mic Johnson',
        company: 'latesthackingnews.com',
        logo: lhnLogo
    },
    {
        content: `
            <strong>Approved</strong><br />This
            email provider has been tested by the
            marketplace moderation team to ensure
            that it meets the standards for the
            marketplace.
            `,
        author: 'Moderator',
        company: 'BHW Forum',
        logo: bhwLogo
    },
    {
        content: `
            Mailum <br />End-to-end encrypted email
            service. <br />No logs, <br />no ads,
            <br />offshore servers location.
            `,
        author: 'XMR.Directory',
        logo: xmrLogo
    },
    {
        content: `
            Mailum - No IP Logs, <br />end to end
            email encryption, <br />MITM protection
            `,
        author: 'Monerica',
        company: 'monerica.com',
        logo: monericaLogo
    },
    {
        content: `
            Consider getting email accounts at
            Proton and Mailum. At some point it
            might be a good idea to limit automatic
            updates to prevent authoritarian
            intrusions and limitations.
            `,
        author: 'Gene Van Shaar',
        company: 'The Published Reporter',
        logo: prLogo
    }
]

export default function JournalistsBanner() {
    const swiperRef = useRef(null)
    
    return (
        <div className={classNames(styles.container, "container text-center")}>
            <QuoteSymbolSVG className="pb-3" />
            <div className="d-flex">
                <div className="flex-grow-1">
                    <h1>Why Journalists Love Us</h1>
                    <p className="lead opacity-50 py-3">we have collected a professional team of science and security experts</p>
                </div>
            </div>

            <div className={classNames('text-end', styles.swiperNav)}>
                <button 
                    className='btn btn-outline-primary btn-large rounded-circle' 
                    onClick={() => swiperRef.current.swiper.slidePrev()}
                >
                    <LarrIconSVG />
                </button>
                <button 
                    className='btn btn-outline-primary btn-large rounded-circle ms-3' 
                    onClick={() => swiperRef.current.swiper.slideNext()}
                >
                    <RarrIconSVG />
                </button>
            </div>

            <swiper-container 
                ref={swiperRef}
                slides-per-view="3"
                looped-slides="2"
                loop
                space-between="30"
                className={styles.swiper}
            >
            {testimonials.map(item => (
                <swiper-slide>
                   <div className="card user-selct-none" role="button">
                        <div className="card-body p-4 text-start small">
                            <p className={styles.testimonial} dangerouslySetInnerHTML={{__html: item.content}} />
                            <div className={classNames('d-flex border-top pt-2', styles.source)}>
                                <div className="flex-grow-1">
                                    <strong>{item.author}</strong><br />
                                    {item.company}
                                </div>
                                <img src={item.logo} className="flex-shrink-0" />
                            </div>
                        </div>
                    </div> 
                </swiper-slide>
            ))}            
            </swiper-container>
        </div>
    )
}