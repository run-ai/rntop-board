import React from 'react'
import Upload from '../UpoladComponent/Upload'
import './Welcome.css';

class Welcome extends React.Component {
    render() {
        return (
            <div className={"welcomeContainer"}>
                <h1> Welcome to rntop Board </h1>

                <p className={"welcomeP"}> 1. Run <a href="https://github.com/run-ai/rntop">rntop</a></p>
                <p className={"welcomeP"}> 2. Save an output file. </p>
                <p className={"welcomeP"}> 3. Then upload it here to see it visualized. </p>

                <Upload onRead={this.props.onRead} />
            </div>
        )
    }
}

export default Welcome;
