import React from 'react';
import styles from './About.module.css';
import {motion} from 'framer-motion';
import {pageTransition} from '../../Data/pageTransition';

function About(props) {
    return (
        <motion.div initial="out" animate="in" exit="out" variants={pageTransition}
        transition={{duration: 0.5}}>
        <section className={styles.flexAbout}>
        <div></div>
        <div className='container'>
        <p className={styles.aboutText1}>Have you ever listed some of your favourite things and wanted an objective way of ordering them from worst to best?  If so, then look no further than this new and fun application.</p>
        <br />
        <p className={styles.aboutText2}>Note: more features on the way shortly.</p>
        </div>
        <div className={styles.footer}>&copy; Luke Courtney {new Date().getFullYear()}</div>
        </section>
        </motion.div>
    );
}

export default About;