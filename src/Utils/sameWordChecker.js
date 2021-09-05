export function sameWordChecker(words){
    let wordsTrimmed = words.map(word => word.toLowerCase().trim());
    let foundMatch = false;
    wordsTrimmed.forEach((word, index) => {
        if(foundMatch) return;
        if(wordsTrimmed.indexOf(word) !== -1 && wordsTrimmed.indexOf(word) !== index){
            foundMatch = true;
        }
    });
    return foundMatch;
}