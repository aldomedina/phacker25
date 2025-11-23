import * as dat from "dat.gui"
//import Stats from "three/examples/jsm/libs/stats.module.js";
import Stats from "stats-gl";

export default class Debug
{
    constructor()
    {
        this.active = false;

        if(this.active)
        {
            this.ui = new dat.GUI();
           
           // this.stats = new Stats();
            this.stats = new Stats({
                trackGPU: true,
                trackHz: true,
                trackCPT: true,
                logsPerSecond: 4,
                graphsPerSecond: 30,
                samplesLog: 40, 
                samplesGraph: 10, 
                precision: 2, 
                horizontal: true,
                minimal: false, 
                mode: 0
            });
            
           document.body.appendChild( this.stats.dom );
        }
       
    }
}