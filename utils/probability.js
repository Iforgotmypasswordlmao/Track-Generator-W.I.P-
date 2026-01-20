

export class Probability
{
    /**
     * 
     * @param {Number} median 
     * @param {Number} std 
     * @returns 
     */
    static normdist(median, std)
    {
        // https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
        const u = 1 - Math.random(); // Converting [0,1) to (0,1]
        const v = Math.random();
        const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        // Transform to the desired mean and standard deviation:
        return z * std + median;
    }

    static unidist(lowerRange, upperRange)
    {
        const Range = upperRange - lowerRange
        return Math.random()*Range + lowerRange
    }
}