import classNames from 'classnames'
import { useRef } from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import styles from './QuoteSlider.module.scss'
import { ReactComponent as QuoteSymbolSVG } from '@/assets/quote-symbol.svg'
import { ReactComponent as LarrIconSVG } from '@/assets/larr-icon.svg'
import { ReactComponent as RarrIconSVG } from '@/assets/rarr-icon.svg'

export default function QuoteSlider({ className, children, items, renderItem }) { 
    const sliderRef = useRef(null) 
    return (
        <div className={classNames(styles.container, className, "container text-center")}>
            <QuoteSymbolSVG className="pb-3" />
            <div className='d-flex'>
                <div className='flex-grow-1'>
                    {children}  
                </div>
            </div>

            <div className={styles.sliderWrapper}>
                <div className={classNames('text-end', styles.nav)}>
                    <button  
                        className='btn btn-outline-primary btn-large rounded-circle' 
                        onClick={() => sliderRef.current.slickPrev()}
                        aria-label="Previous slide"
                    >
                        <LarrIconSVG />
                    </button>
                    <button 
                        className='btn btn-primary btn-large rounded-circle ms-3' 
                        onClick={() => sliderRef.current.slickNext()}
                        aria-label="Next slide"
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
                    arrows={false}
                    speed={200}
                >        

                {items.map((item, index) => (
                    <div className="card user-selct-none h-100" role="button" key={index}>
                        <div className="card-body text-start small">{renderItem(item)}</div>
                    </div> 
                ))}
                </Slider>
            </div>
        </div>
    )
}