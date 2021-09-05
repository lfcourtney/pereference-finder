import React, {useState} from 'react';
import styles from './Homepage.module.css';
import {motion, useAnimation} from 'framer-motion';
import {pageTransition} from '../../Data/pageTransition';
import EntryBox from '../../Components/EntryBox/EntryBox';
import GeneralBtn from '../../Components/GeneralBtn/GeneralBtn';
import {useAuth} from '../../Data/AuthContext';
import {useHistory} from 'react-router-dom';
import {sameWordChecker} from '../../Utils/sameWordChecker';

function Homepage(props) {

    const control = useAnimation();

    const history = useHistory();

    const [warning, setWarning] = useState(null);

    const {entryBox, setCanStartQuiz, prepareEntries, canStartQuiz} = useAuth();

    const clickStart = () => {
        if(!entryBox){
            setWarning('Warning. You can\'t submit an empty form.');
            control.start({scale: [0.8, 1, 0.8, 1], display: 'block'});
            return;
        } 
        const words = entryBox.split(/[\n,]/);
        if(words.length < 2){
            setWarning('Warning. You must have more than one entry.');
            control.start({scale: [0.8, 1, 0.8, 1], display: 'block'});
            return;
        }
        let isEmptyItem = false;
        words.forEach(word => {
            let match = word.match(/\s*/) ? word.match(/\s*/) : '';
            if(match[0]=== word) isEmptyItem = true;
        });
        if(isEmptyItem){
            setWarning('Warning. No empty items are allowed.');
            control.start({scale: [0.8, 1, 0.8, 1], display: 'block'});
            return;
        }
        if(sameWordChecker(words)){
            setWarning('Warning. No duplicate items are allowed.');
            control.start({scale: [0.8, 1, 0.8, 1], display: 'block'});
            return;
        }
        history.push('/quiz');
        if(!canStartQuiz){
            prepareEntries(words);
            setCanStartQuiz(true);
        }
    }

    return (
        <motion.div initial="out" animate="in" exit="out" variants={pageTransition}
        transition={{duration: 0.5}}>
        <div className={styles.flexContainer}>
        <div className="container">
        <p className={styles.openingText}>Type in a list of things separated by a line break or comma. Press submit to enter a quiz where by process of elimination, we will determine what your favourites are in order.</p>
        <p className={styles.openingText}>Note: each list item needs to have a unique ranking in order for the final list generated to be conclusive. Therefore, expect to be asked a <strong>lot</strong> of questions if you have submitted a long list. </p>
        <EntryBox />
        <motion.p className={styles.warningText} animate={control}
        transition={{type: "spring", stiffness: 100}} style={{display: 'none'}}>{warning}</motion.p>
        <GeneralBtn text='START' width='100' clickStart={clickStart} />
        </div>
        </div>
        </motion.div>
    );
}

export default Homepage;