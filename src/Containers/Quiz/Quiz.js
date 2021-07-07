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

    const {entries, qNum, setQNum, updateScore, detectEquals} = useAuth();

    const newQ = (choice) => {
    if(canNewQ.current){
        canNewQ.current = false;
        setTimeout(() => {
            setQNum(prev => ++prev);
        }, 500);
        cardControl.start({
            opacity: [1, 0, 1],
            transition: {duration: 1, ease: 'easeInOut'}
        });
        setTimeout(() => {
            canNewQ.current = true;
        }, 1000);
        updateScore(choice);
    }
    if(qNum >= entries.length){
        if(!detectEquals()){
            history.push('/answers');
        }
    }
    }

    return (
        <motion.div initial="out" animate="in" exit="out" variants={pageTransition}
        transition={{duration: 0.5}}>
            <section className={styles.flexSection}>
            <p className={styles.question}>Q. <motion.span animate={cardControl}>{qNum}</motion.span></p>
            <p className={styles.infoText}>Which one is better?</p>
            <div className="container">
                <motion.div className={styles.card} animate={cardControl}>
                    <p className={styles.options} >1. {qNum <= entries.length ? entries[qNum - 1][0] : 'as'}</p>
                    <div className={`${styles.btn} ${styles.blue}`}
                    onClick={() => newQ(0)}>Choose One</div>
                    <p className={styles.options}>2. {qNum <= entries.length ? entries[qNum - 1][1] : 'as'}</p>
                    <div className={`${styles.btn} ${styles.green}`}
                    onClick={() => newQ(1)}>Choose Two</div>
                </motion.div>
            </div>
            </section>
        </motion.div>
    );
}

export default Quiz;