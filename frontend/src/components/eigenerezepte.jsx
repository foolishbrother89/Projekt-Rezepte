import { useState, useEffect } from 'react';


function EigeneRezepte(){

    // Hier sollen die eigenen Rezepte angezeigt werden 
    // Also frage ich die backend: hole mir alle rezepte von diesem user
    // dann zeige ich diese

    // Erstellen Knopf verlinkt zu rezepteerstellen.jsx?
    
    // Jedes Element in der Liste hat -> Die Liste wird später zu Karten gemacht
            // eine Detailansicht Knopf  -> Verlinkung zu deteilansicht.jsx
            // einen Veröfentlichen Knopf -> noch keine idee wie das funktionieren soll - Die veröffentlichten Rezepte haben nur ein Deteilansicht Knopf
            // einen Lösch Knopf -> DELETE anfrage an die Backend user id muss mitgeschickt werden
            // einen Bearbeiten Knopf -> wiederverwendung von der erstellen form?

    //Debug code an oder ausmachen!
    const debug = true;
// Rezepte anfragen an die backend
//########################################################################################################################################################
    
    // Feld für Rezepte
    const [rezepte, setRezepte] = useState([]);
    // Feld für Error
    const [error, setError] = useState(null);

    // Rezepte beim Laden der Komponente holen
    useEffect(() => {
      fetchEigeneRezepte();
    }, []);

    // Rezepte vom Backend holen
    const fetchEigeneRezepte = async () => {
      try {
        // User eingelogt?
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Sie müssen eingeloggt sein, um Ihre Rezepte zu sehen.');
          return;
        }

        // 
        const response = await fetch(`${import.meta.env.VITE_API_SERVER_URL}/api/eigene-rezepte`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        // Was kommt an?
        if(debug){
            console.log("API Response:", data);
        }
        /*
        Beispiel was in data ankommt
        {
            rezepte: {
              id: 1,
              titel: "Eier",
              bild_url: "b0a9af2a...",
              // ... andere Eigenschaften
              zubereitung: Array [ "braten", "" ],
              zutaten: Array [ {…} ]
            }
        }
        */ 

        
        if (response.ok) {
            setRezepte(data.rezepte || []);
        } else {
          setError(data.message || 'Fehler beim Laden der Rezepte.'); //Der Fallback || wenn es kein data.message gibt dann nutze den string
        }
      } catch (error) {
        setError('Netzwerkfehler beim Laden der Rezepte.');
      }
    };

// Rezepte anfragen Ende
//########################################################################################################################################################
    return (
        <div>

            <div>
                <h1>Hier sehen Sie ihre Rezepte</h1>
            </div>

        </div>
    );
}

export default EigeneRezepte;