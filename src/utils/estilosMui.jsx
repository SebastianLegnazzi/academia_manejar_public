const estilosLight = {
    palette: {
        background: {
            color1: '#161925', //Azul bien oscuro (este es para header oscuro mas que nada)
            color2: '#3553DB', //Azul
            color3: '#e3e3e3', //chips
            color4: '#FFC384', //Anaranjaito
            color5: '#cd7b40f0', //naranja oscurito (este es para header claro mas que nada)
            color6: 'white',
            color7: '#ffb37c', 
            color8: '#cccccc', 
        },
        btn: {
            color1: '#3553DB', //Azul
            color1H: '#1B38B8',
            color2: '#161925', //Azul bien oscuro
            color2H: '#010003',
            color3: '#FFC384', //Anaranjaito
            color3H: '#995E21', //Anaranjaito
            color4: '#F2301C', //rojito
        },
        header: {
            color1: '#161925', //Azul bien oscuro
            color2: '#FFFFFF', //blanco obviamente
        },
        letters: {
            main: '#161925', // Cambio a azul bien oscuro
            
            color2: '#161925', //azulito oscuro
            color3: '#3553DB', //azulito
            color4: '#FFFFFF', //white
            color5: '#000000', //black
            color6: '#F2301C', //rojito
            color7: '#00ff00', // Verde claro
            color8: '#c20003', // Rojo Claro
        },
        shadows: {
            color1: '5px 5px 10px rgba(23, 87, 255, 0.7)', //azul
            color2: '2px 4px 8px rgba(0, 0, 0, 0.4)' //para el fondo blanco
        }


    },
    button: {
        borderRadius: '20px',
        transition: 'box-shadow 0.3s',
        '&:hover': {
            boxShadow: '0px 0px 5px 2px rgba(0, 0, 0, 0.5)',  // Sombras para oscurecer
        },
    },
    typography: {
        fontFamily: 'Open Sans Condensed, sans-serif',
        h3: {
            fontWeight: '700',
            fontSize: '3.5rem',
            lineHeight: '4.5rem',
            marginBottom: '4rem',
            color: 'white',
        },
        h6: {
            fontSize: '1.7rem',
            lineHeight: '2.25rem',
            color: 'white',
        },

    },
    background: {
        style1: 'linear-gradient(45deg, #3553db 25%, #263fb3 25%, #1f3599 75%, #263fb3 75%, #0026d7)', //de lineas
        style2: 'radial-gradient(ellipse at center, #ffa00e00 , #fb820038)', //sombra anaranja
        style3: 'radial-gradient(ellipse at center, #ffa00e00, #0f2551)',
        style4: 'radial-gradient(ellipse at center, #ffa00e00 , #3553db9e)',//sombra azulesca
        style5: 'radial-gradient(ellipse at center, #ffa00e00 , #fb820038)', //sombra anaranja klarita
    }
};

const estilosDark = {
    
    palette: {
        mode:'dark',
        background: {
            color1: '#FFFFFF', // Cambio a blanco
            color2: '#3553DB', //Azul
            color3: '#161925', // azul oscuro pa las chips
            color4: '#161925', // Cambio a azul bien oscuro
            color5: '#FFC384', // Mantengo el mismo color para anaranjaito
            color6: '#161925',
            color7: '#452a01', 
            color8: '#1c1c1c', 
        },
        btn: {
            color1: '#3553DB', //Azul
            color1H: '#1B38B8',
            color2: '#161925', //Azul bien oscuro
            color2H: '#010003',
            color3: '#FFC384', // Mantengo el mismo color para anaranjaito
            color3H: '#995E21', // Mantengo el mismo color para anaranjaito
            color4: '#F2301C', // Mantengo el mismo color para rojito
        },
        header: {
            color1: '#000000', // Cambio a negro
            color2: '#161925', // Cambio a azul bien oscuro
        },
        letters: {
            main: '#FFC384', //Anaranjaito
            color2: '#FFC384', // Mantengo el mismo color para anaranjaito
            color3: '#000000', // Cambio a negro
            color4: '#FFFFFF', // Cambio a blanco
            color5: '#FFFFFF', // Cambio a azul bien oscuro
            color6: '#F2301C', // Mantengo el mismo color para rojito
            color7: '#005200', // Verde Oscuro
            color8: '#5c0001', // Rojo oscuro
        },
        shadows: {
            color1: '5px 5px 10px rgba(23, 87, 255, 0.7)', // Mantengo la misma sombra azul
            color2: '2px 4px 8px rgba(255, 255, 255, 0.7)',
        }
    },
    button: {
        borderRadius: '20px',
        transition: 'box-shadow 0.3s',
        '&:hover': {
            boxShadow: '0px 0px 5px 2px rgba(0, 0, 0, 0.5)', // Mantengo la sombra para oscurecer
        },
    },
    typography: {
        fontFamily: 'Open Sans Condensed, sans-serif',
        h3: {
            fontWeight: '700',
            fontSize: '3.5rem',
            lineHeight: '4.5rem',
            marginBottom: '4rem',
            color: 'white',
        },
        h6: {
            fontSize: '1.7rem',
            lineHeight: '2.25rem',
            color: 'white',
        },
    },
    background: {
       
        style1: 'linear-gradient(45deg, #020821 25%, #020821 25%, #1f3599 75%, #020821 75%, #0026d7)', // Inversión del gradiente
        style2: 'radial-gradient(ellipse at center, #f9be64 , #9e5200bd)', //sombra anaranja
        style3: 'radial-gradient(ellipse at center, #0f2551 , #061125)', //sombra azulezca oscuro
        style4: 'radial-gradient(ellipse at center, #3553db9e, #ffa00e00)', // Inversión de la sombra azulesca
        style5: 'radial-gradient(ellipse at center, #0f2551 , #061125)', // Inversión de la sombra naranja klarita2
    }
};


export { estilosLight, estilosDark };