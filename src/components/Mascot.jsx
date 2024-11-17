import '../styles/Mascot.css'

const Mascot = () => {

    return (
        <div id='mascot'>
            <div className='head'></div>
            <div id='body'>
                <div className='arm' id='right-arm'></div>
                <div className='arm' id='left-arm'></div>
                <div className='leg' id='right-leg'></div>
                <div className='leg' id='left-leg'></div>
            </div>
        </div>
    )
}

export default Mascot