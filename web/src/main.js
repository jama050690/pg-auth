import "./style.css";

const json = await ( await fetch( "http://localhost:3000" ) ).json()

console.log( json )
