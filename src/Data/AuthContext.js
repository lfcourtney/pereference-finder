import React, {useContext} from 'react';
import useLocalStorage from './useLocalStorage';
import fibonacciGenerator from '../Utils/fibonacciGenerator';

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({children}){

    const [entryBox, setEntryBox] = useLocalStorage('entryBox', '');
    const [entries, setEntries] = useLocalStorage('entries',null);
    const [qNum, setQNum] = useLocalStorage('qNum',1);
    const [numOfOptions, setNumOfOptions] = useLocalStorage('numOfOptions', 0);
    const [estimatedQuestions, setEstimatedQuestions] = useLocalStorage('estimatedQ', 0);
    const [score, setScore] = useLocalStorage('score',[]);
    //Keep track of score for the back btn
    const [scoreTrack, setScoreTrack] = useLocalStorage('scoreTrack', []);

    //Take an array of items and create a new Array so that items can be individually compared against each other
    function prepareCompareArray(array){
        let answers = [];
        for (let i = 0; i < array.length - 1; i+=2){
            answers.push([array[i], array[i + 1]]);
        }
        //See if there is an odd item out, right at the very end
        if((array.length / 2) > answers.length){
            answers.push([array[array.length - 1]]);
        }
        console.log(answers); //GET RID
        return answers;
    }

    /**
     * Use preparedData to build scoreState
     * @param preparedData Array of the original inputs coming straight from the client
     */
    function prepareScore(preparedData){
        //Fill out score Array
        preparedData.forEach(data => {
            let obj = {data: data, score: 0};
            setScore(prev => [...prev, obj]);
        });
    }
    
    const prepareEntries = data => {
        const preparedData = data.map(entry => entry.trim());
        prepareScore(preparedData);

        setNumOfOptions(preparedData.length);

        let answers = prepareCompareArray(preparedData);
        
        //TODO: Change 'setEstimatedQuestions' based on new algorithm in use
        //setEstimatedQuestions(fibonacciGenerator(preparedData.length));
        answers = randomizeArray(answers);
        
        setEntries(answers); //Entries is the raw input information. It does not contain the score for each input. That is what the score state is for.
    }

    function randomizeArray(arr){
        let randomizeArray = [];
        for(let i = 0; i < arr.length; i++){
            let num = null;
            do{
                num = Math.floor(Math.random() * arr.length);
            }while(randomizeArray.indexOf(arr[num]) !== -1);
            randomizeArray.push(arr[num]);
        }
        return randomizeArray;
    }

    /**
     * 
     * @param choice This value comes straight from the UI depending on which option, either 1 or 2, the client selected in the quiz
     */
    function updateScore(choice){
        if(qNum <= entries.length){
        const target = entries[qNum - 1][choice];
        let targetScore = score.find(data => data.data === target);
        setScoreTrack(prev => [...prev, targetScore.data]);
        targetScore.score += 1;
        }
    }

    //User has pressed the back btn
    function goBack(){
        let deMerit = scoreTrack[scoreTrack.length - 1];
        let findScore = score.find(data => data.data === deMerit);
        findScore.score -= 1;
        setScoreTrack(prev => prev.slice(0, -1));
    }

    //See if we need to ask more questions because options have equal scores
    function detectEquals(){
        const [returnArray, returnBoolean] = helpRefitCompareArray();
        if(!returnBoolean){
            //returnArray.forEach(returnArr)
            return true;
        }
        // score.forEach((data, index) => {
        //     let scoreP = data.score;
        //     for(let i = index + 1; i < score.length; i++){
        //         let thisScore = score[i];
        //         if(thisScore.score === scoreP){
        //             if(equalNames.indexOf(data.data) === -1) equalNames.push(data.data);
        //             if(equalNames.indexOf(thisScore.data) === -1) equalNames.push(thisScore.data);
        //         }
        //     }
        // });
        // if(equalNames.length > 0){
        //     let newAnswers = prepareCompareArray(equalNames);
        //     newAnswers = randomizeArray(newAnswers);
        //     newAnswers = entries.concat(newAnswers);
        //     setEntries(newAnswers);
        //     return true;
        // }
        setCanSeeAnswers(true);
        return false;
    }

    /**
     *
     * Checks the current 'score' state for duplicate scores and returns a data structure that records all of the entries that have duplicate scores
     * @returns Array. First item is the array that is built. Second item is a Boolean. Will be true or false based on whether each item has a unique score by this point or not. In other words, will be true or false based on whether the quiz should continue or not.
     */
    function helpRefitCompareArray(){
        const returnArray = [];
        let returnBoolean = true; //Will be true if quiz can end.
        score.forEach(sd => {
            let item; //Two properties 'value' and 'items'. 'value' is a unique value. 'items' is all the data entries that pertain to that unique value. 
            const returnArrayNum = findReturnArrayNumber(returnArray, sd.score, returnArray.length - 1);
            if(returnArrayNum === -1){
                item = {value: sd.score, items: [sd.data]};
                returnArray.push(item);
            }else{
                returnArray[returnArrayNum].items.push(sd.data);
                returnBoolean = false;
            }
        });
        return [returnArray, returnBoolean];
    }

    /**
     * Related to the 'helpRefitCompareArray' function. Tries to find the index at which an object related to the provided score exists within the 'returnArray' Array param
     * @param returnArray From 'helpRefitCompareArray' function. 
     * @param score Score from the 'returnArray' param that this function is looking to find
     * @param index Index to return if necessary
     * @returns {number} -1 if there is no object related to the current score within the array. Otherwise, the actual index will be returned.
     */
    function findReturnArrayNumber(returnArray, score, index){
        if(index < 0){
            return -1;
        }
        if(returnArray[index].value === score){
            return index;
        }
        return findReturnArrayNumber(returnArray, score, index - 1);
    }


    const [canStartQuiz, setCanStartQuiz] = useLocalStorage('canStart', false); //Used for Route Security, so that clients cannot access quiz until they are properly authorised to
    const [canSeeAnswers, setCanSeeAnswers] = useLocalStorage('canSeeAnswers', false); //Used for Route Security, so that clients cannot access answers until they are properly authorised to

    //Reset Session So That Progress Is No Longer Saved
    function resetSession(){
        setCanStartQuiz(false);
        setEntries(null);
        setQNum(1);
        setScore([]);
        setScoreTrack([]);
        setCanSeeAnswers(false);
    }

    //Prepare score so that entries are listed in order
    function orderScore(){
        let orderScore = score.sort((a, b) => (a.score < b.score) ? 1 : -1);
        return orderScore;
    }

    const value = {
        entryBox,
        setEntryBox,
        canStartQuiz,
        setCanStartQuiz,
        prepareEntries,
        entries,
        score,
        qNum,
        setQNum,
        updateScore,
        resetSession,
        detectEquals,
        setCanSeeAnswers,
        canSeeAnswers,
        orderScore,
        goBack,
        numOfOptions,
        estimatedQuestions
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}