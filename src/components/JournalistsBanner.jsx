import classNames from 'classnames'
import styles from './JournalistsBanner.module.scss'
import lhnLogo from '@/assets/testimonials/logo-lhn.png'
import bhwLogo from '@/assets/testimonials/logo-bhw.png'
import monericaLogo from '@/assets/testimonials/logo-monerica.png'
import prLogo from '@/assets/testimonials/logo-publishedreporter.png'
import xmrLogo from '@/assets/testimonials/logo-xmr.png'
import { ReactComponent as QuoteSymbolSVG } from '@/assets/quote-symbol.svg'
import { ReactComponent as LarrIconSVG } from '@/assets/larr-icon.svg'
import { ReactComponent as RarrIconSVG } from '@/assets/rarr-icon.svg'
import { useRef } from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

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
    const sliderRef = useRef(null)
    return (
        <div className={classNames(styles.container, "container text-center")}>
            <QuoteSymbolSVG className="pb-3" />
            <div className='d-flex'>
                <div className='flex-grow-1'>
                    <h1>
                        Why Journalists <span className='d-none d-md-inline'>Love&nbsp;Us</span><span className='d-md-none'>love&nbsp;us</span>
                    </h1>
                    <p className='lead opacity-50 py-3'>
                        we&nbsp;have collected a&nbsp;professional team of&nbsp;science and security experts
                    </p>
                </div>
            </div>

            <div className={styles.sliderWrapper}>
                <div className={classNames('text-end', styles.nav)}>
                    <button  
                        className='btn btn-outline-primary btn-large rounded-circle' 
                        onClick={() => sliderRef.current.slickPrev()}
                    >
                        <LarrIconSVG />
                    </button>
                    <button 
                        className='btn btn-outline-primary btn-large rounded-circle ms-3' 
                        onClick={() => sliderRef.current.slickNext()}
                    >
                        <RarrIconSVG />
                    </button>
                </div>

                <Slider
                    ref={sliderRef}
                    className={styles.slider}
                    infinite={true}                
                    slidesToShow={3}
                    slidesToScroll={1}
                    responsive={[
                        {
                            breakpoint: 1280,
                            settings: { slidesToShow: 3, slidesToScroll: 3 }
                        },
                        {
                            breakpoint: 992,
                            settings: { slidesToShow: 2, slidesToScroll: 2 }
                        },
                        {
                            breakpoint: 768,
                            settings: { slidesToShow: 1 }
                        }
                    ]}
                    speed={200}
                >
            

                {testimonials.map(item => (
                    <div className="card user-selct-none h-100" role="button">
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
                ))}   
                </Slider>
            </div>
        </div>
    )
}