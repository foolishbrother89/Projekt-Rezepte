import { Form, Button } from 'react-bootstrap';

function EigeneRezepte(){

    return(
        <div>
            <div>
                <h1>Hier sehen Sie ihre Rezepte</h1>
            </div>

            <Form >

                <Form.Group className="mb-3" >
                  <Form.Label>Rezept</Form.Label>

                  <Form.Text className="text-muted">
                    ??? 
                  </Form.Text>
                </Form.Group>

            </Form>

        </div>
    );
}

export default EigeneRezepte;