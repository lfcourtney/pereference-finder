import styles from './Quiz.module.css';
import {motion } from 'framer-motion';


function InitialScreen({cardControl, estimatedQuestions, setSelectedNewQuestion, numOfQuestions}){

    const removeInitialScreen = () => {
        cardControl.start({
            opacity: [1, 0, 1],
            transition: {duration: 1, ease: 'easeInOut'}
        });
        setTimeout(() => {
            setSelectedNewQuestion(true);
        }, 500);
        
    };


    return (
        <motion.div className={styles.initialScreen}>
                <div className="container">
                    <p className={styles.enteredTitle}>You entered:</p>
                    <p className={styles.enteredSub}>{numOfQuestions} options</p>
                    <p className={styles.enteredTitle}>Expect an estimated:</p>
                    <p className={styles.enteredSub}>{estimatedQuestions} questions</p>
                    <div className={`${styles.btn} ${styles.green} ${styles.initialBtn}`}
                    onClick={removeInitialScreen}>Ok</div>
                </div>
            </motion.div>
    );
}

export default InitialScreen;