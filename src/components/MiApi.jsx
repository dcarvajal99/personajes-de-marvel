import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import { default as Navbarbootstrap } from 'react-bootstrap/Navbar';

const MiApi = () => {

    /* Declaracion de variables */
    const [info, setInfo] = useState([]);
    const [personajeSeleccionado, setPersonajeSeleccionado] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [botonSeries, setBotonSeries] = useState(false);
    const [botonComics, setBotonComics] = useState(false)
    const [botonFiltro, setBotonFiltro] = useState(false)
    const [resultados, setResultados] = useState([]);
    const [inputFiltro, setInputFiltro] = useState('');
    const [orden, setOrden] = useState('asc');



    useEffect(() => {
        consultarinfo();
    }, []);


    /* funcion para realizar la peticion de la api de Marvel */

    const consultarinfo = async () => {
        const url = "https://gateway.marvel.com:443/v1/public/characters?events=29&apikey=ac5158c63cd65953c8da0d10cf5c7012&hash=3532161af70145cda446923428785bfd"
        const response = await fetch(url)
        const data = await response.json()
        console.log(data)
        setInfo(data.data.results);
    }

    /* Funcion para mostrar el modal segun el que se aprete en el navegador */

    const mostrarModalEnPantalla = (character, boton) => {
        if (boton === 1) {
            setBotonComics(true)
        } else if (boton === 2) {
            setBotonSeries(true)
        }
        else if (boton === 3) {
            setBotonFiltro(true)
        }
        setPersonajeSeleccionado(character);
        setShowModal(true);

    };

    const submitInputNavbar = e => {
        e.preventDefault();
        if (inputFiltro !== "") {
            setResultados(info.filter(colaborador =>
                colaborador.name.toLowerCase().includes(inputFiltro.toLowerCase())));

            mostrarModalEnPantalla(resultados, 3)
        }

    }

    const cerrarModal = () => {

        /* setear todos los boton en false */
        setShowModal(false);
        setBotonSeries(false);
        setBotonComics(false);
        setBotonFiltro(false);
    };

    /* sort para ordenar de a -z o de z - a */
    const sortHeroes = () => {
        setInfo([...info].sort((a, b) => {
            if (orden === 'asc') {
                return a.name.localeCompare(b.name);
            }
            return b.name.localeCompare(a.name);
        }));
        setOrden(orden === 'asc' ? 'desc' : 'asc');
    };


    console.log(inputFiltro)
    return (
        <>
            <Navbarbootstrap bg="dark" expand="lg" variant='dark' >
                <Container fluid >
                    <Navbarbootstrap.Brand href="#" >
                        <img
                            alt=""
                            src="./logo.png"
                            width="60"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        Wiki Marvel</Navbarbootstrap.Brand>
                    <Navbarbootstrap.Toggle aria-controls="navbarScroll" />
                    <Navbarbootstrap.Collapse id="navbarScroll">
                        <Navbarbootstrap
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                        >
                            <Nav.Link href="https://developer.marvel.com/">Marvel</Nav.Link>
                            <Nav.Link href="https://developer.marvel.com/documentation/getting_started">API info</Nav.Link>
                        </Navbarbootstrap>
                        <Form className="d-flex" onSubmit={submitInputNavbar}>
                            <Form.Control
                                type="text"
                                placeholder="Buscar nombre de super"
                                value={inputFiltro}
                                className="me-2"
                                aria-label="Buscar"
                                onChange={e => setInputFiltro(e.target.value)}
                            />
                            <Button type="submit" variant="outline-primary" onChange={setInputFiltro}>Buscar</Button>
                            
                        </Form>
                        <Button type="button" color="primary" className="mr-2" onClick={e =>sortHeroes(e)}>
                            Ordenar de {orden === 'asc' ? 'A a Z' : 'Z a A'}
                        </Button>
                    </Navbarbootstrap.Collapse>
                </Container>
            </Navbarbootstrap>
            <Container fluid style={{ height: "100vh" }}>
                <Row className="h-100">
                    {info.map((character) => (
                        <Col key={character.id} xs={12} sm={6} md={4} lg={3} className="my-3">
                            <Card>
                                <Card.Img variant="top" src={`${character.thumbnail.path}.${character.thumbnail.extension}`} style={{ height: "200px", objectFit: "cover" }} />
                                <Card.Body>
                                    <Card.Title variant="text-center">{character.name}</Card.Title>
                                    <div className="d-flex justify-content-between text-center">
                                        <Button variant="primary mr-2"
                                            onClick={() => mostrarModalEnPantalla(character, 1)
                                            }
                                        >
                                            Comics
                                        </Button>
                                        <Button variant="primary mr-2" onClick={() => mostrarModalEnPantalla(character, 2)}>
                                            Series
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
                {
                    <Modal show={showModal} onHide={cerrarModal} size="lg">
                        <Modal.Header closeButton>
                            {botonComics && <Modal.Title> Comics: {personajeSeleccionado.name}</Modal.Title>}
                            {botonSeries && <Modal.Title> Series: {personajeSeleccionado.name}</Modal.Title>}
                            {botonFiltro && <Modal.Title> Resultado: {inputFiltro}</Modal.Title>}
                        </Modal.Header>
                        {botonComics &&
                            <Modal.Body>
                                {personajeSeleccionado.comics &&
                                    personajeSeleccionado.comics.items.map((comic) => (
                                        <p key={comic.name}>{comic.name}</p>
                                    ))}
                            </Modal.Body>}
                        {botonSeries &&
                            <Modal.Body>
                                {personajeSeleccionado.series &&
                                    personajeSeleccionado.series.items.map((serie) => (
                                        <p key={serie.name}>{serie.name}</p>
                                    ))}

                            </Modal.Body>}
                        {botonFiltro &&
                            <Modal.Body style={{ overflow: 'auto' }}>
                                <Container fluid style={{ height: "100vh" }}>
                                    <Row className="h-100">
                                        {resultados.map((character) => (

                                            <Col key={character.id} xs={3} sm={3} md={3} lg={3} className="my-8">
                                                <Card>
                                                    <Card.Img variant="top" src={`${character.thumbnail.path}.${character.thumbnail.extension}`} style={{ height: "200px", objectFit: "cover" }} />
                                                    <Card.Body>
                                                        <Card.Title>{character.name}</Card.Title>
                                                    </Card.Body>
                                                </Card>
                                            </Col>

                                        ))}
                                    </Row>
                                </Container>
                            </Modal.Body>}

                        <Modal.Footer>
                            <Button variant="secondary" onClick={cerrarModal}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                }
            </Container>
        </>

    )
}
export default MiApi

/* {botonFiltro &&
    <Modal.Body>
    {resultados.length > 0 ? (
            {info.map((character) => (
                    <Col key={character.id} xs={12} sm={6} md={4} lg={3} className="my-3">
                        <Card>
                            <Card.Img variant="top" src={`${character.thumbnail.path}.${character.thumbnail.extension}`} style={{ height: "200px", objectFit: "cover" }} />
                            <Card.Body>
                                <Card.Title>{character.name}</Card.Title>
                                <Button variant="primary" 
                                onClick={() => mostrarModalEnPantalla(character,1)
                                        }
                                >
                                    Comics
                                </Button>
                                <Button variant="primary" onClick={() => mostrarModalEnPantalla(character, 2)}>
                                    Series
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
        ) : (
            <p>No se ha encontrado ningún resultado</p>
        )}
    </Modal.Body>
} */