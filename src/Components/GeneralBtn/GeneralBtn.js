import React from 'react';
import styles from './GeneralBtn.module.css';

function StartBtn(props) {
    return (
        <div className={styles.startBtn} onClick={props.clickStart} style={{width: props.width+'px',
        backgroundColor: props.color && props.color}}>
            {props.text}
        </div>
    );
}

export default StartBtn;