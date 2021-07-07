import React from 'react';
import {Link} from 'react-router-dom';
import styles from './Header.module.css';
import {useLocation} from 'react-router-dom';

function Header(props) {
    const location = useLocation().pathname;
    return (
        <div className={styles.navBar}>
            <p className={styles.navBarPF}><Link to="/">Preference Finder</Link></p>
            <div className={styles.navBarOptions}>
                <p style={{color: location === '/about' ? 'lightgray' : 'white'}}
                className={styles.aboutLink}><Link to="/about">About</Link></p>
            </div>
        </div>
    );
}

export default Header;