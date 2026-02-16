import 'package:dio/dio.dart';
import '../models/StudyNote.dart';
import 'auth_token_service.dart';

class FavoritesService {
  final Dio _dio;
  static const String baseUrl = 'http://localhost:5000/api';

  FavoritesService()
    : _dio = Dio(
        BaseOptions(
          baseUrl: baseUrl,
          connectTimeout: const Duration(seconds: 5),
          receiveTimeout: const Duration(seconds: 3),
        ),
      );

  Future<void> _addAuthHeader() async {
    final token = await AuthTokenService.getToken();
    if (token != null) {
      _dio.options.headers['Authorization'] = 'Bearer $token';
    }
  }

  Future<List<UserFavorite>> getUserFavorites() async {
    try {
      await _addAuthHeader();
      final response = await _dio.get('/user/favorites');
      final List<dynamic> data = response.data;
      return data.map((json) => UserFavorite.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Error al obtener favoritos: $e');
    }
  }

  Future<void> addFavorite(String noteId) async {
    try {
      await _addAuthHeader();
      await _dio.post('/user/favorites/$noteId');
    } catch (e) {
      throw Exception('Error al agregar favorito: $e');
    }
  }

  Future<void> removeFavorite(String noteId) async {
    try {
      await _addAuthHeader();
      await _dio.delete('/user/favorites/$noteId');
    } catch (e) {
      throw Exception('Error al eliminar favorito: $e');
    }
  }
}
