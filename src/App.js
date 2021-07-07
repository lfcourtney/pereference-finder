import Header from './Components/Header/Header';
import {Switch, Route, useLocation, Redirect} from 'react-router-dom';
import Homepage from './Containers/Homepage/Homepage';
import About from './Containers/About/About';
import {AnimatePresence} from 'framer-motion';
import Quiz from './Containers/Quiz/Quiz';
import {useAuth} from './Data/AuthContext';
import Answers from './Containers/Answers/Answers';

function App() {
  const location = useLocation();

  const {canStartQuiz, canSeeAnswers} = useAuth();

  return (
    <>
    <Header />
    <AnimatePresence exitBeforeEnter>
    <Switch location={location} key={location.pathname}>
    <Route path="/" exact component={Homepage}></Route>
    <Route path="/about" component={About}></Route>
    {canStartQuiz ? <Route path="/quiz" component={Quiz}></Route> : <Redirect from="/quiz" to="/" />}
    {canSeeAnswers ? <Route path="/answers" component={Answers}></Route> : <Redirect from="/answers" to="/quiz" />}
    <Route path='*' component={Homepage}></Route>
    </Switch>
    </AnimatePresence>
    </>
  );
}

export default App;
