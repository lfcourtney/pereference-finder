import React from 'react';
import {motion} from 'framer-motion';
import {pageTransition} from '../../Data/pageTransition';
import styles from './Answers.module.css';
import {useAuth} from '../../Data/AuthContext';
import GeneralBtn from '../../Components/GeneralBtn/GeneralBtn';
import {useHistory} from 'react-router-dom';

function Answers(props) {

    const history = useHistory();

    const {orderScore, resetSession, setEntryBox} = useAuth();

    const playAgain = () => {
        history.push('/');
        setTimeout(() => {
            resetSession();
            setEntryBox('');
        }, 500);
    }

    return (
        <motion.div initial="out" animate="in" exit="out" variants={pageTransition}
        transition={{duration: 0.5}}>
        <section className={styles.center}>
            <div className="container">
            <p className={styles.rankings}>Your rankings: from worst to best.</p>
            <div className={styles.card}>
                {orderScore().map((score, index) => (
                    <p key={index}>{index+1+'. '+score.data}</p>
                ))}
            </div>
                <GeneralBtn text="PLAY AGAIN?" clickStart={playAgain} width='150' />
            </div>
        </section>
        </motion.div>
    );
}

export default Answers;