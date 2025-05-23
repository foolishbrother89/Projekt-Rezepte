import { jwtDecode } from 'jwt-decode';

function RezeptErstellen(){

    // hier habe ich wie bei der registrierung ein inputformular in welchen ich ein Rezept erstelle
    // Sobald ich die inputs habe schicke ich an die Backend per POST an /api/rezepte die Werte
    // Aber irgendwie muss ich die user id mitschicken, weil dieser als fremdschlüssel in die recepie tabelle mit rein muss
        //Das heist ich sollte erst die authentifizierung zu ende machen, damit RezepteErstellen() die user id aus dem localstorage mitkrigt
        
    // hole ich die userId aus ner reaktiven Variable? die ich mit login bestimme
    // oder aus localstorage? 

    // Token aus dem LocalStorage holen
    const token = localStorage.getItem('token');

    // Token decodieren
    const entschlüsselterToken = jwtDecode(token);
    const userId = entschlüsselterToken.id;

    return(
        <div>

            <div>
                <h1>Hier erstelle ich ein Rezept</h1>
                <h3>Id des Users : {userId}</h3>
            </div>

        </div>
    );
}

export default RezeptErstellen;