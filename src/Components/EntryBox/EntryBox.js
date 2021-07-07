import React from 'react';
import styles from './EntryBox.module.css';
import {useAuth} from '../../Data/AuthContext';

function EntryBox(props) {

    const {entryBox, setEntryBox, canStartQuiz, resetSession} = useAuth();

    const changeEntryBox = e => {
        if(canStartQuiz) resetSession();
        setEntryBox(e.target.value);
    }

    return (
        <form>
            <textarea name="entry-box" className={styles.entryBox}
            placeholder="Write in here." spellCheck="true" onChange={changeEntryBox}
            value={entryBox}>

            </textarea>
        </form>
    );
}

export default EntryBox;