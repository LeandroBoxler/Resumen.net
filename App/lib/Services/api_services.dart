import 'package:dio/dio.dart';
import '../models/StudyNote.dart';

class ApiService {
  final Dio _dio;
  static const String baseUrl = 'http://localhost:5000/api';

  ApiService() : _dio = Dio(BaseOptions(
    baseUrl: baseUrl,
    connectTimeout: const Duration(seconds: 5),
    receiveTimeout: const Duration(seconds: 3),
  ));

  Future<List<StudyNote>> getStudyNotes() async {
    try {
      final response = await _dio.get('/notes');
      final List<dynamic> data = response.data;
      return data.map((json) => StudyNote.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Error al obtener notas de estudio: $e');
    }
  }

  Future<StudyNote> createStudyNote(StudyNote studyNote) async {
    try {
      final response = await _dio.post('/notes', data: studyNote.toJson());
      return StudyNote.fromJson(response.data);
    } catch (e) {
      throw Exception('Error al crear nota de estudio: $e');
    }
  }

  Future<StudyNote> updateStudyNote(String id, StudyNote studyNote) async {
    try {
      final response = await _dio.put('/notes/$id', data: studyNote.toJson());
      return StudyNote.fromJson(response.data);
    } catch (e) {
      throw Exception('Error al actualizar nota de estudio: $e');
    }
  }

  Future<void> deleteStudyNote(String id) async {
    try {
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
