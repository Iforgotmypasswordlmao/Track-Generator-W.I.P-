

export class Curves
{
    /**
     * 
     * @param {Number} Scalar 
     * @param {Array<Number>} Point 
     * @returns Point multiplied by Scalar
     */
    static ScalarMultiplyPoint(Scalar, Point)
    {
        return Point.map((value) => {return value*Scalar})
    }

    /**
     * 
     * @param {Array<Number>} Point0 
     * @param {Array<Number>} Point1 
     * @returns the sum of both Points
     */
    static AddPointToPoint(Point0, Point1)
    {
        return [Point0[0] + Point1[0], Point0[1] + Point1[1]]
    }

    /**
     * 
     * @param {Array<Array<Number>>} PointsList 
     * @returns A point which is the sum of all the points
     */
    static AddPoints(PointsList)
    {
        let Sum = [0, 0]
        for (let Point in PointsList)
        {
            const ThePoint = PointsList[Point]
            Sum = this.AddPointToPoint(Sum, ThePoint)
        }
        return Sum
    }

    /**
     * 
     * @param {Number} t 
     * @param {Array<Number>} Point0 
     * @param {Array<Number>} Point1 
     * @param {Array<Number>} Point2 
     * @returns the point at t 
     */
    static BezierQuadratic(t, Point0, Point1, Point2)
    {
        const Expression = [
            this.ScalarMultiplyPoint( Math.pow(1 - t, 2) , Point0),
            this.ScalarMultiplyPoint( t  * 2 * (1 -  t) , Point1),
            this.ScalarMultiplyPoint( Math.pow(t, 2) , Point2)
        ]
        return this.AddPoints(Expression)
    }

    /**
     * 
     * @param {Number} t 
     * @param {Array<Number>} Point0 
     * @param {Array<Number>} Point1 
     * @param {Array<Number>} Point2 
     * @param {Array<Number>} Point3
     * @returns the point at t 
     */
    static BezierCubic(t, Point0, Point1, Point2, Point3)
    {
        const Expression = [
            this.ScalarMultiplyPoint( 1-t, this.BezierQuadratic(t, Point0, Point1, Point2)),
            this.ScalarMultiplyPoint( t, this.BezierQuadratic(t, Point1, Point2, Point3))
        ]
        return this.AddPoints(Expression)
    }

    /**
     * 
     * @param {Number} t 
     * @param {Array<Number>} Point0 
     * @param {Array<Number>} Point1 
     * @returns the point at t
     */
    static BezierLinear(t, Point0, Point1)
    {
        const Expression = [
            this.ScalarMultiplyPoint(1-t, Point0),
            this.ScalarMultiplyPoint(t, Point1)
        ]
        return this.AddPoints(Expression)
    }

    /**
     * 
     * @param {Number} steps 
     * @param {Array<Array<Number>>} Points 
     * @returns Sub Points of a bezier curve
     */
    static GetBezierCurve(steps, Points)
    {
        let BezierCurveFunction 
        switch(Points.length)
        {
            case 2:
                BezierCurveFunction = (t) => {
                    return this.BezierLinear(t, Points[0], Points[1])
                }
                break
            case 3:
                BezierCurveFunction = (t) => {
                    return this.BezierQuadratic(t, Points[0], Points[1], Points[2])
                }
                break
            case 4:
                BezierCurveFunction = (t) => {
                    return this.BezierCubic(t, Points[0], Points[1], Points[2], Points[3])
                }
                break
            default:
                throw Error("Invalid Amount of Points Provided, must be only 2, 3, 4 Points")
        }

        let subPoints = []
        for (let step = 0; step < 1; step += 1/steps)
        {
            subPoints.push(
                BezierCurveFunction(step)
            )
        }
        return subPoints
    }


}