<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Turn;

class ReviewController extends Controller
{
    /**
     * se va a encargar de crear una nueva review
     */
    public function saveReview()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $data = $resp['data'];

                $newReview = Review::create([
                    'score' => $data['score'],
                    'comment' => $data['comment'],
                    'turn_id' => $data['turn_id'],
                ]);

                if ($newReview) {

                    // Realizo notificacion al admin
                    $turn = Turn::with('userAlumn', 'instructTimestamp.userInstruct')->find($data['turn_id']);

                    $userId = 3;
                    $message = "Se ha realizado una reseña al instructor ".
                    $turn->instructTimestamp->userInstruct->name ." ".$turn->instructTimestamp->userInstruct->lastname." </br>
                    Podrá ingresar a <a href='" . env('APP_URL') . "reviewA'>Review</a> para verla!";
                    $motive = "Reseña realizada por ".$turn->userAlumn->name." ".$turn->userAlumn->lastname;

                    $notiC = new NotificationController();
                    $notiC->sendAllNoti($userId, $message, $motive);

                    $resp = [
                        'message' => 'Reseña realizada correctamente',
                        'data' => $newReview,
                        'ok' => true
                    ];
                } else {
                    $resp = [
                        'message' => 'Error al guardar la reseña',
                        'ok' => false
                    ];
                }
            } catch (\Exception $e) {
                $resp = [
                    'message' => 'Error en el servidor: ' . $e->getMessage(),
                    'ok' => false
                ];
            }
        }
        return $resp;
    }

    /**
     * se va a encargar de obtener las ultimas 30 reviews
     */
    public function getReviews()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {

                $reviews = Review::with([
                    'turn.instructTimestamp.userInstruct',
                    'turn.userAlumn',
                    'turn.course'
                ])->orderBy('created_at', 'desc')->get();

                $filteredReviews = $reviews->map(function ($review) {
                    return [
                        'id' => $review->id,
                        'comment' => $review->comment,
                        'score' => $review->score,
                        'instructorName' => $review->turn->instructTimestamp->userInstruct->name . ' ' . $review->turn->instructTimestamp->userInstruct->lastname,
                        'courseTitle' => $review->turn->course->title,
                        'dateTurnIni' => $review->turn->date_turn_ini,
                        'dateTurnEnd' => $review->turn->date_turn_end,
                        'alumnName' => $review->turn->userAlumn->name . ' ' . $review->turn->userAlumn->lastname,
                        'alumnEmail' => $review->turn->userAlumn->email,
                    ];
                });

                if ($reviews) {
                    $resp = [
                        'message' => 'Reseñas obtenidas correctamente',
                        'data' => $filteredReviews,
                        'ok' => true
                    ];
                } else {
                    $resp = [
                        'message' => 'Error al botener las reseñas',
                        'ok' => false
                    ];
                }
            } catch (\Exception $e) {
                $resp = [
                    'message' => 'Error en el servidor: ' . $e->getMessage(),
                    'ok' => false
                ];
            }
        }
        return $resp;
    }


    /**
     * se va a encargar de obtener las reviews que le falta por responser al usuario
     */
    public function getPendingReviews()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {

                $data = $resp['data'];

                $turnosNoRevisados = Turn::where('date_turn_end', '<', now())
                    ->where('user_alumn_id', $data['idUser'])
                    ->whereNotIn('id', function ($query) use ($data) {
                        $query->select('turn_id')
                            ->from('reviews')
                            ->whereIn('turn_id', function ($subQuery) use ($data) {
                                $subQuery->select('id')
                                    ->from('turn')
                                    ->where('date_turn_end', '<', now())
                                    ->where('user_alumn_id', $data['idUser']);
                            });
                    })
                    ->with('instructTimestamp.userInstruct')
                    ->with('course')
                    ->orderBy('date_turn_end', 'asc')
                    ->get();

                if ($turnosNoRevisados) {
                    $resp = [
                        'message' => 'Mis reseñas pedientes obtenidas correctamente',
                        'data' => $turnosNoRevisados,
                        'ok' => true
                    ];
                } else {
                    $resp = [
                        'message' => 'Error al botener las reseñas',
                        'ok' => false
                    ];
                }
            } catch (\Exception $e) {
                $resp = [
                    'message' => 'Error en el servidor: ' . $e->getMessage(),
                    'ok' => false
                ];
            }
        }
        return $resp;
    }
}
