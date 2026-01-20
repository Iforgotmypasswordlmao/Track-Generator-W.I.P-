import { Track } from "./track.js";


function main()
{
    
    const canvas = document.getElementById("canvas")
    const course = new Track(canvas)
    const options = new GUI()
    const controls = {
        "Steps": 20,
        "x": 400,
        "y": 200,
        "Angle": 0,
        "Angle-Offset": Math.PI/4,
        "Angle-Threshold": Math.PI/6,
        "Magnitude": 5,
        "Magnitude-Offset": 2,
        "Generate": function(){
            course.generateTrack(
                this["Steps"], 
                [ this["x"], this["y"] ], 
                this["Angle"],
                this["Angle-Offset"],
                this["Angle-Threshold"],
                this["Magnitude"],
                this["Magnitude-Offset"]
            )
        }

    }
    options.add( controls, "Steps")
    const Position = options.addFolder( 'Position' )
    Position.add( controls, "x", 0, canvas.width, 1)
    Position.add( controls, "y", 0, canvas.height, 1)
    const Angle = options.addFolder( 'Angle' )
    Angle.add( controls, "Angle", 0, 2*Math.PI)
    Angle.add( controls, "Angle-Offset", 0, Math.PI)
    Angle.add( controls, "Angle-Threshold", 0, Math.PI)
    const Magnitude = options.addFolder( 'Magnitude' )
    Magnitude.add( controls, "Magnitude")
    Magnitude.add ( controls, "Magnitude-Offset")

    options.add( controls, "Generate")
    controls['Generate']()
}

window.onload = () => {
    main()
}