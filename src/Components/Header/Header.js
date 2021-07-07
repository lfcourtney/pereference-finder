import React from 'react';
import {Link} from 'react-router-dom';
import styles from './Header.module.css';
import {useLocation} from 'react-router-dom';
import {useAuth} from '../../Data/AuthContext';

function Header(props) {
    const location = useLocation().pathname;

    const {resetSession, setEntryBox} = useAuth();

    //Reset data when redirecting on the answers page
    const resetOnAnswers = () => {
        if(location === '/answers'){
            setTimeout(() => {
                resetSession();
                setEntryBox('');
            }, 500);
        }
    }

    return (
        <div className={styles.navBar}>
            <p className={styles.navBarPF}><Link to="/" onClick={resetOnAnswers}>Preference Finder</Link></p>
            <div className={styles.navBarOptions}>
                <p style={{color: location === '/about' ? 'lightgray' : 'white'}}
                className={styles.aboutLink}><Link to="/about" onClick={resetOnAnswers}>About</Link></p>
            </div>
        </div>
    );
}

export default Header;