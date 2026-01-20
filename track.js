import { Curves } from "./utils/curves.js"
import { Probability } from "./utils/Probability.js"
import { Vector } from "./utils/vector.js"

export class Track
{
    /**
     * 
     * @param {HTMLElement} CanvasElement 
     */
    constructor(CanvasElement)
    {
        this.CanvasElement = CanvasElement
        this.Context = CanvasElement.getContext("2d")
        this.END = 2*Math.PI
        this.Points = []
    }

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    drawPoint(x, y)
    {
        const Radius =  2
        this.Context.beginPath()
        this.Context.arc(x, y, Radius, 0, this.END)
        this.Context.fill()
    }

    /**
     * 
     * @param {Number} angle 
     * @param {Number} magnitude 
     * @returns 
     */
    getVelocity(angle, magnitude)
    {
        const Velocity = Vector.polarToCartesian(angle, magnitude)
        return Velocity
    }

    /**
     * 
     * @param {Array<Number>} Velocity 
     * @param {Number} TimeElapsed 
     * @returns 
     */
    getDeltaDistance(Velocity, TimeElapsed)
    {
        return Velocity.map((position) => {return position*TimeElapsed})
    }

    /**
     * 
     * @param {Array<Number>} Point1 
     * @param {Array<Number>} Point2 
     */
    drawPointToPoint(Point0, Point1)
    {
        const [Point0X, Point0Y] = Point0
        const [Point1X, Point1Y] = Point1
        this.Context.moveTo(Point0X, Point0Y)
        this.Context.lineTo(Point1X, Point1Y)
        this.Context.stroke()
    }

    getAngle(Angle, OffSet)
    {
        return Probability.unidist(Angle - OffSet, Angle + OffSet)
    }

    getMagnitude(Magnitude, OffSet)
    {
        return Probability.unidist(Magnitude - OffSet, Magnitude + OffSet)
    }

    /**
     * 
     * @param {Number} Steps 
     * @param {Array<Number>} Position 
     * @param {Number} StartingAngle
     * @returns 
     */
    generatePoints(Steps, Position, StartingAngle, AngleOffSet, Magnitude, MagnitudeOffSet)
    {
        let AngleSteps = this.END/Steps
        const BigPoints = []
        
        let CurrentAngle = StartingAngle
        let [CurrentX, CurrentY] = Position
        let DistanceFromStart = 0
        for (let Point = 0; Point < Steps; Point++)
        {
            const TimeElapsed = 5
            CurrentAngle += this.getAngle(AngleSteps, AngleOffSet)
            const CurrentMagnitude = this.getMagnitude(Magnitude, MagnitudeOffSet)
            let CurrentVelocity = this.getVelocity(CurrentAngle, CurrentMagnitude)
            const [DeltaX, DeltaY] = this.getDeltaDistance(CurrentVelocity, TimeElapsed)
            CurrentX += DeltaX
            CurrentY += DeltaY
            BigPoints.push([CurrentX, CurrentY])
            this.drawPoint(CurrentX, CurrentY)
            
        }

        return BigPoints
    }

    refinePoints(Points, steps, AngleThreshold)
    {
        const POINTSLENGTH = Points.length
        let RefinedPoints = []
        for (let p = 1; p < POINTSLENGTH; p++)
        {
            const ThisPoint = Points[p]
            const PrevPoint = Points[p - 1]
            const NextPoint = Points[p + 1]
            const AfterNextPoint = Points[p + 2]

            let [Angle0, Angle1] = [0, 0]

            let ListOfPoints = []
            let AmountOfPoints = 2
            if (AfterNextPoint != undefined)
            {
                Angle0 = Vector.getAngleBetweenThreePoints(PrevPoint, ThisPoint, NextPoint)
                Angle1 = Vector.getAngleBetweenThreePoints(ThisPoint, NextPoint, AfterNextPoint)
                if ( (Angle0 + Angle1) >= 2*AngleThreshold )
                {
                    ListOfPoints = [PrevPoint, ThisPoint, NextPoint, AfterNextPoint]
                    p += 2
                    AmountOfPoints = 4
                }
            }
            else if (NextPoint != undefined)
            {
                Angle0 = Vector.getAngleBetweenThreePoints(PrevPoint, ThisPoint, NextPoint)
                if (Angle0 >= AngleThreshold)
                {
                    ListOfPoints = [PrevPoint, ThisPoint, NextPoint]
                    p += 1
                    AmountOfPoints = 3
                }
            }
            ListOfPoints = (ListOfPoints.length == 0) ? [PrevPoint, ThisPoint] : ListOfPoints
            RefinedPoints.push(PrevPoint)
            const BezierSubPoints = Curves.GetBezierCurve(steps, ListOfPoints)
            BezierSubPoints.forEach((Point) => {RefinedPoints.push(Point)})
            RefinedPoints.push(ListOfPoints[AmountOfPoints - 1])
        }
        return RefinedPoints
    }

    drawCircuit()
    {
        const LastPoint = this.Points.length - 1
        for (let Point = 0; Point < LastPoint; Point++)
        {
            const CurrentPoint = this.Points[Point]
            const NextPoint = this.Points[Point + 1]
            this.drawPointToPoint(CurrentPoint, NextPoint)
        }
    }
    
    clearTrack()
    {
        this.Context.clearRect(0, 0, this.CanvasElement.width, this.CanvasElement.height)
    }

    generateTrack(Steps, Position, StartingAngle, AngleOffSet, AngleThreshold, Magnitude, MagnitudeOffSet)
    {
        this.clearTrack()
        const BigPoints = this.generatePoints(Steps, Position, StartingAngle, AngleOffSet, Magnitude, MagnitudeOffSet)
        const RefinedPoints = this.refinePoints(BigPoints, Steps, AngleThreshold)
        this.Points = RefinedPoints
        this.Points.push(this.Points[0])
        this.drawCircuit()
    }

    
}