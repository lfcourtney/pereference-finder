import {sameWordChecker} from '../../Utils/sameWordChecker';
import { useState } from 'react';
import {useAuth} from '../../Data/AuthContext';
import {useAnimation} from 'framer-motion';
import {useHistory} from 'react-router-dom';

//Handle warning functionality for Homepage component if user tries to start quiz without proper formatting for textbox
function useHomePageFunction(){

    const control = useAnimation();
    const history = useHistory();

    const {entryBox, setCanStartQuiz, prepareEntries, canStartQuiz} = useAuth();
    const [warning, setWarning] = useState(null);

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
    };

    return [clickStart, warning, control];
}

export default useHomePageFunction;