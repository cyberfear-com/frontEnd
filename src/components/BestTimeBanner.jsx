import bestTimeLogosImg from '@/assets/best-time-logos.png'
import bestTimeLogosMobileImg from '@/assets/best-time-logos-mobile.png'
import CardBanner from './CardBanner';

export default function BestTimeBanner({
    firstLine = 'Reclaim your online privacy.',
    secondLine = 'It&rsquo;s the perfect time to&nbsp;do&nbsp;so.'
}) {
    return (
        <CardBanner 
            className='bg-dark text-bg-dark'
            footer={<img src={bestTimeLogosMobileImg} className='w-100 mt-4 d-md-none mb-4' />}
        >
            <div className='text-center'>
                <h4 className='d-none d-md-block'>
                    <div className='fw-normal' dangerouslySetInnerHTML={{ __html: firstLine }} />
                    <div dangerouslySetInnerHTML={{ __html: secondLine }} />
                </h4>
                
                <h3 className='d-md-none'>
                    <div className='h4 fw-normal' dangerouslySetInnerHTML={{ __html: firstLine }} />
                    <div dangerouslySetInnerHTML={{ __html: secondLine }} />
                </h3>
            </div>

            <img src={bestTimeLogosImg} className='w-100 d-none d-md-block mt-5' />
        </CardBanner>
    );
}
