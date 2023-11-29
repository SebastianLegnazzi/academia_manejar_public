import React, { createContext, useEffect, useMemo, useState } from 'react';
import HomeC from '../general/Home/Home_C/HomeC';
import packageJson from "../../../package.json";

// Crear un contexto
const HomeContext = createContext();

const controllerHome = new HomeC();

// Crear el componente Provider
const HomeProvider = ({ children }) => {

    // Aquí puedes definir el estado o los datos que deseas proporcionar en el contexto.
    const [carrousel, setCarrousel] = useState(null);
    const [viewCount, setViewCount] = useState(null);
    const [us, setUs] = useState(null);
    const [courses, setCourses] = useState(null);
    const [coursesEdit, setCoursesEdit] = useState(null);
    const [urlInstructive, setUrlInstructive] = useState(null);
    // const [video, setVideo] = useState(null);
    const [alert, setAlert] = useState({ message: '', type: 'error', status: false });
    const [openModal, setOpenModal] = useState({ message: '', title: '', subTitle: '', open: false, loading: false });
    const [actualizar, setActualizar] = useState(false);
    const [mode, setMode] = useState(localStorage.getItem('mode') ? localStorage.getItem('mode') : 'light');

    //Funcion que cierra el alert
    const handleCloseAlert = () => {
        setAlert({ message: '', type: alert.type, status: false });
    }

    useEffect(() => {
        //Busca todos los datos para el home
        if (localStorage.getItem('version') !== packageJson.version) {
            localStorage.setItem('version', packageJson.version);
            window.location.reload(true);
        }
        if ((!courses && !carrousel && !us && !urlInstructive) || actualizar) {
            controllerHome.getHome()
                .then((data) => {
                    if (data.ok) {
                        setCourses(data.data.arrayCurse);
                        setCarrousel(data.data.imgCarrosuel);
                        setUs(data.data.imgUs);
                        setUrlInstructive(data.data.urlInstructive.url);
                        // setVideo(data.data.arrayVideo);
                        setViewCount(data.data.viewCount);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        setActualizar(false);
    }, [actualizar, carrousel, courses, us, urlInstructive]);

    return (
        <HomeContext.Provider value={{
            us,
            setUs,
            carrousel,
            setCarrousel,
            courses,
            setCourses,
            coursesEdit,
            setCoursesEdit,
            setUrlInstructive,
            urlInstructive,
            handleCloseAlert,
            alert,
            setAlert,
            openModal,
            setOpenModal,
            // video,
            // setVideo,
            setActualizar,
            viewCount,
            setMode,
            mode,
        }}>
            {children}
        </HomeContext.Provider>
    );
};

export { HomeContext, HomeProvider };