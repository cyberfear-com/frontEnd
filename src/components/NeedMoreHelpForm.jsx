import classNames from 'classnames'
import styles from './NeedMoreHelpForm.module.scss'
// import { ReactComponent as UserIconSVG } from '@/assets/user-icon.svg'

export default function NeedMoreHelpForm() {
    return (
        <>
            <h2 className='d-none d-md-block'>
                You Need More <span className="text-primary">Help?</span>
            </h2>
            <h3 className='d-md-none'>
                You Need More <span className="text-primary">Help?</span>
            </h3>

            <p className="opacity-50">One of our workspace experts will reach out to you based on the category of your question.</p>
            <form className='mt-5'>
                <div className={classNames(styles.iconField, styles.name, 'form-floating mb-3')}>
                    <input type="text" className="form-control" id="name" placeholder="Enter your name" />
                    <label for="name">Enter your name</label>
                </div>
                <div className={classNames(styles.iconField, styles.email, 'form-floating mb-3')}>
                    <input type="email" className="form-control" id="email" placeholder="Enter your name" />
                    <label for="email">Enter your email address</label>
                </div>
                <div className={classNames(styles.iconField, styles.category, 'mb-3')}>
                    <select class="form-select mb-3" aria-label=".form-select-lg example">
                        <option selected disabled>Category of your question</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                </div>
                <div className={classNames(styles.question, 'mb-3')}>
                    <textarea className='form-control' id='question' rows='6' placeholder="Let us know what's your question" />
                    <small className={classNames(styles.charLeft, 'opacity-40')}>800 characters left</small>
                </div>
                <div className={classNames(styles.iconField, styles.file, 'mb-3')}>
                    <input class="form-control" type="file" id="formFile" />
                </div>

                <div className="d-grid mt-4">
                    <button type="submit" class="btn btn-primary btn-block">Submit Message</button>
                </div>
            </form>
        </>
    )
}
