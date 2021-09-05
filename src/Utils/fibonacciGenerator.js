let cache = [];

export default function fibonacciGenerator(index){
    if (cache[index]) {
        return cache[index] 
     }
     else {
        if (index < 3) return 1
        else {
           cache[index] = fibonacciGenerator(index - 1, cache) + fibonacciGenerator(index - 2, cache)
        }
     }
     return cache[index];
}