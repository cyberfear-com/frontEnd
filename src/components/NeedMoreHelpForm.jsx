import classNames from 'classnames'

export default function NeedMoreHelpForm() {
    return (
        <>
            <h1>You Need More <span className="text-primary">Help?</span></h1>
            <p className="lead opacity-50">One of our workspace experts will reach out to you based on the category of your question.</p>
            <form>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="name" placeholder="Enter your name" />
                    <label for="name">Enter your name</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="email" className="form-control" id="email" placeholder="Enter your name" />
                    <label for="email">Enter your email address</label>
                </div>
                <div className="mb-3">
                    <select class="form-select mb-3" aria-label=".form-select-lg example">
                        <option selected>Category of your question</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                </div>
                <div class="mb-3">
                    <textarea class="form-control" id="question" rows="3" placeholder="Let us know what's your question"></textarea>
                </div>
                <div class="mb-3">
                    <input class="form-control" type="file" id="formFile" />
                </div>

                <div className="d-grid">
                    <button type="submit" class="btn btn-primary btn-block">Submit Message</button>
                </div>
            </form>
        </>
    )
}
