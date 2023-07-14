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
    const [numOfQuestions, setNumOfQuestions] = useLocalStorage('numOfQ', 0);
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
        //console.log(answers);
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

        let answers = prepareCompareArray(preparedData);
        
        setNumOfQuestions(preparedData.length);
        setEstimatedQuestions(fibonacciGenerator(preparedData.length));
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
        let equalNames = [];
        score.forEach((data, index) => {
            let scoreP = data.score;
            for(let i = index + 1; i < score.length; i++){
                let thisScore = score[i];
                if(thisScore.score === scoreP){
                    if(equalNames.indexOf(data.data) === -1) equalNames.push(data.data);
                    if(equalNames.indexOf(thisScore.data) === -1) equalNames.push(thisScore.data);
                }
            }
        });
        if(equalNames.length > 0){
            let newAnswers = prepareCompareArray(equalNames);
            newAnswers = randomizeArray(newAnswers);
            newAnswers = entries.concat(newAnswers);
            setEntries(newAnswers);
            return true;
        }
        setCanSeeAnswers(true);
        return false;
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
        numOfQuestions,
        estimatedQuestions
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}