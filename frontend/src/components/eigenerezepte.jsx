

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

    return(
        <div>

            <div>
                <h1>Hier sehen Sie ihre Rezepte</h1>
            </div>

        </div>
    );
}

export default EigeneRezepte;