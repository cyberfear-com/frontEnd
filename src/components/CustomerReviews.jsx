import QuoteSlider from './QuoteSlider.jsx'
import clientDfrImg from '@/assets/client-avatar-dfr.png'
import clientCyberfearImg from '@/assets/client-avatar-cyberfearuser.png'
import clientWhoamiImg from '@/assets/client-avatar-whoami.png'
import client1264815Img from '@/assets/client-avatar-1264815.png'
import clientRowaImg from '@/assets/client-avatar-rowa.png'
import styles from './CustomerReviews.module.scss'

const reviews = [
    {
        content: `
            I&nbsp;am very happy that&nbsp;I could test
            Mailum. So&nbsp;far&nbsp;I cannot say anything bad
            about this service, but&nbsp;I will gladly
            update this post as&nbsp;soon as&nbsp;I notice
            something, which I&nbsp;do not like.
            `,
        author: 'dfr+',
        company: 'hackforums.net',
        logo: clientDfrImg,
        logoWidth: 36,
    },
    {
        content: `
            I&nbsp;use mailum and love the product. Well
            worth the cost and admittedly the
            occasional downtime or&nbsp;slow service. I
            would really like to&nbsp;see a&nbsp;review of&nbsp;it
            in&nbsp;this site.
            `,
        author: 'Cyberfear User',
        company: 'restoreprivacy.com',
        logo: clientCyberfearImg,
        logoWidth: 36,
    },
    {
        content: `
            Overall, very quick and easy to&nbsp;setup. I
            was up&nbsp;and running in&nbsp;no&nbsp;time. All of
            the features listed in&nbsp;the thread here
            are present in&nbsp;my&nbsp;account, in&nbsp;addition
            to&nbsp;more.
            `,
        author: 'whoami',
        company: 'blackhatworld.com',
        logo: clientWhoamiImg,
        logoWidth: 36,
    },
    {
        content: `
            I&nbsp;have used it&nbsp;for almost 2&nbsp;weeks now.
            Website speed is&nbsp;incredible. It&rsquo;s like a
            website on&nbsp;a&nbsp;local host The design is
            very minimalistic. It&rsquo;s so&nbsp;easy to
            navigate and become familiar with the
            website. All features are present and
            working.
            `,
        author: '1264815',
        company: 'blackhatworld.com',
        logo: client1264815Img,
        logoWidth: 36,
    },
    {
        content: `
            The sign-up process was very easy and
            was done in&nbsp;seconds. There are multiple
            ways to&nbsp;protect your account, this can
            be&nbsp;done without verification with phone
            numbers so&nbsp;that&rsquo;s great.
            `,
        author: 'Rowa',
        company: 'hackforums.net',
        logo: clientRowaImg,
        logoWidth: 36,
    },
]

export default function CustomerReviews() {
    return (
        <QuoteSlider
            className={styles.items}
            items={reviews}
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
            <h2 className='d-none d-md-block'>What Customers Say About Mailum</h2>
            <h1 className='d-md-none'>What Customers Say About Mailum</h1>

            <p className='opacity-50 py-3'>
                we&nbsp;have collected a&nbsp;professional team of&nbsp;science and security experts
            </p>
        </QuoteSlider>
    )
}