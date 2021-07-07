import React from 'react';
import styles from './StartBtn.module.css';

function StartBtn(props) {
    return (
        <div className={styles.startBtn} onClick={props.clickStart}>
            START
        </div>
    );
}

export default StartBtn;