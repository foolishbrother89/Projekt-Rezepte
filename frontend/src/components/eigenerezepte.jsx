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

        */ 

        
        if (response.ok) {
            setRezepte(data || []);
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

            {/* Rezepte Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rezepte.map((rezept) => {
                    const zutaten = rezept.zutaten;
                    const zubereitung = rezept.zubereitung;
            
                    return (
                      <div key={rezept.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        {/* Bild */}
                        {rezept.bild_url && (
                          <img 
                            src={`${import.meta.env.VITE_API_SERVER_URL}/uploads/${rezept.bild_url}`}
                            alt={rezept.titel}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                        )}

                        <div className="p-4">
                          {/* Titel und Status */}
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-semibold text-gray-800 flex-1 mr-2">{rezept.titel}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              rezept.public 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {rezept.public ? 'Öffentlich' : 'Privat'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
              })}
            </div>
        </div>
    );
}
export default EigeneRezepte;