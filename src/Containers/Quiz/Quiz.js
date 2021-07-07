import React, {useState, useRef} from 'react';
import {motion, useAnimation} from 'framer-motion';
import {pageTransition} from '../../Data/pageTransition';
import styles from './Quiz.module.css';
import {useAuth} from '../../Data/AuthContext';
import {useHistory} from 'react-router-dom';

function Quiz(props) {

    const history = useHistory();

    const cardControl = useAnimation();

    const canNewQ = useRef(true);

    const {entries, qNum, setQNum, updateScore, detectEquals, goBack} = useAuth();

    function newOrBack(dir){
        canNewQ.current = false;
        setTimeout(() => {
            if(dir === 'FORWARD'){
                setQNum(prev => ++prev);
            }else if(dir === 'BACKWARD'){
                setQNum(prev => --prev);
            }
        }, 500);
        cardControl.start({
            opacity: [1, 0, 1],
            transition: {duration: 1, ease: 'easeInOut'}
        });
        setTimeout(() => {
            canNewQ.current = true;
        }, 1000);
    }

    const newQ = (choice) => {
    if(canNewQ.current){
        newOrBack('FORWARD');
        updateScore(choice);
    }
    if(qNum >= entries.length){
        if(!detectEquals()){
            history.push('/answers');
        }
    }
    }

    const clickBack = () => {
        if(canNewQ.current){
            newOrBack('BACKWARD');
            goBack();
        }
    }

    return (
        <motion.div initial="out" animate="in" exit="out" variants={pageTransition}
        transition={{duration: 0.5}}>
            <motion.section animate={cardControl} className={styles.flexSection}>
            <p className={styles.question}>Q. {qNum}</p>
            <p className={styles.infoText}>Which one is better?</p>
            <div className="container">
                <div className={styles.card} >
                    <p className={styles.options} >1. {qNum <= entries.length ? entries[qNum - 1][0] : 'as'}</p>
                    <div className={`${styles.btn} ${styles.blue}`}
                    onClick={() => newQ(0)}>Choose One</div>
                    <p className={styles.options}>2. {qNum <= entries.length ? entries[qNum - 1][1] : 'as'}</p>
                    <div className={`${styles.btn} ${styles.green}`}
                    onClick={() => newQ(1)}>Choose Two</div>
                </div>
                { qNum > 1 && <div className={styles.backBtn} onClick={clickBack}>BACK</div>}
            </div>
            </motion.section>
        </motion.div>
    );
}

export default Quiz;