

function RezeptErstellen(){

    // hier habe ich wie bei der registrierung ein inputformular in welchen ich ein Rezept erstelle
    // Sobald ich die inputs habe schicke ich an die Backend per POST an /api/rezepte die Werte
    // Aber irgendwie muss ich die user id mitschicken, weil dieser als fremdschlüssel in die recepie tabelle mit rein muss
        //Das heist ich sollte erst die authentifizierung zu ende machen, damit RezepteErstellen() die user id aus dem localstorage mitkrigt
        


    return(
        <div>

            <div>
                <h1>Hier erstelle ich ein Rezept</h1>
            </div>

        </div>
    );
}

export default RezeptErstellen;