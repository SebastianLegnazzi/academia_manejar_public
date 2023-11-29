import React, { useContext, useEffect, useState, Suspense, lazy, useCallback } from 'react'
import { Route, Routes } from "react-router-dom";
import { UserContext } from '../Providers/UserContext';

/*================    Providers   ================*/
import { Grid, Skeleton } from '@mui/material';

/*================    COMPONENTES GENERALES   ================*/
import HomeV from '../general/Home/Home_V/HomeV';
import EstructuraV from './EstructuraV';
import PaymentsV from '../administrador/Payments/Payments_V/PaymentsV';
import ClassesItineraryV from '../instruct/ClassesItinerary/ClassesItinerary_V/ClassesItineraryV';
import ReviewV from '../alumn/Review/Review_V/ReviewV';
import ReviewAV from '../administrador/ReviewA/ReviewA_V/ReviewAV';
import StatisticsV from '../alumn/Statistics/Statistics_V/StatisticsV';

/*================    COMPONENTES ADMIN   ================*/
const LoginV = lazy(() => import("../general/Login/Login_V/LoginV"));
const RegisterV = lazy(() => import("../general/Register/Register_V/RegisterV"));
const Error404V = lazy(() => import("../general/Error404V"));
const ResetPasswordV = lazy(() => import("../general/Login/Login_V/ResetPasswordV"));
const RequestEmailV = lazy(() => import("../general/Login/Login_V/RequestEmailV"));
const ProfileV = lazy(() => import("../general/Profile/Profile_V/ProfileV"));
// const VideosV = lazy(() => import("../general/Videos/Videos_V/VideosV"));
const EditCourseV = lazy(() => import("../administrador/EditCourse/EditCourse_V/EditCourseV"));
const EditCarrouselV = lazy(() => import("../administrador/EditCarrousel/EditCarrousel_V/EditCarrouselV"));
const EditUsV = lazy(() => import("../administrador/EditUs/EditUs_V/EditUsV"));
const EditVideosV = lazy(() => import("../administrador/EditVideo/EditVideo_V/EditVideosV"));
const MainQuestionInstrV = lazy(() => import("../instruct/CommentAnswerInstr/CommentAnswerInstr_V/MainQuestionInstrV"));
const MainQuestionAlumnV = lazy(() => import("../alumn/CommentAnswerAlumn/CommentAnswerAlumn_V/MainQuestionAlumnV"));
const CalendarV = lazy(() => import("../alumn/Calendar/Calendar_V/CalendarV"));
const DateCalendarInstructV = lazy(() => import("../administrador/DateCalendarInstruct/DateCalendarInstruct_V/DateCalendarInstructV"));
const MyCurseV = lazy(() => import("../alumn/MyCurse/MyCurse_V/MyCurseV"));
const EditCarV = lazy(() => import("../administrador/EditCar/EditCar_V/EditCarV"));
const ConfigExamV = lazy(() => import("../general/Exam/Exam_V/ConfigExamV"));
const ExamV = lazy(() => import("../general/Exam/Exam_V/ExamV"));

const RutasDinamicas = () => {
    //Traigo variable con los datos del usuario logeado del provider
    const { user } = useContext(UserContext);

    //Creo state para almacenar los menus
    const [arrayMenus, setArrayMenus] = useState([]);

    //Funcion que carga todos los menus segun el rol
    const cargarMenuRol = useCallback(() => {
        if (user != null) {
            let arrayRoles = user.roleIds.split("#");
            let arrayDatosMenus
            //Me fijo de todos los roles cuales tiene para cargarle los menus
            arrayDatosMenus = arrayRoles.map((rol) => {
                let arrayMenu = []
                // Segun el rol cargo las distintas rutas posibles para visualizar
                switch (rol) {

                    //========= USUARIO =========
                    case "1":
                        arrayMenu = [
                            { componente: <ProfileV />, url: "/profile" },
                            { componente: <MainQuestionAlumnV />, url: "/main_question_alumn" },
                            { componente: <CalendarV />, url: "/turn" },
                            { componente: <StatisticsV />, url: "/statistics" },
                        ];
                        break;
                    //========= INSTRUCTOR =========
                    case "2":
                        arrayMenu = [
                            { componente: <ProfileV />, url: "/profile" },
                            { componente: <MainQuestionInstrV />, url: "/main_question_instruct" },
                            { componente: <ClassesItineraryV />, url: "/itinerary" },
                        ];
                        break;
                    //========= ADMIN =========
                    case "3":
                        arrayMenu = [
                            { componente: <ProfileV />, url: "/profile" },
                            { componente: <EditCourseV />, url: "/edit_course" },
                            { componente: <EditCarrouselV />, url: "/edit_carrousel" },
                            { componente: <EditUsV />, url: "/edit_us" },
                            { componente: <EditVideosV />, url: "/edit_video" },
                            { componente: <DateCalendarInstructV />, url: "/edit_date" },
                            { componente: <MainQuestionInstrV />, url: "/main_question_instruct" },
                            { componente: <EditCarV />, url: "/edit_car" },
                            { componente: <PaymentsV />, url: "/payments" },
                            { componente: <ReviewAV />, url: "/reviewA" },
                        ];
                        break;
                    //========= ALUMNO =========
                    case "4":
                        arrayMenu = [
                            { componente: <ProfileV />, url: "/profile" },
                            { componente: <CalendarV />, url: "/turn" },
                            { componente: <MainQuestionAlumnV />, url: "/main_question_alumn" },
                            { componente: <MyCurseV />, url: "/my_curse" },
                            { componente: <ReviewV />, url: "/review" },
                            { componente: <StatisticsV />, url: "/statistics" },
                        ];
                        break;

                    default: setArrayMenus([]);
                }
                return arrayMenu
            })
            //Elimino arrays vacios
            const arrayFiltrado = arrayDatosMenus.filter((subArray) => subArray.length > 0);
            setArrayMenus(arrayFiltrado);
        }
    }, [user]);

    // Cargo la funcion cuando se logea
    useEffect(() => {
        if (user) {
            cargarMenuRol();
        }
    }, [user, cargarMenuRol])

    //Componente que se utiliza cuando se esta cargando la pagina
    const Loading = () => {
        return (
            <EstructuraV
                render={() => (
                    // <Typography variant="h6">Cargando... <CircularProgress /></Typography>
                    <Grid container>
                        <Skeleton
                            height={200}
                            width='80%'
                            style={{ margin: 'auto' }}
                        />
                        <Skeleton
                            height={200}
                            width='80%'
                            style={{ margin: 'auto' }}
                        />
                        <Skeleton
                            height={200}
                            width='80%'
                            style={{ margin: 'auto' }}
                        />
                    </Grid>
                )} />
        )
    }

    return (
        <Suspense fallback={<Loading />}>
            <Routes>

                {/* Rutas declaradas para la vista */}
                <Route
                    path="/"
                    exact
                    element={<HomeV />} />

                <Route
                    path="/login"
                    exact
                    element={<LoginV />} />

                <Route
                    path="/reset-password/:token"
                    element={<ResetPasswordV />} />

                <Route
                    path="/request_email"
                    element={<RequestEmailV />} />

                <Route
                    path="/register"
                    exact
                    element={<RegisterV />} />

                <Route
                    path="/exam"
                    exact
                    element={<ConfigExamV />} />

                <Route
                    path="/exam/release"
                    exact
                    element={<ExamV />} />

                {/* <Route
                    path="/videos"
                    exact
                    element={<VideosV />} /> */}

                <Route
                    path="*"
                    element={<Error404V />} />

                {/* Se crean las rutas dependiendo los roles que se obtienen */}
                {arrayMenus.length > 0 &&
                    arrayMenus.map((arrayDatosMenu) => (
                        arrayDatosMenu.map((datosMenu, index) => (
                            (
                                <Route
                                    key={index}
                                    path={datosMenu.url}
                                    element={datosMenu.componente} />
                            )
                        ))
                    ))
                }
            </Routes>
        </Suspense>
    )
}

export default RutasDinamicas