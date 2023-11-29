import React, { createContext, useContext, useEffect, useState } from 'react';
import LoginC from '../general/Login/Login_C/LoginC';
import { HomeContext } from './HomeContext';
import { useNavigate } from 'react-router-dom';

// Crear un contexto
const UserContext = createContext();
const controllerLoginC = new LoginC();

// Crear el componente Provider
const UserProvider = ({ children }) => {
    const navigate = useNavigate();

    const { setOpenModal, setAlert } = useContext(HomeContext);

    // Aquí puedes definir el estado o los datos que deseas proporcionar en el contexto.
    const [rol, setRol] = useState(false);
    const [menues, setMenues] = useState(false);
    const [user, setUser] = useState(null);

    //FormPersonalV
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [courses, setCourses] = useState(null);

    //FormUserV
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');

    const [error, setError] = useState(true);

    //Funcion que cierra la sesion
    const cerrarSesion = () => {
        setUser(null);
        setMenues(null);
        setRol({
            alumno: false,
            instructor: false,
            administrador: false
        });
        //Borro todos los datos del localstorage menos el "mode"
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (key !== 'mode') {
                localStorage.removeItem(key);
            }
        }
        navigate('/');
    }

    //Funcion que carga datos del usuario
    const setData = (user, arrayMenu, token) => {
        if (token) {
            localStorage.setItem("token", token);
        }
        // verifico los roles
        setRol({
            admin: user.roleIds.split("#").indexOf("3") !== -1,
            instruct: user.roleIds.split("#").indexOf("2") !== -1,
            alumn: user.roleIds.split("#").indexOf("4") !== -1,
            user: user.roleIds.split("#").indexOf("1") !== -1,
        });
        // seteo los menus
        console.log(arrayMenu)
        let menuRol = (arrayMenu.map((menu) => {                  //Almaceno todas las rutas del menu segun el rol
            const elements = menu.routes.split("#");            //Separo las rutas y sus nombres
            const menuRutas = [];                               //Creo el array que va a contener todas sus rutas segun el rol
            elements.forEach((element) => {                     //Recorro todas las rutas y separo por cada una y almaceno en el array
                const elementSplit = element.split("^");
                if (elementSplit[1] !== undefined) {
                    menuRutas.push({
                        url: elementSplit[0],
                        name: elementSplit[1].replace("-", " "),    //Reemplazo los guiones por espacios
                    });
                }

            });
            let objMenu = {
                rolName: menu.rolName,
                icono: menu.icon,
                routes: menuRutas,
            };

            return objMenu;
        }));
        // console.log(menuRol)
        localStorage.setItem("menuIndex", 0);
        setMenues(menuRol);
        setUser(user);
    }

    // Funcion que se ejecuta siempre que tengamos el token para iniciar automaticamente la sesion
    useEffect(() => {
        //Verificamos si ya esta ingresado el usuario
        const token = localStorage.getItem("token");
        if (token) {
            setOpenModal({ message: 'Cargando datos...', title: 'Iniciando sesión', open: true, loading: true })
            controllerLoginC.loginAutomatic(token)
                .then((res) => {
                    setOpenModal({ open: false })
                    if (res.ok) {
                        setData(res.data.user, res.data.menues, null);
                    }
                }).catch((err) => {
                    setOpenModal({ open: false })
                    setAlert({ message: 'Error con el servidor, por favor intentelo mas tarde', type: 'error', status: true })
                    console.log(err);
                });
        }
    }, [setAlert, setOpenModal]);

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            cerrarSesion,
            name,
            setName,
            lastname,
            setLastname,
            email,
            setEmail,
            rol,
            setRol,
            username,
            setUsername,
            password,
            setPassword,
            passwordRepeat,
            setPasswordRepeat,
            error,
            setError,
            setData,
            menues,
            setCourses,
            courses,
        }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };