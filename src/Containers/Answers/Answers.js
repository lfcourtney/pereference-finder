import React from 'react';
import {motion} from 'framer-motion';
import {pageTransition} from '../../Data/pageTransition';
import styles from './Answers.module.css';

function Answers(props) {
    return (
        <motion.div initial="out" animate="in" exit="out" variants={pageTransition}
        transition={{duration: 0.5}}>
        <section>
            <div className="container">

            </div>
        </section>
        </motion.div>
    );
}

export default Answers;