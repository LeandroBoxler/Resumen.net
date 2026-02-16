import 'package:dio/dio.dart';
import 'dart:typed_data';
import '../models/StudyNote.dart';
import 'auth_token_service.dart';

class ApiService {
  final Dio _dio;
  static const String baseUrl = 'http://localhost:5000/api';

  ApiService()
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

  Future<List<StudyNote>> getStudyNotes() async {
    try {
      final response = await _dio.get('/notes');
      final List<dynamic> data = response.data;
      return data.map((json) => StudyNote.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Error al obtener notas de estudio: $e');
    }
  }

  Future<List<StudyNote>> getUserStudyNotes() async {
    try {
      await _addAuthHeader();
      final response = await _dio.get('/notes/my');
      final List<dynamic> data = response.data;
      return data.map((json) => StudyNote.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Error al obtener tus notas: $e');
    }
  }

  Future<void> createStudyNote(StudyNote studyNote) async {
    try {
      await _addAuthHeader();
      await _dio.post('/notes', data: studyNote.toJson());
    } catch (e) {
      throw Exception('Error al crear nota de estudio: $e');
    }
  }

  Future<String> getPresignedUrl({
    required String fileName,
    required String contentType,
  }) async {
    try {
      await _addAuthHeader();
      final response = await _dio.post(
        '/presigned',
        data: {'fileName': fileName, 'contentType': contentType},
      );

      final url = response.data['url'] as String?;
      if (url == null || url.isEmpty) {
        throw Exception('La API no devolvió URL presignada');
      }

      return url;
    } catch (e) {
      throw Exception('Error al obtener URL presignada: $e');
    }
  }

  Future<String> uploadPdfAndGetPublicUrl({
    required Uint8List fileBytes,
    required String fileName,
  }) async {
    try {
      final presignedUrl = await getPresignedUrl(
        fileName: fileName,
        contentType: 'application/pdf',
      );

      final uploadDio = Dio(); 

      print("PRESIGNED URL: $presignedUrl");

      await uploadDio.put(
        presignedUrl,
        data: fileBytes,
       
      );

      final uri = Uri.parse(presignedUrl);
      
      String baseUrl;
      if (uri.hasPort && 
          !((uri.scheme == 'https' && uri.port == 443) || 
            (uri.scheme == 'http' && uri.port == 80))) {
        baseUrl = '${uri.scheme}://${uri.host}:${uri.port}';
      } else {
        baseUrl = '${uri.scheme}://${uri.host}';
      }
      
      final publicUrl = '$baseUrl${uri.path}';
      
      return publicUrl;
    } catch (e) {
      throw Exception('Error al subir PDF: $e');
    }
  }

  Future<StudyNote> updateStudyNote(String id, StudyNote studyNote) async {
    try {
      await _addAuthHeader();
      final response = await _dio.put('/notes/$id', data: studyNote.toJson());
      return StudyNote.fromJson(response.data);
    } catch (e) {
      throw Exception('Error al actualizar nota de estudio: $e');
    }
  }

  Future<void> deleteStudyNote(String id) async {
    try {
      await _addAuthHeader();
      await _dio.delete('/notes/$id');
    } catch (e) {
      throw Exception('Error al eliminar nota de estudio: $e');
    }
  }

  Future<StudyNote> getStudyNote(String id) async {
    try {
      final response = await _dio.get('/notes/$id');
      return StudyNote.fromJson(response.data);
    } catch (e) {
      throw Exception('Error al obtener notas de estudio: $e');
    }
  }
}
