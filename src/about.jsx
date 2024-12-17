import './styles/about.css'
import Header from './components/Header'
import { Helmet } from 'react-helmet'

// Fixed file name
const About = () => (
    <>
        <Helmet>
            <title>Ear Training Online - About Page</title>
            <meta
            name="description"
            content="Info about the Ear Training Online
            open-source project."
            />
        </Helmet>
        <Header />
        <div id="content">
            <h2>About Ear Training Online</h2>
            <p>
                Ear Training Online is an open-source web app created by <a
                href="https://www.maxeidinoff.com/"
                target="_blank"
                rel="noreferrer noopener"
                >Max Eidinoff</a> as a resource for music students, particularly those taking AP Music Theory or an intro undergraduate aural skills course, to practice melodic dictation. This
                current version is an early prototype that will hopefully continue to
                grow. User feedback and community code contributions are very much
                welcome! The goal with this project is to eventually scale difficulty
                level of exercises with user performance in a highly gamified
                presentation, rather than isolating aural skill concepts for the user to
                manually choose from.
            </p>
        </div>
    </>
)

export default About