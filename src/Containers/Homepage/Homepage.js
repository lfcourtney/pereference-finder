import React from 'react';
import styles from './Homepage.module.css';
import {motion} from 'framer-motion';
import {pageTransition} from '../../Data/pageTransition';
import EntryBox from '../../Components/EntryBox/EntryBox';
import GeneralBtn from '../../Components/GeneralBtn/GeneralBtn';
import useHomePageWarning from './useHomepageWarning';

function Homepage(props) {

    const [clickStart, warning, control] = useHomePageWarning();

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