import bestTimeLogosImg from '@/assets/best-time-logos.png'
import bestTimeLogosMobileImg from '@/assets/best-time-logos-mobile.png'
import CardBanner from './CardBanner';

export default function BestTimeBanner() {
    return (
        <CardBanner 
            className='bg-dark text-bg-dark'
            footer={<img src={bestTimeLogosMobileImg} className='w-100 mt-4 d-md-none mb-4' />}
        >
            <div className='text-center'>
                <h4 className='d-md-none fw-normal'>The best time to improve your privacy was yesterday,</h4>
                <h3 className='d-none d-md-block'>The best time to improve your privacy was yesterday,</h3>
                <h2>The Second Best Time is Now!</h2>
            </div>

            <img src={bestTimeLogosImg} className='w-100 d-none d-md-block mt-5' />
        </CardBanner>
    );
}
