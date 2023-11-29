<?php

use App\Http\Controllers\CalendarController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\ClassesController;
use App\Http\Controllers\CommentAnswerController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DebtController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\InstructTimestampController;
use App\Http\Controllers\MercadoPagoController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\StaticsController;
use App\Http\Controllers\TurnController;
use App\Http\Controllers\UrlDataController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

//========== UserAuth ==========
Route::middleware('jwt.verify')->group(function () {
    //========== UserController ==========
    Route::post('/loginAutomatic', [UserController::class, 'loginAutomatic']);
    Route::post('/update_user', [UserController::class, 'updateUser']);
    Route::post('/searchInstruct', [UserController::class, 'getInstruct']);
    // Route::post('/get_user', [UserController::class, 'getUsers']);
    // Route::post('/delete_user', [UserController::class, 'deleteUser']);


    //========== InstructorTimestamp ==========
    Route::post('/saveInstrucTimestamp', [InstructTimestampController::class, 'saveInstructorTimestamp']);
    Route::post('/getInstructTimestamp', [InstructTimestampController::class, 'getInstructTimestamp']);

    //========== ImgController ==========
    // Route::post('/saveImg', [ImgController::class, 'saveImg']);
    // Route::post('/getImg', [ImgController::class, 'getImg']);
    // Route::post('/deleteImg', [ImgController::class, 'deleteImg']);

    //========== CourseController ==========
    Route::post('/saveCourse', [CourseController::class, 'saveCourse']);
    Route::post('/editCourse', [CourseController::class, 'editCourse']);
    Route::post('/deleteCourse', [CourseController::class, 'deleteCourse']);
    Route::post('/deactivateCourse', [CourseController::class, 'deactivateCourse']);
    Route::post('/getCourse', [CourseController::class, 'getCourse']);
    // Route::post('/getCourse', [CourseController::class, 'getCourse']);
    // Route::post('/activateCourse', [CourseController::class, 'activateCourse']);
    // Route::post('/desactivateCourse', [CourseController::class, 'desactivateCourse']);

    //========== Car ==========
    Route::post('/getCar', [CarController::class, 'getCar']);
    Route::post('/saveCar', [CarController::class, 'saveCar']);
    Route::post('/deleteCar', [CarController::class, 'deleteCar']);
    Route::post('/editCar', [CarController::class, 'editCar']);

    //========== UsController ==========
    // Route::post('/saveUs', [UsController::class, 'createUs']);
    // Route::post('/editUs', [UsController::class, 'modifyUs']);
    // Route::post('/deleteUs', [UsController::class, 'deleteUs']);

    //========== VideoController ==========
    // Route::post('/editVideo', [VideoController::class, 'editVideo']);
    // Route::post('/deleteVideo', [VideoController::class, 'deleteVideo']);
    // Route::post('/activatedVideo', [VideoController::class, 'activateVideo']);
    // Route::post('/getAllVideo', [VideoController::class, 'getAllVideo']);
    // Route::post('/getVideo', [VideoController::class, 'getVideo']);

    //========== CommentAnswer ==========
    Route::post('/getAllQuestion', [CommentAnswerController::class, 'getAllQuestion']);
    Route::post('/createQuestion', [CommentAnswerController::class, 'createQuestion']);
    Route::post('/getPendingQuestion', [CommentAnswerController::class, 'getPendingQuestion']);
    Route::post('/responseQuestion', [CommentAnswerController::class, 'responseQuestion']);
    // Route::post('/editAnswer', [CommentAnswerController::class, 'editAnswer']);
    Route::post('/searchQuestion', [CommentAnswerController::class, 'searchQuestion']);
    Route::post('/getForUser', [CommentAnswerController::class, 'getForUser']);

    //========== CalendarController ==========
    Route::post('/getCalendar', [CalendarController::class, 'getCalendar']);
    Route::post('/saveCalendar', [CalendarController::class, 'saveCalendar']);

    //========== Turn Controller ==========
    Route::post('/getMyCourse', [TurnController::class, 'getMyCourse']);
    Route::post('/getMyCourse', [TurnController::class, 'getMyCourse']);

    //========== MercadoPago ==========
    Route::post('/createPreference', [MercadoPagoController::class, 'createPreference']);

    //========== Debt ==========
    Route::post('/editDebtSould', [DebtController::class, 'editDebtSould']);
    Route::post('/darBajaDebt', [DebtController::class, 'darBajaDebt']);

    //========== Classes ==========
    Route::post('/getClassesForDate', [ClassesController::class, 'getClassesForDate']);
    Route::post('/setAssis', [ClassesController::class, 'setAssis']);
    Route::post('/setObservation', [ClassesController::class, 'setObservation']);
    Route::post('/setCancelled', [ClassesController::class, 'setCancelled']);
    Route::post('/getClassesStatistics', [ClassesController::class, 'getClassesStatistics']);

    //========== UrlDataController ==========
    Route::post('/deleteData', [UrlDataController::class, 'deleteUrlData']);
    Route::post('/addData', [UrlDataController::class, 'addUrlData']);

    //========== Turn Controller ==========
    Route::post('/saveTurn', [TurnController::class, 'saveTurn']);
    Route::post('/editTurn', [TurnController::class, 'editTurn']);

    //========== Notificaiones ==========
    Route::post('/getNoti', [NotificationController::class, 'getNoti']);
    Route::post('/sendNoti', [NotificationController::class, 'sendNoti']);
    Route::post('/deleteNoti', [NotificationController::class, 'deleteNoti']);

    //========== Reviews Controller ==========
    Route::post('/getPendingReviews', [ReviewController::class, 'getPendingReviews']);
    Route::post('/saveReview', [ReviewController::class, 'saveReview']);
    Route::post('/getReviews', [ReviewController::class, 'getReviews']);

    //========== Estadisticas Examen ==========
    Route::post('/statisticExam', [ExamController::class, 'statisticExam']);

    //========== Estadisticas ==========
    Route::post('/getStatics', [StaticsController::class, 'getStatics']);
});

//========== MercadoPago ==========
Route::post('/obtenerPago', [MercadoPagoController::class, 'obtenerPago']);

//========== Examen ==========
Route::post('/getExam', [ExamController::class, 'getExam']);
Route::post('/getType', [ExamController::class, 'getType']);
Route::post('/finishExam', [ExamController::class, 'finishExam']);

//========== UserController ==========
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::post('/forgetPass', [UserController::class, 'sendResetLinkEmail']);
Route::post('/tokenPass', [UserController::class, 'tokenPass']);
Route::post('/modifyPass', [UserController::class, 'modifyPass']);

//========== EmailController ==========
Route::post('/sendEmail', [EmailController::class, 'sendEmail']);

//========== UrlDataController ==========
Route::post('/getHome', [UrlDataController::class, 'getHome']);

//========== CalendarController ==========
Route::post('/getCalendar', [CalendarController::class, 'getCalendar']);

//========== Turn Controller ==========
Route::post('/getAvailableTurnsTimes', [TurnController::class, 'getAvailableTurnsTimes']);
Route::post('/getTurnsExeptPay', [TurnController::class, 'getTurnsExeptPay']);

//========== InstructTimesTamp ==========
Route::post('/getDatesInstruct', [InstructTimeStampController::class, 'getDatesInstruct']);

Route::post('/sendAllNoti', [NotificationController::class, 'sendAllNoti']);
