import './styles/index.css'
import App from './App'
import { Helmet } from 'react-helmet'

const Home = () => (
    <>
        <Helmet>
            <title>Ear Training Online</title>
            <meta
            name="description"
            content="Ear Training Online is a web app for practicing music dictation."
            />
        </Helmet>
        <App />
    </>
)

export default Home