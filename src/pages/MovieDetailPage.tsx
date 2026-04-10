import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Movie } from "../types/movie";

// =============================================================
// EXERCICE 3 — MovieDetailPage (8 pts)
// =============================================================
//
// Compléter cette page pour afficher le détail d'un film
// et permettre de le marquer comme "vu".
//
// Endpoints :
//   GET  /api/movies/:id               → récupérer le détail du film
//   POST /api/movies/:id/toggle-watched → basculer vu / non vu
//
// 1. (1 pt) Récupérer l'id du film depuis l'URL
//
// 2. (2 pts) Charger les données du film avec useQuery
//
// 3. (1 pt) Afficher les informations du film :
//    titre, image, réalisateur, année, genre, description
//
// 4. (4 pts) Implémenter un bouton pour basculer "vu / non vu" :
//    - Envoyer la requête POST au bon endpoint
//    - Mettre à jour l'affichage après le succès (penser à l'invalidation)
//    - Le texte du bouton doit refléter l'état actuel
//
// Classes CSS suggérées :
//   Container :   "max-w-2xl mx-auto"
//   Image :       "w-full h-64 object-cover rounded-lg"
//   Titre :       "text-3xl font-bold mt-4"
//   Sous-titre :  "text-gray-600 mt-1"
//   Description : "text-gray-700 mt-4"
//   Bouton :      "mt-4 px-4 py-2 rounded-lg text-white"
//                 + (watched ? "bg-gray-500" : "bg-green-600")
//

export const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const {
    data: movie,
    isLoading,
    error,
  } = useQuery<Movie>({
    queryKey: ["movie", id],
    queryFn: async () => await api.get<Movie>(`/api/movies/${id}`),
  });

  const { mutate: toggleWatched } = useMutation({
    mutationFn: async () =>
      await api.post<Movie>(`/api/movies/${id}/toggle-watched`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movie", id] });
    },
  });

  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;
  if (!movie) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <img
        src={movie.imageUrl}
        alt={movie.title}
        className="w-full h-64 object-cover rounded-lg"
      />
      <h1 className="text-3xl font-bold mt-4">{movie.title}</h1>
      <p className="text-gray-600 mt-1">
        {movie.director} · {movie.year} · {movie.genre}
      </p>
      <p className="text-gray-700 mt-4">{movie.description}</p>
      <button
        onClick={() => toggleWatched()}
        className={`mt-4 px-4 py-2 rounded-lg text-white ${movie.watched ? "bg-gray-500" : "bg-green-600"}`}
      >
        {movie.watched ? "Marquer comme non vu" : "Marquer comme vu"}
      </button>
    </div>
  );
};
