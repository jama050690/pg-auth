import express from "express"
import cors from "cors"

const app = express()

app.use( cors() )

app.get( "/", ( req, res ) => res.send( { o' s': true } )) 

app.listen( 3_000, () => console.info( 3_000 ) )
