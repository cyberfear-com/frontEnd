import twitterIcon from '@/assets/twitter-icon.svg'
import redditIcon from '@/assets/reddit-icon.svg'
import facebookIcon from '@/assets/facebook-icon.svg'

export default function SocialBanner() {
    return (
        <div className="bg-light rounded-5 p-5">
            <div className="m-4">
                <h1>
                    Reach Us on Your Favorite <span className="text-primary">Social Media Platform</span>
                </h1>

                <a class="d-flex align-items-center text-decoration-none mt-5 mb-5" href="">
                    <img src={twitterIcon} className="flex-shrink-0" />
                    <small className="flex-grow-1 ms-3">
                        <div className="text-body-secondary">Follow Us on Twitter</div>
                        <div className="text-body"><strong>@Mailum</strong></div>
                    </small>
                </a>
                <a class="d-flex align-items-center text-decoration-none mb-5" href="">
                    <img src={facebookIcon} className="flex-shrink-0" />
                    <small className="flex-grow-1 ms-3">
                    <div className="text-body-secondary">Follow Us on Facebook</div>
                        <div className="text-body"><strong>@Mailum</strong></div>
                    </small>
                </a>
                <a class="d-flex align-items-center text-decoration-none" href="">
                    <img src={redditIcon} className="flex-shrink-0" />
                    <small className="flex-grow-1 ms-3">
                    <div className="text-body-secondary">Follow Us on Reddit</div>
                        <div className="text-body"><strong>@Mailum</strong></div>
                    </small>
                </a>
            </div>
        </div>
    )
}
