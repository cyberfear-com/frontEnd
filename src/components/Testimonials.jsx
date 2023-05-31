import QuoteSlider from './QuoteSlider'
import lhnLogo from '@/assets/testimonials/logo-lhn.png'
import bhwLogo from '@/assets/testimonials/logo-bhw.png'
import monericaLogo from '@/assets/testimonials/logo-monerica.png'
import prLogo from '@/assets/testimonials/logo-publishedreporter.png'
import xmrLogo from '@/assets/testimonials/logo-xmr.png'
import styles from './Testimonials.module.scss'

export const testimonials = [
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
        logo: lhnLogo,
        logoWidth: 80
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
        logo: bhwLogo,
        logoWidth: 36
    },
    {
        content: `
            Mailum <br />End-to-end encrypted email
            service. <br />No logs, <br />no ads,
            <br />offshore servers location.
            `,
        author: 'XMR.Directory',
        logo: xmrLogo,
        logoWidth: 36
    },
    {
        content: `
            Mailum - No IP Logs, <br />end to end
            email encryption, <br />MITM protection
            `,
        author: 'Monerica',
        company: 'monerica.com',
        logo: monericaLogo,
        logoWidth: 64
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
        logo: prLogo,
        logoWidth: 100
    }
]

export default function Testimonials() {
    return (
        <QuoteSlider
            className={styles.items}
            items={testimonials}
            renderItem={(item) => (
                <>
                    <p className='fst-italic' dangerouslySetInnerHTML={{__html: item.content}} />
                    <div className='d-flex border-top pt-2 align-items-center'>
                        <div className="flex-grow-1">
                            <strong className={styles.author}>{item.author}</strong><br />
                            <span className={styles.company}>{item.company}</span>
                        </div>
                        <img src={item.logo} width={item.logoWidth} className="flex-shrink-0" />
                    </div>
                </>
            )}
        >
            <h1>
                Why Journalists <span className='d-none d-md-inline'>Love&nbsp;Us</span><span className='d-md-none'>love&nbsp;us</span>
            </h1>
            <p className='lead opacity-50 py-3'>
                we&nbsp;have collected a&nbsp;professional team of&nbsp;science and security experts
            </p>
        </QuoteSlider>
    )
}