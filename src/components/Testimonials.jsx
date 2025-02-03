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
        logoWidth: 80,
        logoAlt: 'Logo of Latest Hacking News'
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
        logoWidth: 36,
        logoAlt: 'Logo of BHW Forum'
    },
    {
        content: `
            Mailum <br />End-to-end encrypted email
            service. <br />No logs, <br />no ads,
            <br />offshore servers location.
            `,
        author: 'XMR.Directory',
        logo: xmrLogo,
        logoWidth: 36,
        logoAlt: 'Logo of XMR Directory'
    },
    {
        content: `
            Mailum - No IP Logs, <br />end to end
            email encryption, <br />MITM protection
            `,
        author: 'Monerica',
        company: 'monerica.com',
        logo: monericaLogo,
        logoWidth: 64,
        logoAlt: 'Logo of Monerica'
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
        logoWidth: 100,
        logoAlt: 'Logo of The Published Reporter'
    }
]

export default function Testimonials({
    titleDesktop = 'Private Email Trusted by&nbsp;Security Experts',
    titleMobile = 'Private Email Trusted by&nbsp;Security Experts',
}) {
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
                        <img src={item.logo} width={item.logoWidth} alt={item.logoAlt} className="flex-shrink-0" />
                    </div>
                </>
            )}
        >
            <h2 className='d-none d-md-block' dangerouslySetInnerHTML={{ __html: titleDesktop }} />
            <h1 className='d-md-none' dangerouslySetInnerHTML={{ __html: titleMobile }} />
            <p className='opacity-50 py-3'>
                Experience unparalleled privacy with our Private Email Service, trusted by security experts for its advanced encryption and unmatched security
                {/*The Verdict is&nbsp;in: Mailum is&nbsp;the go-to private email service to&nbsp;take back your digital privacy.*/}
            </p>
        </QuoteSlider>
    )
}