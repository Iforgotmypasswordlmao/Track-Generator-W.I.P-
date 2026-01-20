export class Vector
{
    static getVectorFromPoint(Point0, Point1)
    {
        return [Point1[0] - Point0[0], Point1[1] - Point0[1]]
    }

    static getVectorMagnitude(Vector0)
    {
        return Math.sqrt(Math.pow(Vector0[0], 2) + Math.pow(Vector0[1], 2))
    }

    static getDotProduct(Vector0, Vector1)
    {
        return (Vector0[0]*Vector1[0]) + (Vector0[1]*Vector1[1])
    }

    static getAngleBetweenVectors(Vector0, Vector1)
    {
        const PRODUCTOFMAGNITUDE = this.getVectorMagnitude(Vector0)*this.getVectorMagnitude(Vector1)
        const COSANGLE = this.getDotProduct(Vector0, Vector1)/PRODUCTOFMAGNITUDE
        return Math.acos(COSANGLE)
    }

    static getAngleBetweenThreePoints(Point0, Point1, Point2)
    {
        const Vector0 = this.getVectorFromPoint(Point0, Point1)
        const Vector1 = this.getVectorFromPoint(Point1, Point2)
        return this.getAngleBetweenVectors(Vector0, Vector1)
    }

    /**
    * 
    * @param {Number} angle 
    * @param {Number} magnitude 
      @returns [x, y]
    */
    static polarToCartesian(angle, magnitude)
    {
        const x = magnitude*Math.cos(angle)
        const y = magnitude*Math.sin(angle)
        return [x, y]
    }

    static AddVector(Vector0, Vector1)
    {
        return [Vector0[0] + Vector1[0], Vector0[1] + Vector1[1]]
    }
}