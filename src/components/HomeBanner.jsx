import { ReactComponent as AppleStoreIconSVG } from '@/assets/apple-store-icon.svg'
import { ReactComponent as GooglePlayIconSVG } from '@/assets/google-play-icon.svg'
import { ReactComponent as FDroidIconSVG } from '@/assets/f-droid-icon.svg'
import mailumUI from '@/assets/mailum-ui.png'
import classNames from 'classnames'
import styles from './HomeBanner.module.scss'

// TODO update links
const downloadLinks = [
    { 
        iconClass: AppleStoreIconSVG, 
        source: 'Apple Store',
        url: '#'
    },
    { 
        iconClass: GooglePlayIconSVG, 
        source: 'Google Play',
        url: '#'
    },
    { 
        iconClass: FDroidIconSVG, 
        source: 'F-Droid',
        url: '#'
    },
]

export default function HomeBanner() {
    return (
        <div className={classNames(styles.root, "bg-primary text-bg-primary pt-5 text-center")}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 col-12 mx-auto">
                        <h1>Make Email Security a Priority</h1>
                        <p className="lead opacity-50 mt-3 mb-4">
                            Protect confidential emails and information with open-source, most complete encryption that ensures your data is safeguarded from start to finish.
                        </p>

                        <a href="#" className="btn btn-light fw-bold small">Try for Free</a>

                        <ul 
                            className={classNames(
                                styles.downloadList, 
                                'list-unstyled d-flex justify-content-center my-4'
                            )}
                        >
                            {
                                downloadLinks.map(info => (
                                    <li>
                                        <a 
                                            href={info.url} 
                                            className="
                                                btn bg-light bg-opacity-10
                                                text-bg-primary text-decoration-none lh-1
                                                d-flex align-items-center
                                            "
                                        >
                                            
                                            <info.iconClass className="flex-shrink-0" /> 
                                            <div className="flex-grow-1 ms-2 text-start">
                                                <small class="opacity-50">Download on the</small>
                                                <strong>{info.source}</strong>
                                            </div>
                                        </a>                                
                                    </li>
                                ))
                            } 
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 mx-auto">
                        <img src={mailumUI} className="w-100 mb-n5" />
                    </div>
                </div>
            </div>
        </div>
    )
}