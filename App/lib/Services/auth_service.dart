import 'package:dio/dio.dart';
import '../models/StudyNote.dart';

class AuthService {
  final Dio _dio;
  static const String baseUrl = 'http://localhost:5000/api';

  AuthService() : _dio = Dio(BaseOptions(
    baseUrl: baseUrl,
    connectTimeout: const Duration(seconds: 5),
    receiveTimeout: const Duration(seconds: 3),
  ));

  Future<String> authLogin(String email, String password) async {
    try {
      final response = await _dio.post('/auth/login', data: {'email': email, 'password': password});
      return response.data as String;
    } catch (e) {
      throw Exception('Error al iniciar sesión: $e');
    }
  }

  Future<void> authRegister(Auth auth) async {
    try {
      await _dio.post('/auth/register', data: auth.toJson());
    } catch (e) {
      throw Exception('Error al registrarse: $e');
    }
  }
}
