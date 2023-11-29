import { createContext, useState, useEffect } from 'react'

const DispositivoContext = createContext({});

const DispositivoProvider = ({ children }) => {
    //Movil esta definido en 900px, según Material-UI
    const anchoMd = 1200;
    const [esMovil, setEsMovil] = useState(window.innerWidth < anchoMd);

    function handleWindowResize() {
        const ancho = window.innerWidth;
        if (ancho < anchoMd) {
            setEsMovil(true);
        } else {
            setEsMovil(false);
        }
    }

    useEffect(() => {
        window.addEventListener("resize", handleWindowResize);
        return function () {
            window.removeEventListener("resize", handleWindowResize);
        }
    }, [])
    /* Como se usa un contexto, se inicializa el tipo de dispositivo en el Proveedor del contexto*/
    return (
        <DispositivoContext.Provider value={{ esMovil }}>
            {children}
        </DispositivoContext.Provider>
    );
};

export { DispositivoProvider, DispositivoContext }